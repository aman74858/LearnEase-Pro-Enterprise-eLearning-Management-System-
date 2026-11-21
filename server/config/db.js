import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
  // If already connected, reuse the active connection
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/learnease_pro';

    cachedConnection = await mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
    console.log(`[MongoDB] Connected successfully: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error(`[MongoDB Connection Error] ${error.message}`);
    throw error;
  }
};

export default connectDB;
