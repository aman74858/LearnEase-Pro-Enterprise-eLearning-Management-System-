import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  updateTheme,
  changePassword,
  refreshToken,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/theme', protect, updateTheme);
router.put('/change-password', protect, changePassword);

export default router;

