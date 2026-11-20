import Wishlist from '../models/Wishlist.js';

// @desc    Get student wishlist
// @route   GET /api/wishlist
// @access  Private (Student)
export const getMyWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ student: req.user.id }).populate({
      path: 'courses',
      populate: [
        { path: 'category', select: 'name slug color' },
        { path: 'instructor', select: 'name avatar headline' },
      ],
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ student: req.user.id, courses: [] });
    }

    res.status(200).json({
      success: true,
      wishlist: wishlist.courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle course in wishlist (add / remove)
// @route   POST /api/wishlist/:courseId
// @access  Private (Student)
export const toggleWishlist = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    let wishlist = await Wishlist.findOne({ student: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ student: req.user.id, courses: [] });
    }

    const index = wishlist.courses.indexOf(courseId);
    let added = false;

    if (index > -1) {
      wishlist.courses.splice(index, 1);
      added = false;
    } else {
      wishlist.courses.push(courseId);
      added = true;
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: added ? 'Course added to wishlist.' : 'Course removed from wishlist.',
      inWishlist: added,
      count: wishlist.courses.length,
    });
  } catch (error) {
    next(error);
  }
};

