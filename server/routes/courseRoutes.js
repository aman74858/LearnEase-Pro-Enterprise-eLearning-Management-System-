import express from 'express';
import {
  getCourses,
  getFeaturedCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
} from '../controllers/courseController.js';
import {
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/instructor/my-courses', protect, authorize('instructor', 'admin'), getInstructorCourses);
router.get('/:slugOrId', optionalAuth, getCourseBySlug);

router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

// Curriculum: modules & lessons
router.post('/:courseId/modules', protect, authorize('instructor', 'admin'), createModule);
router.put('/modules/:moduleId', protect, authorize('instructor', 'admin'), updateModule);
router.delete('/modules/:moduleId', protect, authorize('instructor', 'admin'), deleteModule);

router.post('/:courseId/modules/:moduleId/lessons', protect, authorize('instructor', 'admin'), createLesson);
router.put('/lessons/:lessonId', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/lessons/:lessonId', protect, authorize('instructor', 'admin'), deleteLesson);

export default router;

