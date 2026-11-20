import express from 'express';
import {
  getLiveClasses,
  getLiveClassById,
  createLiveClass,
  updateLiveClass,
  markAttendance,
} from '../controllers/liveClassController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getLiveClasses);
router.get('/:id', protect, getLiveClassById);
router.post('/', protect, authorize('instructor', 'admin'), createLiveClass);
router.put('/:id', protect, authorize('instructor', 'admin'), updateLiveClass);
router.post('/:id/join', protect, markAttendance);

export default router;

