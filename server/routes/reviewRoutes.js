import express from 'express';
import {
  addReview,
  getCourseReviews,
  replyToReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/:courseId', getCourseReviews);
router.post('/:courseId', protect, addReview);
router.post('/:id/reply', protect, authorize('instructor', 'admin'), replyToReview);
router.delete('/:id', protect, deleteReview);

export default router;

