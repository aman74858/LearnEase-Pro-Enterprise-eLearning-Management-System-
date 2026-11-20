import express from 'express';
import {
  verifyCertificate,
  getMyCertificates,
} from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/verify/:certificateId', verifyCertificate);
router.get('/my-certificates', protect, getMyCertificates);

export default router;

