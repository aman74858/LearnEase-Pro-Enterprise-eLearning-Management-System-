import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  durationMinutes: {
    type: Number,
    default: 0,
  },
});

const liveClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide class title'],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Please provide class start date and time'],
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
    meetingUrl: {
      type: String,
      default: '',
    },
    meetingId: {
      type: String,
      default: () => 'learnease-room-' + Math.random().toString(36).substring(2, 9),
    },
    passcode: {
      type: String,
      default: 'LEARN123',
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    recordingUrl: {
      type: String,
      default: '',
    },
    recordingDurationMinutes: {
      type: Number,
      default: 0,
    },
    attendees: [attendeeSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('LiveClass', liveClassSchema);

