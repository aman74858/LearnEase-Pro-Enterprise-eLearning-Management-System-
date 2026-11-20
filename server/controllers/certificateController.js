import Certificate from '../models/Certificate.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

// @desc    Get certificate by unique ID (public verification)
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
export const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId })
      .populate('course', 'title thumbnail durationHours level')
      .populate('student', 'name avatar email')
      .populate('instructor', 'name avatar headline');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or verification code is invalid.',
      });
    }

    res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's certificates
// @route   GET /api/certificates/my-certificates
// @access  Private (Student)
export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ student: req.user.id })
      .populate('course', 'title thumbnail slug durationHours')
      .populate('instructor', 'name')
      .sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    next(error);
  }
};

