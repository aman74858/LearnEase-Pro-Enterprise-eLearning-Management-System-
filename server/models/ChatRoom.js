import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'General Chat',
    },
    type: {
      type: String,
      enum: ['course', 'direct'],
      default: 'course',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastMessage: {
      text: { type: String, default: '' },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      sentAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ChatRoom', chatRoomSchema);

