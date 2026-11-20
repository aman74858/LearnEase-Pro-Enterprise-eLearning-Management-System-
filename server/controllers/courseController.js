import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get all courses with filtering, search, sorting & pagination
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      priceType, // 'free', 'paid'
      rating,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (category && category !== 'all') {
      // Check if category is ObjectId or slug
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);
      if (isObjectId) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) query.category = cat._id;
      }
    }

    if (level && level !== 'All Levels' && level !== 'all') {
      query.level = level;
    }

    if (priceType === 'free') {
      query.isFree = true;
    } else if (priceType === 'paid') {
      query.isFree = false;
    }

    if (rating) {
      query.averageRating = { $gte: Number(rating) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { enrolledCount: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('category', 'name slug icon color')
      .populate('instructor', 'name avatar headline')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured courses for landing page
// @route   GET /api/courses/featured
// @access  Public
export const getFeaturedCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isPublished: true, isFeatured: true })
      .populate('category', 'name slug icon color')
      .populate('instructor', 'name avatar headline')
      .limit(6);

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by slug or ID
// @route   GET /api/courses/:slugOrId
// @access  Public
export const getCourseBySlug = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slugOrId);

    const query = isObjectId ? { _id: slugOrId } : { slug: slugOrId };

    const course = await Course.findOne(query)
      .populate('category', 'name slug icon color')
      .populate('instructor', 'name email avatar headline bio');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Fetch modules and lessons
    const modules = await Module.find({ course: course._id }).sort({ order: 1 });
    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({ module: mod._id }).sort({ order: 1 });
        return {
          ...mod.toObject(),
          lessons,
        };
      })
    );

    // Fetch reviews
    const reviews = await Review.find({ course: course._id, isApproved: true })
      .populate('student', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    // Fetch related courses in same category
    const relatedCourses = await Course.find({
      category: course.category._id,
      _id: { $ne: course._id },
      isPublished: true,
    })
      .populate('instructor', 'name avatar')
      .limit(3);

    res.status(200).json({
      success: true,
      course,
      curriculum: modulesWithLessons,
      reviews,
      relatedCourses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Instructor, Admin)
export const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      thumbnail,
      previewVideoUrl,
      category,
      price,
      discountPrice,
      isFree,
      level,
      language,
      durationHours,
      learningObjectives,
      requirements,
      tags,
    } = req.body;

    const course = await Course.create({
      title,
      subtitle,
      description,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      previewVideoUrl: previewVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      category,
      instructor: req.user.id,
      price: isFree ? 0 : Number(price) || 0,
      discountPrice: Number(discountPrice) || 0,
      isFree: Boolean(isFree),
      level: level || 'All Levels',
      language: language || 'English',
      durationHours: Number(durationHours) || 10,
      learningObjectives: learningObjectives || [],
      requirements: requirements || [],
      tags: tags || [],
      isPublished: true,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully!',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Owner Instructor or Admin)
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this course.',
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Owner Instructor or Admin)
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this course.',
      });
    }

    // Clean up dependent modules and lessons
    await Module.deleteMany({ course: course._id });
    await Lesson.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course and related content deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses created by logged-in instructor
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor)
export const getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
    const avgRating = courses.length
      ? (courses.reduce((acc, c) => acc + (c.averageRating || 0), 0) / courses.length).toFixed(1)
      : 5.0;

    res.status(200).json({
      success: true,
      courses,
      analytics: {
        totalCourses: courses.length,
        totalStudents,
        averageRating: avgRating,
      },
    });
  } catch (error) {
    next(error);
  }
};

