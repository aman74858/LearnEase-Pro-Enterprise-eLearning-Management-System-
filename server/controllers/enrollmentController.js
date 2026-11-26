import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Certificate from '../models/Certificate.js';
import Notification from '../models/Notification.js';
import ChatRoom from '../models/ChatRoom.js';

// @desc    Enroll in a free course
// @route   POST /api/enrollments/free/:courseId
// @access  Private (Student)
export const enrollFreeCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!course.isFree && course.price > 0) {
      return res.status(400).json({
        success: false,
        message: 'This course requires payment. Please use the checkout option.',
      });
    }

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

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      status: 'active',
      progressPercentage: 0,
      completedLessons: [],
    });

    // Increment course enrolled count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    // Add user to course ChatRoom
    let chatRoom = await ChatRoom.findOne({ course: courseId, type: 'course' });
    if (chatRoom) {
      if (!chatRoom.participants.includes(req.user.id)) {
        chatRoom.participants.push(req.user.id);
        await chatRoom.save();
      }
    } else {
      await ChatRoom.create({
        name: `${course.title} Discussion`,
        type: 'course',
        course: courseId,
        participants: [req.user.id, course.instructor],
      });
    }

    // Create notification for student
    await Notification.create({
      recipient: req.user.id,
      title: 'Course Enrollment Successful!',
      message: `You have successfully enrolled in ${course.title}. Start learning today!`,
      type: 'enrollment',
      link: `/learn/${course._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course!',
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        populate: [
          { path: 'category', select: 'name slug color icon' },
          { path: 'instructor', select: 'name avatar headline' },
        ],
      })
      .populate('certificate')
      .sort({ updatedAt: -1 });

    const totalEnrolled = enrollments.length;
    const completed = enrollments.filter((e) => e.status === 'completed' || e.progressPercentage === 100).length;
    const inProgress = totalEnrolled - completed;

    res.status(200).json({
      success: true,
      enrollments,
      stats: {
        totalEnrolled,
        completed,
        inProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrollment details for a specific course
// @route   GET /api/enrollments/course/:courseId
// @access  Private
export const getEnrollmentByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    }).populate('certificate');

    if (!enrollment) {
      return res.status(200).json({
        success: true,
        isEnrolled: false,
        enrollment: null,
      });
    }

    res.status(200).json({
      success: true,
      isEnrolled: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update learning progress (mark lesson completed / toggle)
// @route   POST /api/enrollments/course/:courseId/progress
// @access  Private (Student)
export const updateProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonId, isCompleted = true } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment record not found for this course.',
      });
    }

    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const completedSet = new Set(enrollment.completedLessons.map((id) => id.toString()));

    if (isCompleted) {
      completedSet.add(lessonId.toString());
      enrollment.lastAccessedLesson = lessonId;
    } else {
      completedSet.delete(lessonId.toString());
    }

    enrollment.completedLessons = Array.from(completedSet);

    const progressPercentage = totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

    enrollment.progressPercentage = Math.min(100, progressPercentage);

    if (enrollment.progressPercentage === 100 && enrollment.status !== 'completed') {
      enrollment.status = 'completed';

      // Check if certificate already exists
      let cert = await Certificate.findOne({
        student: req.user.id,
        course: courseId,
      });

      if (!cert) {
        // Generate a certificateId and fetch course info
        const generatedId = `LEP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const course = await Course.findById(courseId).populate('instructor', 'name');
        cert = await Certificate.create({
          certificateId: generatedId,
          student: req.user.id,
          course: courseId,
          instructor: course.instructor._id,
          studentName: req.user.name || 'Student',
          courseTitle: course.title,
          instructorName: course.instructor.name,
          grade: 'A - Mastery',
          verificationUrl: `/verify-certificate`,
        });

      }

      enrollment.certificate = cert._id;
      enrollment.certificateGenerated = true;

      await Notification.create({
        recipient: req.user.id,
        title: '🎉 Congratulations! Course Completed',
        message: `You have completed all lessons! Your certificate is now ready for download.`,
        type: 'certificate',
        link: `/certificate/${cert.certificateId}`,
      });
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated.',
      progressPercentage: enrollment.progressPercentage,
      completedLessons: enrollment.completedLessons,
      status: enrollment.status,
      certificate: enrollment.certificate,
    });
  } catch (error) {
    next(error);
  }
};

