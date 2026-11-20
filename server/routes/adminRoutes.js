import express from 'express';
import {
  getAdminAnalytics,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  toggleUserStatus,
  approveInstructor,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/instructors/:id/approve', approveInstructor);

export default router;
