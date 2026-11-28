import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load env vars
dotenv.config();

// Connect Database
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import courseRequestRoutes from './routes/courseRequestRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import liveClassRoutes from './routes/liveClassRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Error Handler
import { errorHandler } from './middleware/error.js';

const app = express();
const httpServer = createServer(app);

// ─── Socket.io Setup ────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: (origin, cb) => cb(null, true),
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

// Track connected users: userId → socketId
const onlineUsers = new Map();

io.on('connection', (socket) => {
  // Client registers itself with its user _id
  socket.on('register_user', (userId) => {
    if (userId) {
      onlineUsers.set(userId.toString(), socket.id);
      io.emit('online_users_count', onlineUsers.size);
    }
  });

  // Allow clients to join a room (e.g. course chat room)
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
  });

  // Broadcast new chat message to a room
  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('new_message', data);
  });

  socket.on('disconnect', () => {
    for (const [userId, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('online_users_count', onlineUsers.size);
  });
});

// Expose io instance for use in controllers (e.g. real-time notifications)
export { io };

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile, postman, curl)
    if (!origin) return callback(null, true);

    const clientUrl = process.env.CLIENT_URL;
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app') ||
      (clientUrl && origin === clientUrl)
    ) {
      return callback(null, true);
    }

    // Permissive callback in cloud serverless to prevent CORS blocking
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Security & Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(cors(corsOptions));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.use(morgan('dev'));
}

// Serve static files from uploads directory
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure database connection in serverless & standard environments
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState < 1) {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('[DB Middleware Error]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Please ensure MONGODB_URI is correctly set in environment variables.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LearnEase Pro API is running securely.',
    timestamp: new Date(),
    environment: process.env.VERCEL ? 'vercel-serverless' : (process.env.NODE_ENV || 'development'),
  });
});

// Root API greeting
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'LearnEase Pro Backend API',
    status: 'operational',
    health: '/api/health',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/course-requests', courseRequestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Catch 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Centralized Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Local development listener (not invoked inside Vercel serverless functions)
if (!process.env.VERCEL) {
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[LearnEase Pro Server] Running on http://localhost:${PORT}`
    );
  });
}

// Export Express app instance for Vercel Serverless Function execution
export default app;
