import CourseRequest from '../models/CourseRequest.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/Notification.js';
import ChatRoom from '../models/ChatRoom.js';

// @desc    Request access to a course
// @route   POST /api/course-requests
// @access  Private (Student)
export const createCourseRequest = async (req, res, next) => {
  try {
    const { courseId, reason } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Check if student already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course.',
      });
    }

    // Check if student has pending request
    const existingRequest = await CourseRequest.findOne({
      student: req.user.id,
      course: courseId,
      status: 'pending',
    });
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending access request for this course.',
      });
    }

    const request = await CourseRequest.create({
      student: req.user.id,
      course: courseId,
      instructor: course.instructor,
      reason: reason || 'I would like to enroll in this course to build my practical skills.',
      status: 'pending',
    });

    // Notify instructor
    await Notification.create({
      recipient: course.instructor,
      title: 'New Course Access Request',
      message: `${req.user.name} has requested access to your course "${course.title}".`,
      type: 'request',
      link: '/dashboard/instructor/requests',
    });

    res.status(201).json({
      success: true,
      message: 'Course access request submitted successfully. The instructor will review your request shortly.',
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's course requests
// @route   GET /api/course-requests/my-requests
// @access  Private (Student)
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await CourseRequest.find({ student: req.user.id })
      .populate('course', 'title thumbnail price slug')
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get access requests for instructor or admin
// @route   GET /api/course-requests
// @access  Private (Instructor, Admin)
export const getCourseRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (req.user.role === 'instructor') {
      query.instructor = req.user.id;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const requests = await CourseRequest.find(query)
      .populate('student', 'name email avatar')
      .populate('course', 'title thumbnail price slug')
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject course request
// @route   PUT /api/course-requests/:id/status
// @access  Private (Instructor, Admin)
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const request = await CourseRequest.findById(req.params.id)
      .populate('course')
      .populate('student');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (
      req.user.role !== 'admin' &&
      request.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this request.',
      });
    }

    request.status = status;
    request.adminNote = adminNote || (status === 'approved' ? 'Request approved. Enjoy learning!' : 'Request rejected.');
    request.respondedBy = req.user.id;
    request.respondedAt = new Date();
    await request.save();

    if (status === 'approved') {
      // Create Enrollment if not exists
      let enrollment = await Enrollment.findOne({
        student: request.student._id,
        course: request.course._id,
      });

      if (!enrollment) {
        enrollment = await Enrollment.create({
          student: request.student._id,
          course: request.course._id,
          status: 'active',
          progressPercentage: 0,
          completedLessons: [],
        });

        await Course.findByIdAndUpdate(request.course._id, { $inc: { enrolledCount: 1 } });

        // Add to course chatroom
        let chatRoom = await ChatRoom.findOne({ course: request.course._id, type: 'course' });
        if (chatRoom && !chatRoom.participants.includes(request.student._id)) {
          chatRoom.participants.push(request.student._id);
          await chatRoom.save();
        }
      }

      // Notify student
      await Notification.create({
        recipient: request.student._id,
        title: '🎉 Course Access Approved!',
        message: `Your request to access "${request.course.title}" has been approved! You can now start learning.`,
        type: 'request',
        link: `/learn/${request.course._id}`,
      });
    } else {
      // Notify rejection
      await Notification.create({
        recipient: request.student._id,
        title: 'Course Access Request Update',
        message: `Your request for "${request.course.title}" was not approved at this time: ${request.adminNote}`,
        type: 'request',
        link: `/courses/${request.course.slug}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Course request ${status} successfully.`,
      request,
    });
  } catch (error) {
    next(error);
  }
};

