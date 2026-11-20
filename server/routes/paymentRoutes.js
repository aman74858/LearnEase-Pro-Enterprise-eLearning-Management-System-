import express from 'express';
import {
  validateCoupon,
  createRazorpayOrder,
  verifyRazorpayPayment,
  processStripePayment,
  getMyPayments,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/apply-coupon', validateCoupon);
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.post('/stripe/checkout', processStripePayment);
router.get('/my-history', getMyPayments);

export default router;

