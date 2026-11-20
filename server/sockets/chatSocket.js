import Message from '../models/Message.js';
import ChatRoom from '../models/ChatRoom.js';

export const setupChatSocket = (io) => {
  const onlineUsers = new Map(); // socketId -> userId

  io.on('connection', (socket) => {
    // console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Register user presence
    socket.on('register_user', (userId) => {
      onlineUsers.set(socket.id, userId);
      io.emit('online_users_count', new Set(onlineUsers.values()).size);
    });

    // Join a specific chat room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      // console.log(`[Socket.IO] ${socket.id} joined room ${roomId}`);
    });

    // Leave a chat room
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
    });

    // Typing indicators
    socket.on('typing', ({ roomId, userName }) => {
      socket.to(roomId).emit('user_typing', { roomId, userName });
    });

    socket.on('stop_typing', ({ roomId }) => {
      socket.to(roomId).emit('user_stop_typing', { roomId });
    });

    // Send real-time message
    socket.on('send_message', async ({ roomId, senderId, text, fileUrl, fileName, senderName, senderAvatar, senderRole }) => {
      try {
        // Save to DB
        const message = await Message.create({
          chatRoom: roomId,
          sender: senderId,
          text,
          fileUrl: fileUrl || '',
          fileName: fileName || '',
        });

        // Update room's lastMessage
        await ChatRoom.findByIdAndUpdate(roomId, {
          lastMessage: {
            text,
            sender: senderId,
            sentAt: new Date(),
          },
        });

        const messagePayload = {
          _id: message._id,
          chatRoom: roomId,
          sender: {
            _id: senderId,
            name: senderName,
            avatar: senderAvatar,
            role: senderRole,
          },
          text,
          fileUrl,
          fileName,
          createdAt: message.createdAt,
        };

        // Broadcast to all participants in this room
        io.to(roomId).emit('receive_message', messagePayload);
      } catch (err) {
        console.error('[Socket.IO] Error saving message:', err.message);
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.id);
      io.emit('online_users_count', new Set(onlineUsers.values()).size);
      // console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

