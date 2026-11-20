import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Extract credentials with whitespace trimming and typo resilience (CLOUDNARY vs CLOUDINARY)
const cloudName = (
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDNARY_CLOUD_NAME ||
  process.env.CLOUD_NAME ||
  ''
).trim();

const apiKey = (
  process.env.CLOUDINARY_API_KEY ||
  process.env.CLOUDNARY_API_KEY ||
  ''
).trim();

const apiSecret = (
  process.env.CLOUDINARY_API_SECRET ||
  process.env.CLOUDNARY_SECRET ||
  process.env.CLOUDINARY_SECRET ||
  ''
).trim();

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log(`[Cloudinary] Successfully configured with cloud: "${cloudName}"`);
} else {
  console.log(
    `[Cloudinary] Status: ${
      cloudName ? 'Configured' : 'Missing CLOUDINARY_CLOUD_NAME'
    }. Will gracefully fallback to local disk storage if cloud name is unset.`
  );
}

/**
 * Upload an image file to Cloudinary with face detection, automatic sizing, and webp optimization
 * @param {string} filePath - Local path to the uploaded file on disk
 * @param {object} options - Custom Cloudinary options
 * @returns {Promise<object>} Upload result containing secure_url, public_id, etc.
 */
export const uploadProfileToCloudinary = async (filePath, options = {}) => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  const defaultOptions = {
    folder: 'learnease_pro/avatars',
    resource_type: 'image',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
    ...options,
  };

  return await cloudinary.uploader.upload(filePath, defaultOptions);
};

export default cloudinary;
