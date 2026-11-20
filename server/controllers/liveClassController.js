import LiveClass from '../models/LiveClass.js';
import Course from '../models/Course.js';
import Notification from '../models/Notification.js';

// @desc    Get live classes (filters for upcoming, live, completed)
// @route   GET /api/live-classes
// @access  Public (or Private)
export const getLiveClasses = async (req, res, next) => {
  try {
    const { status, courseId } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (courseId) {
      query.course = courseId;
    }

    const liveClasses = await LiveClass.find(query)
      .populate('course', 'title thumbnail slug')
      .populate('instructor', 'name avatar headline')
      .sort({ scheduledAt: 1 });

    res.status(200).json({
      success: true,
      count: liveClasses.length,
      liveClasses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single live class details
// @route   GET /api/live-classes/:id
// @access  Private
export const getLiveClassById = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id)
      .populate('course', 'title thumbnail')
      .populate('instructor', 'name avatar headline bio')
      .populate('attendees.student', 'name avatar');

    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class session not found.' });
    }

    res.status(200).json({
      success: true,
      liveClass,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule a new live class
// @route   POST /api/live-classes
// @access  Private (Instructor, Admin)
export const createLiveClass = async (req, res, next) => {
  try {
    const { title, courseId, description, scheduledAt, durationMinutes } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const roomId = `learnease-room-${Date.now().toString(36)}`;
    const meetingUrl = `https://meet.jit.si/${roomId}`;

    const liveClass = await LiveClass.create({
      title,
      course: courseId,
      instructor: req.user.id,
      description: description || '',
      scheduledAt: new Date(scheduledAt),
      durationMinutes: Number(durationMinutes) || 60,
      meetingUrl,
      meetingId: roomId,
      passcode: 'LEARN' + Math.floor(100 + Math.random() * 900),
      status: 'scheduled',
    });

    res.status(201).json({
      success: true,
      message: 'Live class scheduled successfully!',
      liveClass,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update live class (status, recording URL, times)
// @route   PUT /api/live-classes/:id
// @access  Private (Instructor, Admin)
export const updateLiveClass = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found.' });
    }

    if (liveClass.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const updated = await LiveClass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Live class updated successfully.',
      liveClass: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark attendance when student joins live class
// @route   POST /api/live-classes/:id/join
// @access  Private (Student)
export const markAttendance = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found.' });
    }

    const alreadyAttended = liveClass.attendees.some(
      (a) => a.student.toString() === req.user.id
    );

    if (!alreadyAttended) {
      liveClass.attendees.push({
        student: req.user.id,
        joinedAt: new Date(),
      });
      await liveClass.save();
    }

    res.status(200).json({
      success: true,
      message: 'Attendance recorded. Entering live session.',
      meetingUrl: liveClass.meetingUrl,
      meetingId: liveClass.meetingId,
      passcode: liveClass.passcode,
    });
  } catch (error) {
    next(error);
  }
};

