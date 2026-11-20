import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: [true, 'Please provide review content'],
      trim: true,
    },
    instructorReply: {
      replyText: { type: String, default: '' },
      repliedAt: { type: Date },
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ course: 1, student: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);

