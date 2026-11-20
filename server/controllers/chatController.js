import ChatRoom from '../models/ChatRoom.js';
import Message from '../models/Message.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get all chat rooms for current user
// @route   GET /api/chat/rooms
// @access  Private
export const getMyRooms = async (req, res, next) => {
  try {
    const rooms = await ChatRoom.find({
      participants: req.user.id,
    })
      .populate('course', 'title thumbnail')
      .populate('participants', 'name avatar role headline')
      .populate('lastMessage.sender', 'name')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get or create chat room for a course
// @route   POST /api/chat/course-room/:courseId
// @access  Private
export const getOrCreateCourseRoom = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    let room = await ChatRoom.findOne({ course: courseId, type: 'course' })
      .populate('course', 'title thumbnail')
      .populate('participants', 'name avatar role headline');

    if (!room) {
      room = await ChatRoom.create({
        name: 'Course Discussion',
        type: 'course',
        course: courseId,
        participants: [req.user.id],
      });
      room = await ChatRoom.findById(room._id)
        .populate('course', 'title thumbnail')
        .populate('participants', 'name avatar role headline');
    } else {
      if (!room.participants.some((p) => p._id.toString() === req.user.id)) {
        room.participants.push(req.user.id);
        await room.save();
      }
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a specific room
// @route   GET /api/chat/rooms/:roomId/messages
// @access  Private
export const getRoomMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await ChatRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Chat room not found.' });
    }

    const messages = await Message.find({ chatRoom: roomId })
      .populate('sender', 'name avatar role headline')
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post a new message in room
// @route   POST /api/chat/rooms/:roomId/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { text, fileUrl, fileName } = req.body;

    if (!text && !fileUrl) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Chat room not found.' });
    }

    const message = await Message.create({
      chatRoom: roomId,
      sender: req.user.id,
      text: text || 'Sent an attachment',
      fileUrl: fileUrl || '',
      fileName: fileName || '',
    });

    room.lastMessage = {
      text: text || 'Attachment',
      sender: req.user.id,
      sentAt: new Date(),
    };
    await room.save();

    const populatedMsg = await Message.findById(message._id).populate(
      'sender',
      'name avatar role headline'
    );

    res.status(201).json({
      success: true,
      message: populatedMsg,
    });
  } catch (error) {
    next(error);
  }
};

