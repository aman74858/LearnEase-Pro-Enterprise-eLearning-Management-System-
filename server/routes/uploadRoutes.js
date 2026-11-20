import express from 'express';
import fs from 'fs';
import { profileImageUpload, upload } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';
import { isCloudinaryConfigured, uploadProfileToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

/**
 * @route   GET /api/upload/cloudinary-status
 * @desc    Check Cloudinary configuration status
 * @access  Private
 */
router.get('/cloudinary-status', protect, (req, res) => {
  res.status(200).json({
    success: true,
    configured: isCloudinaryConfigured,
    message: isCloudinaryConfigured
      ? 'Cloudinary is connected and ready for profile uploads.'
      : 'Cloudinary credentials missing or incomplete (CLOUDINARY_CLOUD_NAME required). Using local disk storage fallback.',
  });
});

/**
 * @route   POST /api/upload/profile-image
 * @desc    Upload profile picture (Cloudinary with local fallback)
 * @access  Private
 */
router.post('/profile-image', protect, profileImageUpload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a profile image.' });
    }

    // 1. If Cloudinary is configured, upload to Cloudinary CDN
    if (isCloudinaryConfigured) {
      try {
        const result = await uploadProfileToCloudinary(req.file.path);

        // Delete temporary local file after successful Cloudinary upload
        fs.unlink(req.file.path, () => {});

        return res.status(200).json({
          success: true,
          message: 'Profile image uploaded to Cloudinary successfully.',
          fileUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          provider: 'cloudinary',
          size: (result.bytes / (1024 * 1024)).toFixed(2) + ' MB',
        });
      } catch (cloudErr) {
        console.error('[Cloudinary Upload Failed, using fallback]', cloudErr?.message || cloudErr);
      }
    }

    // 2. Fallback: Local storage in /uploads
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully (local storage).',
      fileUrl,
      filename: req.file.originalname,
      provider: 'local',
      size: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/upload
 * @desc    Generic file upload for courses/resources
 * @access  Private
 */
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select a file to upload.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully.',
    fileUrl,
    filename: req.file.originalname,
    size: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
  });
});

export default router;
