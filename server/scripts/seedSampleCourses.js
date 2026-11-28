// Sample data seed script for LearnEase Pro
// Place this file in server/scripts/ and run: node seedSampleCourses.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

dotenv.config({ path: '../../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/learneasepro';

async function connect() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ Connected to MongoDB');
}

async function createSampleData() {
  // Ensure a sample category exists
  let category = await Category.findOne({ name: 'Programming' });
  if (!category) {
    category = await Category.create({ name: 'Programming', description: 'Programming and development courses' });
    console.log('Created category:', category._id);
  }

  // Ensure a sample instructor exists (role: instructor)
  let instructor = await User.findOne({ email: 'instructor@example.com' });
  if (!instructor) {
    instructor = await User.create({
      name: 'Sample Instructor',
      email: 'instructor@example.com',
      password: 'tempPass123', // hashed by pre‑save hook if defined
      role: 'instructor',
    });
    console.log('Created instructor:', instructor._id);
  }

  const sampleCourses = [
    {
      title: 'Intro to JavaScript',
      description: 'Learn the fundamentals of JavaScript, the language of the web.',
      category: category._id,
      instructor: instructor._id,
      price: 0,
      isFree: true,
      level: 'Beginner',
      language: 'English',
      durationHours: 5,
    },
    {
      title: 'Advanced React',
      description: 'Deep dive into React hooks, context, and performance patterns.',
      category: category._id,
      instructor: instructor._id,
      price: 49.99,
      isFree: false,
      level: 'Advanced',
      language: 'English',
      durationHours: 12,
    },
    {
      title: 'Full‑Stack Node.js',
      description: 'Build RESTful APIs with Express, MongoDB, and JWT authentication.',
      category: category._id,
      instructor: instructor._id,
      price: 79.99,
      isFree: false,
      level: 'Intermediate',
      language: 'English',
      durationHours: 15,
    },
  ];

  for (const data of sampleCourses) {
    const existing = await Course.findOne({ title: data.title });
    if (!existing) {
      const created = await Course.create(data);
      console.log('Created course:', created.title);
    } else {
      console.log('Course already exists:', existing.title);
    }
  }
}

async function main() {
  try {
    await connect();
    await createSampleData();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

main();