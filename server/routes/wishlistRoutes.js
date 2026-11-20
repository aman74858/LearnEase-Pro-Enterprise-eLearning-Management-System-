import express from 'express';
import {
  getMyWishlist,
  toggleWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getMyWishlist);
router.post('/:courseId', toggleWishlist);

export default router;

