import Review from '../models/Review.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// Helper to recalculate course rating
const updateCourseRating = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: courseId, isApproved: true } },
    {
      $group: {
        _id: '$course',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].numReviews,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 5.0,
      reviewCount: 0,
    });
  }
};

// @desc    Add review for a course
// @route   POST /api/reviews/:courseId
// @access  Private (Student)
export const addReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, reviewText } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Check if enrolled
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });
    if (!enrollment && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only review courses you are enrolled in.',
      });
    }

    const existingReview = await Review.findOne({
      course: courseId,
      student: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this course.',
      });
    }

    const review = await Review.create({
      course: courseId,
      student: req.user.id,
      rating: Number(rating),
      reviewText,
    });

    await updateCourseRating(course._id);

    const populatedReview = await Review.findById(review._id).populate('student', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for course
// @route   GET /api/reviews/:courseId
// @access  Public
export const getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId, isApproved: true })
      .populate('student', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a review
// @route   POST /api/reviews/:id/reply
// @access  Private (Instructor, Admin)
export const replyToReview = async (req, res, next) => {
  try {
    const { replyText } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    review.instructorReply = {
      replyText,
      repliedAt: new Date(),
    };

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Reply posted successfully.',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner Student, Admin)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (review.student.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const courseId = review.course;
    await Review.findByIdAndDelete(req.params.id);
    await updateCourseRating(courseId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

