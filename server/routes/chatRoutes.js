import express from 'express';
import {
  getMyRooms,
  getOrCreateCourseRoom,
  getRoomMessages,
  sendMessage,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/rooms', getMyRooms);
router.post('/course-room/:courseId', getOrCreateCourseRoom);
router.get('/rooms/:roomId/messages', getRoomMessages);
router.post('/rooms/:roomId/messages', sendMessage);

export default router;

