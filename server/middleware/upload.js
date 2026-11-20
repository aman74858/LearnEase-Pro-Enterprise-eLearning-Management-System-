import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif|mp4|webm|pdf|doc|docx|zip/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedExtensions.test(file.mimetype) || file.mimetype.includes('octet-stream');

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('File format not supported. Only images, videos, PDFs, and documents are allowed.'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: fileFilter,
});

const profileImageTypes = new Map([
  ['.jpg', ['image/jpeg']],
  ['.jpeg', ['image/jpeg']],
  ['.jpe', ['image/jpeg']],
  ['.jfif', ['image/jpeg']],
  ['.png', ['image/png']],
  ['.apng', ['image/apng', 'image/png']],
  ['.gif', ['image/gif']],
  ['.webp', ['image/webp']],
  ['.bmp', ['image/bmp', 'image/x-ms-bmp']],
  ['.avif', ['image/avif']],
  ['.tif', ['image/tiff']],
  ['.tiff', ['image/tiff']],
  ['.heic', ['image/heic']],
  ['.heif', ['image/heif']],
  ['.jxl', ['image/jxl']],
  ['.ico', ['image/x-icon', 'image/vnd.microsoft.icon']],
]);

const profileImageFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = profileImageTypes.get(extension);

  if (allowedMimeTypes?.includes(file.mimetype.toLowerCase())) {
    return cb(null, true);
  }

  const error = new Error(
    'Please select a supported image file. PDFs, documents, and videos cannot be used as profile photos.'
  );
  error.statusCode = 400;
  cb(error);
};

export const profileImageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: profileImageFilter,
});

