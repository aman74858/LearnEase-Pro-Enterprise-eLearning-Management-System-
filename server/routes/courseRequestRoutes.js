import express from 'express';
import {
  createCourseRequest,
  getMyRequests,
  getCourseRequests,
  updateRequestStatus,
} from '../controllers/courseRequestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('student'), createCourseRequest);
router.get('/my-requests', authorize('student'), getMyRequests);
router.get('/', authorize('instructor', 'admin'), getCourseRequests);
router.put('/:id/status', authorize('instructor', 'admin'), updateRequestStatus);

export default router;

