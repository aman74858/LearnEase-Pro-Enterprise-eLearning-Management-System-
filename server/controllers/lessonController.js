import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';

// @desc    Add a module to course
// @route   POST /api/courses/:courseId/modules
// @access  Private (Instructor, Admin)
export const createModule = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const currentCount = await Module.countDocuments({ course: courseId });
    const module = await Module.create({
      course: courseId,
      title,
      order: order !== undefined ? order : currentCount + 1,
    });

    res.status(201).json({
      success: true,
      message: 'Module created successfully.',
      module,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a module
// @route   PUT /api/courses/modules/:moduleId
// @access  Private (Instructor, Admin)
export const updateModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const updatedModule = await Module.findByIdAndUpdate(moduleId, req.body, { new: true });
    res.status(200).json({
      success: true,
      message: 'Module updated successfully.',
      module: updatedModule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a module and its lessons
// @route   DELETE /api/courses/modules/:moduleId
// @access  Private (Instructor, Admin)
export const deleteModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    await Lesson.deleteMany({ module: moduleId });
    await Module.findByIdAndDelete(moduleId);

    res.status(200).json({
      success: true,
      message: 'Module and its lessons deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add lesson to a module
// @route   POST /api/courses/:courseId/modules/:moduleId/lessons
// @access  Private (Instructor, Admin)
export const createLesson = async (req, res, next) => {
  try {
    const { courseId, moduleId } = req.params;
    const { title, durationMinutes, videoUrl, description, resources, isFreePreview } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const count = await Lesson.countDocuments({ module: moduleId });

    const lesson = await Lesson.create({
      course: courseId,
      module: moduleId,
      title,
      durationMinutes: Number(durationMinutes) || 15,
      videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: description || '',
      resources: resources || [],
      order: count + 1,
      isFreePreview: Boolean(isFreePreview),
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully.',
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson
// @route   PUT /api/courses/lessons/:lessonId
// @access  Private (Instructor, Admin)
export const updateLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findByIdAndUpdate(lessonId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully.',
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/courses/lessons/:lessonId
// @access  Private (Instructor, Admin)
export const deleteLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findByIdAndDelete(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

