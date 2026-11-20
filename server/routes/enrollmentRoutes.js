import express from 'express';
import {
  enrollFreeCourse,
  getMyEnrollments,
  getEnrollmentByCourse,
  updateProgress,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/free/:courseId', enrollFreeCourse);
router.get('/my-courses', getMyEnrollments);
router.get('/course/:courseId', getEnrollmentByCourse);
router.post('/course/:courseId/progress', updateProgress);

export default router;

