import express from 'express';
import {
  getCourseQuizzes,
  createQuiz,
  submitQuizAttempt,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/course/:courseId', getCourseQuizzes);
router.post('/', authorize('instructor', 'admin'), createQuiz);
router.post('/:quizId/attempt', authorize('student'), submitQuizAttempt);

export default router;

