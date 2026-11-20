import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Models
import User from '../models/User.js';
import Category from '../models/Category.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import CourseRequest from '../models/CourseRequest.js';
import Review from '../models/Review.js';
import Payment from '../models/Payment.js';
import LiveClass from '../models/LiveClass.js';
import ChatRoom from '../models/ChatRoom.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Quiz from '../models/Quiz.js';
import Certificate from '../models/Certificate.js';
import Coupon from '../models/Coupon.js';

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnease_pro';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await Category.deleteMany({});
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});
    await Enrollment.deleteMany({});
    await CourseRequest.deleteMany({});
    await Review.deleteMany({});
    await Payment.deleteMany({});
    await LiveClass.deleteMany({});
    await ChatRoom.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    await Quiz.deleteMany({});
    await Certificate.deleteMany({});
    await Coupon.deleteMany({});

    console.log('[Seeder] Old data cleared.');

    const defaultPassword = 'Password123!';

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'Dr. Evelyn Vance',
      email: 'admin@learnease.com',
      password: defaultPassword,
      role: 'admin',
      headline: 'Platform Administrator & Education Director',
      bio: 'Overseeing global curricula and educational excellence at LearnEase Pro.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      isApprovedInstructor: true,
      isActive: true,
    });

    // 2. Create 5 Instructors
    const instructorsData = [
      {
        name: 'Fariya Islam',
        email: 'fariya@learnease.com',
        role: 'instructor',
        headline: 'Senior Full-Stack Engineer & React Architect',
        bio: 'Over 8 years crafting modern web applications and mentoring 25,000+ developers worldwide.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        expertise: ['React', 'Next.js', 'Node.js', 'TypeScript'],
        isApprovedInstructor: true,
      },
      {
        name: 'Alex Rivera',
        email: 'alex@learnease.com',
        role: 'instructor',
        headline: 'Lead Cloud Architect & DevOps Consultant',
        bio: 'AWS Certified Solutions Architect with deep experience in Kubernetes, microservices, and Docker.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        isApprovedInstructor: true,
      },
      {
        name: 'Dr. Sophia Chen',
        email: 'sophia@learnease.com',
        role: 'instructor',
        headline: 'AI Research Scientist & Deep Learning Lead',
        bio: 'PhD in Computer Vision. Passionate about demystifying Machine Learning, PyTorch, and Generative AI.',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        expertise: ['Machine Learning', 'Python', 'PyTorch', 'TensorFlow'],
        isApprovedInstructor: true,
      },
      {
        name: 'Marcus Brody',
        email: 'marcus@learnease.com',
        role: 'instructor',
        headline: 'Principal UI/UX Designer & Product Strategist',
        bio: 'Former Design Lead at top tech brands. Teaching human-centered design systems, Figma, and micro-interactions.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        expertise: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research'],
        isApprovedInstructor: true,
      },
      {
        name: 'Tariq Rahman',
        email: 'tariq@learnease.com',
        role: 'instructor',
        headline: 'Cybersecurity Analyst & Certified Ethical Hacker',
        bio: 'Securing mission-critical systems and training the next generation of penetration testers and analysts.',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
        expertise: ['Cybersecurity', 'Ethical Hacking', 'Network Security', 'Cryptography'],
        isApprovedInstructor: true,
      },
    ];

    const instructors = [];
    for (const inst of instructorsData) {
      const u = await User.create({
        ...inst,
        password: defaultPassword,
        isActive: true,
      });
      instructors.push(u);
    }

    // 3. Create 20 Students
    const studentNames = [
      'David Miller', 'Emma Watson', 'James Wilson', 'Olivia Taylor', 'Lucas Anderson',
      'Ava Martinez', 'Liam Thomas', 'Isabella Garcia', 'Noah Robinson', 'Mia Clark',
      'Benjamin Lewis', 'Charlotte Lee', 'Mason Walker', 'Amelia Hall', 'Ethan Allen',
      'Harper Young', 'Alexander King', 'Evelyn Wright', 'Daniel Scott', 'Emily Green'
    ];

    const students = [];
    for (let i = 0; i < studentNames.length; i++) {
      const u = await User.create({
        name: studentNames[i],
        email: `student${i + 1}@learnease.com`,
        password: defaultPassword,
        role: 'student',
        headline: 'Junior Software Engineer & Curious Learner',
        bio: 'Building full-stack skills and eager to break into top tier tech organizations.',
        avatar: `https://images.unsplash.com/photo-${1535713875002 + i * 1000}?auto=format&fit=crop&w=300&q=80`,
        isActive: true,
      });
      students.push(u);
    }

    console.log(`[Seeder] Seeded 1 Admin, ${instructors.length} Instructors, ${students.length} Students.`);

    // 4. Create 10 Categories
    const categoriesData = [
      { name: 'Web Development', icon: 'Code', description: 'Full-stack development, modern frontend & backend frameworks', color: '#138B7A' },
      { name: 'Data Science', icon: 'BarChart2', description: 'Data analysis, statistics, pandas, and data visualization', color: '#0E7365' },
      { name: 'Artificial Intelligence', icon: 'Cpu', description: 'Generative AI, Large Language Models, and deep neural nets', color: '#F15B45' },
      { name: 'Machine Learning', icon: 'GitBranch', description: 'Supervised, unsupervised algorithms and predictive modeling', color: '#075C53' },
      { name: 'Java Programming', icon: 'Terminal', description: 'Enterprise Java, Spring Boot, microservices and object-oriented mastery', color: '#F47768' },
      { name: 'Python Programming', icon: 'FileCode', description: 'Python for scripting, backend automation, and algorithmic problem-solving', color: '#138B7A' },
      { name: 'UI/UX Design', icon: 'Layout', description: 'Figma prototyping, human-computer interaction, and design systems', color: '#F15B45' },
      { name: 'Cloud Computing', icon: 'Cloud', description: 'AWS, Azure, Google Cloud, Docker, and Kubernetes deployment', color: '#3CBBA7' },
      { name: 'Cybersecurity', icon: 'ShieldCheck', description: 'Defensive security, penetration testing, ethical hacking and audit', color: '#151B24' },
      { name: 'Digital Marketing', icon: 'TrendingUp', description: 'SEO growth strategies, conversion rate optimization, and brand scaling', color: '#DE3C24' },
    ];

    const categories = [];
    for (const c of categoriesData) {
      const cat = await Category.create(c);
      categories.push(cat);
    }

    console.log(`[Seeder] Seeded ${categories.length} Categories.`);

    // 5. Create 15 Realistic Courses
    const sampleCourses = [
      {
        title: 'Complete MERN Stack 2026: From Scratch to Production',
        subtitle: 'Build scalable e-learning and SaaS web platforms using React, Node, Express & MongoDB.',
        description: 'Comprehensive, project-driven course teaching you how to architect, develop, secure, and deploy full-stack modern enterprise web applications with clean coding best practices.',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        category: categories[0]._id, // Web Dev
        instructor: instructors[0]._id, // Fariya
        price: 89,
        discountPrice: 49,
        isFree: false,
        level: 'Intermediate',
        language: 'English',
        durationHours: 32,
        enrolledCount: 1250,
        averageRating: 4.9,
        reviewCount: 340,
        isFeatured: true,
        learningObjectives: [
          'Design scalable MongoDB schemas and indexing strategies',
          'Build enterprise Express REST APIs with JWT & role authorization',
          'Develop reactive, responsive UIs with React 19, Tailwind CSS, & Framer Motion',
          'Integrate live WebSockets, payments, and automated test pipelines',
        ],
        requirements: ['Basic understanding of HTML, CSS, and modern JavaScript (ES6+)'],
        tags: ['React', 'Node.js', 'MongoDB', 'Express', 'Fullstack'],
      },
      {
        title: 'React 19 & Next.js Architecture Masterclass',
        subtitle: 'Master Server Components, Actions, App Router, and production-ready micro-frontends.',
        description: 'Take your frontend engineering skills to the next tier with deep dives into React modern concurrent primitives, streaming SSR, and edge deployment.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        category: categories[0]._id,
        instructor: instructors[0]._id,
        price: 79,
        discountPrice: 39,
        isFree: false,
        level: 'Advanced',
        language: 'English',
        durationHours: 24,
        enrolledCount: 940,
        averageRating: 4.8,
        reviewCount: 210,
        isFeatured: true,
        learningObjectives: ['Server Actions', 'Optimistic UI', 'Edge Caching', 'Hydration Tuning'],
        requirements: ['Working knowledge of React hooks and components'],
        tags: ['React', 'Next.js', 'Frontend'],
      },
      {
        title: 'Python for Data Science, Pandas & Machine Learning',
        subtitle: 'Transform raw data into actionable intelligence with Python, NumPy, Pandas and Scikit-Learn.',
        description: 'Complete hands-on journey through exploratory data analysis, data wrangling, feature engineering, and training real-world predictive models.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        category: categories[1]._id, // Data Science
        instructor: instructors[2]._id, // Sophia
        price: 99,
        discountPrice: 59,
        isFree: false,
        level: 'All Levels',
        language: 'English',
        durationHours: 28,
        enrolledCount: 1800,
        averageRating: 4.9,
        reviewCount: 450,
        isFeatured: true,
        learningObjectives: ['Clean and manipulate massive datasets with Pandas', 'Build predictive regressions and classifiers', 'Create publication-ready visual plots'],
        requirements: ['No prior programming background required'],
        tags: ['Python', 'Data Science', 'Pandas'],
      },
      {
        title: 'Generative AI & LLM Application Engineering',
        subtitle: 'Build production AI agents, RAG workflows, and LangChain applications.',
        description: 'Harness state-of-the-art Large Language Models to build intelligent autonomous assistants, vector database search systems, and multimodal pipelines.',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
        category: categories[2]._id, // AI
        instructor: instructors[2]._id,
        price: 120,
        discountPrice: 69,
        isFree: false,
        level: 'Advanced',
        language: 'English',
        durationHours: 20,
        enrolledCount: 2200,
        averageRating: 5.0,
        reviewCount: 520,
        isFeatured: true,
        learningObjectives: ['Build Retrieval-Augmented Generation (RAG) applications', 'Embeddings and Pinecone vector stores', 'Function calling & agentic tool orchestration'],
        requirements: ['Intermediate Python knowledge'],
        tags: ['AI', 'LLM', 'LangChain', 'Python'],
      },
      {
        title: 'Figma to High-Converting Web Products: UI/UX Masterclass',
        subtitle: 'Design beautiful, accessible, human-first web and mobile user experiences.',
        description: 'From wireframes and mood boards to high-fidelity clickable interactive prototypes and complete enterprise design tokens.',
        thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
        category: categories[6]._id, // UI/UX
        instructor: instructors[3]._id, // Marcus
        price: 69,
        discountPrice: 29,
        isFree: false,
        level: 'Beginner',
        language: 'English',
        durationHours: 18,
        enrolledCount: 1400,
        averageRating: 4.9,
        reviewCount: 310,
        isFeatured: true,
        learningObjectives: ['Typography, color harmony, and grid layouts', 'Design systems and reusable auto-layout components', 'Interactive prototyping and user testing'],
        requirements: ['A computer and free Figma account'],
        tags: ['Figma', 'UI/UX', 'Design'],
      },
      {
        title: 'AWS Certified Cloud Solutions Architect Associate',
        subtitle: 'Pass the AWS SAA-C03 exam and master cloud architecture and deployment.',
        description: 'Detailed coverage of VPCs, EC2, S3, IAM, Lambda, DynamoDB, RDS, CloudFront, Route53, and cost optimization techniques.',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        category: categories[7]._id, // Cloud
        instructor: instructors[1]._id, // Alex
        price: 99,
        discountPrice: 49,
        isFree: false,
        level: 'Intermediate',
        language: 'English',
        durationHours: 35,
        enrolledCount: 1100,
        averageRating: 4.8,
        reviewCount: 280,
        isFeatured: true,
        learningObjectives: ['High availability and fault tolerance', 'Serverless architecture with AWS Lambda', 'Pass AWS SAA-C03 exam with confidence'],
        requirements: ['Basic IT fundamentals'],
        tags: ['AWS', 'Cloud', 'DevOps'],
      },
      {
        title: 'Modern Ethical Hacking & Penetration Testing',
        subtitle: 'Learn how black-hat hackers attack systems so you can effectively defend them.',
        description: 'Hands-on lab training covering network reconnaissance, vulnerability scanning, web application vulnerabilities, and defensive hardening.',
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        category: categories[8]._id, // Cybersecurity
        instructor: instructors[4]._id, // Tariq
        price: 89,
        discountPrice: 45,
        isFree: false,
        level: 'Intermediate',
        language: 'English',
        durationHours: 22,
        enrolledCount: 860,
        averageRating: 4.8,
        reviewCount: 190,
        isFeatured: false,
        learningObjectives: ['Port scanning and Kali Linux tooling', 'Web penetration testing (SQLi, XSS, CSRF)', 'Report writing and vulnerability mitigation'],
        requirements: ['Basic networking knowledge'],
        tags: ['Cybersecurity', 'Ethical Hacking', 'Linux'],
      },
      {
        title: 'Spring Boot 3 & Microservices Architecture',
        subtitle: 'Build robust enterprise cloud backend systems with Java 21, Spring Boot & Docker.',
        description: 'Master dependency injection, Spring Security, JPA/Hibernate, Kafka event-driven architectures, and API gateway routing.',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        category: categories[4]._id, // Java
        instructor: instructors[0]._id,
        price: 95,
        discountPrice: 49,
        isFree: false,
        level: 'Advanced',
        language: 'English',
        durationHours: 26,
        enrolledCount: 750,
        averageRating: 4.7,
        reviewCount: 160,
        isFeatured: false,
        learningObjectives: ['Spring Boot microservices ecosystem', 'Event streams with Apache Kafka', 'Containerization with Docker'],
        requirements: ['Solid understanding of Java Core OOP'],
        tags: ['Java', 'Spring Boot', 'Microservices'],
      },
      {
        title: 'Introduction to Modern Web Development',
        subtitle: 'The ultimate beginner-friendly launchpad to HTML5, modern CSS3, and JavaScript.',
        description: 'Free comprehensive course designed for absolute beginners looking to build their first interactive web pages.',
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        category: categories[0]._id, // Web Dev
        instructor: instructors[0]._id,
        price: 0,
        discountPrice: 0,
        isFree: true,
        level: 'Beginner',
        language: 'English',
        durationHours: 8,
        enrolledCount: 4200,
        averageRating: 4.9,
        reviewCount: 890,
        isFeatured: true,
        learningObjectives: ['Master semantic HTML markup', 'Build responsive flexbox and CSS grid layouts', 'JavaScript fundamentals and DOM manipulation'],
        requirements: ['No prior experience required!'],
        tags: ['HTML', 'CSS', 'JavaScript', 'Free'],
      },
      {
        title: 'Digital Marketing & Growth Hacking Mastery',
        subtitle: 'Scale SaaS products, e-commerce, and services using data-backed marketing strategies.',
        description: 'Step-by-step masterclass covering SEO keyword research, Facebook & Google ad funnels, email marketing automation, and viral loops.',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        category: categories[9]._id, // Digital Marketing
        instructor: instructors[3]._id,
        price: 59,
        discountPrice: 25,
        isFree: false,
        level: 'Beginner',
        language: 'English',
        durationHours: 15,
        enrolledCount: 680,
        averageRating: 4.7,
        reviewCount: 130,
        isFeatured: false,
        learningObjectives: ['Organic search engine optimization', 'High ROI paid ad campaigns', 'Conversion rate optimization tactics'],
        requirements: ['Basic internet and web navigation skills'],
        tags: ['Marketing', 'SEO', 'Growth'],
      },
      {
        title: 'Deep Learning & Neural Networks with PyTorch',
        subtitle: 'Implement CNNs, RNNs, Transformers, and autoencoders from mathematical foundations.',
        description: 'Take your ML expertise to deep learning heights by writing custom PyTorch training loops, loss functions, and inference optimizers.',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        category: categories[3]._id, // Machine Learning
        instructor: instructors[2]._id,
        price: 110,
        discountPrice: 65,
        isFree: false,
        level: 'Advanced',
        language: 'English',
        durationHours: 30,
        enrolledCount: 890,
        averageRating: 4.9,
        reviewCount: 240,
        isFeatured: false,
        learningObjectives: ['Backpropagation mathematics and autograd', 'Convolutional networks for image classification', 'Attention mechanisms and Transformers'],
        requirements: ['Linear algebra and Python proficiency'],
        tags: ['PyTorch', 'Deep Learning', 'Neural Networks'],
      },
      {
        title: 'Docker & Kubernetes: Production Container Orchestration',
        subtitle: 'Deploy, scale, and manage containerized microservices in production clusters.',
        description: 'From Dockerfile optimization and multi-stage builds to Kubernetes pods, services, ingress controllers, Helm charts, and cluster monitoring.',
        thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
        category: categories[7]._id, // Cloud
        instructor: instructors[1]._id,
        price: 85,
        discountPrice: 45,
        isFree: false,
        level: 'Intermediate',
        language: 'English',
        durationHours: 20,
        enrolledCount: 920,
        averageRating: 4.8,
        reviewCount: 200,
        isFeatured: false,
        learningObjectives: ['Multi-container Docker Compose architectures', 'Kubernetes deployments and stateful sets', 'Rolling zero-downtime updates'],
        requirements: ['Linux command line comfort'],
        tags: ['Docker', 'Kubernetes', 'DevOps'],
      },
      {
        title: 'Python Scripting & Automation For Everyone',
        subtitle: 'Automate boring spreadsheets, web scraping, and file system management in seconds.',
        description: 'Practical, fast-paced Python course teaching you how to scrape web data, parse PDFs and CSVs, auto-send emails, and schedule daily cron tasks.',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        category: categories[5]._id, // Python
        instructor: instructors[2]._id,
        price: 0,
        discountPrice: 0,
        isFree: true,
        level: 'All Levels',
        language: 'English',
        durationHours: 10,
        enrolledCount: 3500,
        averageRating: 4.9,
        reviewCount: 610,
        isFeatured: false,
        learningObjectives: ['Web scraping with BeautifulSoup', 'Automating Excel and PDF reports', 'REST API consumption and JSON parsing'],
        requirements: ['Computer with internet connection'],
        tags: ['Python', 'Automation', 'Free'],
      },
      {
        title: 'Advanced TypeScript & Clean Code Architecture',
        subtitle: 'Write bulletproof, type-safe, maintainable JavaScript applications at scale.',
        description: 'Generics, conditional types, template literals, utility types, SOLID architectural principles, and domain-driven design in TypeScript.',
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
        category: categories[0]._id, // Web Dev
        instructor: instructors[0]._id,
        price: 65,
        discountPrice: 32,
        isFree: false,
        level: 'Intermediate',
        language: 'English',
        durationHours: 16,
        enrolledCount: 1150,
        averageRating: 4.9,
        reviewCount: 275,
        isFeatured: false,
        learningObjectives: ['Master advanced TypeScript generics', 'Write clean, testable, decoupled code', 'Enforce runtime validation with Zod'],
        requirements: ['Intermediate JavaScript experience'],
        tags: ['TypeScript', 'Clean Code', 'Web Dev'],
      },
      {
        title: 'UI/UX Design Systems in Figma for Enterprise',
        subtitle: 'Build and maintain multi-brand, accessible Figma component libraries and token systems.',
        description: 'Create industrial-grade design systems with Figma variables, auto-layout 5.0, dark mode swapping, and component documentation.',
        thumbnail: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=800&q=80',
        category: categories[6]._id, // UI/UX
        instructor: instructors[3]._id,
        price: 75,
        discountPrice: 35,
        isFree: false,
        level: 'Advanced',
        language: 'English',
        durationHours: 14,
        enrolledCount: 820,
        averageRating: 4.8,
        reviewCount: 180,
        isFeatured: false,
        learningObjectives: ['Figma Variables & Modes', 'Component property architecture', 'Design token sync with developers'],
        requirements: ['Experience with basic Figma features'],
        tags: ['Design Systems', 'Figma', 'UI/UX'],
      },
    ];

    const courses = [];
    for (const c of sampleCourses) {
      const course = await Course.create(c);
      courses.push(course);

      // Create 3 Modules for each course
      const moduleTitles = [
        'Module 1: Foundations, Tooling & Architecture Overview',
        'Module 2: Core Concepts, Real-World Implementation & Patterns',
        'Module 3: Advanced Optimization, Security & Production Deployment',
      ];

      for (let m = 0; m < moduleTitles.length; m++) {
        const mod = await Module.create({
          course: course._id,
          title: moduleTitles[m],
          order: m + 1,
        });

        // Create 3 Lessons per module
        const lessonTitles = [
          [`Setting Up Environment & Project Boilerplate`, `Understanding the Core Principles & Syntax`, `Architectural Flow & State Management`],
          [`Building the Primary Functional Engine`, `Error Handling, Edge Cases & Validation`, `Connecting Storage & Live Data Streams`],
          [`Security Hardening & Best Practices`, `Performance Tuning & Automated Benchmarks`, `Packaging, CI/CD & Cloud Deployment`],
        ];

        for (let l = 0; l < 3; l++) {
          await Lesson.create({
            course: course._id,
            module: mod._id,
            title: lessonTitles[m][l],
            durationMinutes: 12 + l * 4,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: `In this comprehensive lesson, you will master ${lessonTitles[m][l]} with detailed hands-on practical demonstrations and production tips.`,
            resources: [
              { name: 'Lecture Cheatsheet & Source Code.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', size: '1.4 MB', type: 'pdf' },
              { name: 'Starter Template Repository.zip', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', size: '4.8 MB', type: 'zip' },
            ],
            order: l + 1,
            isFreePreview: m === 0 && l === 0,
          });
        }
      }

      // Create a Quiz for each course
      await Quiz.create({
        course: course._id,
        title: `${course.title} — Knowledge Assessment`,
        description: 'Test your understanding of the core concepts covered in this course to earn your verified certificate.',
        passingScorePercentage: 70,
        timeLimitMinutes: 15,
        questions: [
          {
            questionText: 'What is the primary benefit of maintaining modular component architecture?',
            options: ['Higher code reusability and isolated testing', 'Slower runtime execution', 'Eliminates the need for CSS', 'Only works with SQL databases'],
            correctOptionIndex: 0,
            explanation: 'Modular architectures encourage separation of concerns, easy maintenance, and reusable testable components.',
            points: 10,
          },
          {
            questionText: 'Which HTTP method is idempotent and conventionally used to replace an entire resource?',
            options: ['POST', 'PUT', 'DELETE', 'PATCH'],
            correctOptionIndex: 1,
            explanation: 'PUT requests are idempotent and replace the full representation of the target resource.',
            points: 10,
          },
          {
            questionText: 'How should sensitive credentials such as database passwords be handled in production?',
            options: ['Committed directly to public GitHub repositories', 'Stored in client-side HTML tags', 'Provided via secure server-side environment variables', 'Hardcoded in JavaScript files'],
            correctOptionIndex: 2,
            explanation: 'Environment variables protect sensitive server secrets from accidental public leaks.',
            points: 10,
          },
        ],
      });
    }

    console.log(`[Seeder] Seeded ${courses.length} Courses with Modules, Lessons & Quizzes.`);

    // 6. Seed Sample Enrollments for Students
    const student1 = students[0];
    const student2 = students[1];

    // Enroll student1 in Course 0 (MERN Stack)
    const enrollment1 = await Enrollment.create({
      student: student1._id,
      course: courses[0]._id,
      status: 'active',
      progressPercentage: 65,
    });

    // Enroll student1 in Course 8 (Free HTML course - completed!)
    const cert1 = await Certificate.create({
      certificateId: 'LEP-CERT-2026-9481',
      student: student1._id,
      course: courses[8]._id,
      instructor: courses[8].instructor,
      studentName: student1.name,
      courseTitle: courses[8].title,
      instructorName: 'Fariya Islam',
      grade: 'A+ with Distinction',
      verificationUrl: '/verify-certificate/LEP-CERT-2026-9481',
    });

    await Enrollment.create({
      student: student1._id,
      course: courses[8]._id,
      status: 'completed',
      progressPercentage: 100,
      certificateGenerated: true,
      certificate: cert1._id,
    });

    // Enroll student2 in Course 0
    await Enrollment.create({
      student: student2._id,
      course: courses[0]._id,
      status: 'active',
      progressPercentage: 33,
    });

    // 7. Seed Course Access Requests (Section 9)
    await CourseRequest.create({
      student: student1._id,
      course: courses[3]._id, // Gen AI course
      instructor: courses[3].instructor,
      status: 'pending',
      reason: 'I am building an AI healthcare app and would love to study your RAG modules.',
    });

    await CourseRequest.create({
      student: student2._id,
      course: courses[2]._id, // Data Science
      instructor: courses[2].instructor,
      status: 'approved',
      reason: 'Seeking access to deepen my statistics and pandas skills.',
      adminNote: 'Approved for early cohort access.',
      respondedAt: new Date(),
    });

    // 8. Seed Reviews
    const reviewComments = [
      'Absolutely top notch quality! The instructor explains complex concepts with effortless clarity.',
      'One of the finest courses I have ever completed online. Real code, real projects, zero fluff.',
      'The hands-on architecture patterns alone are worth 10x the price of this course!',
      'Loved the pacing, the clean code patterns, and the responsive community support in the chat.',
    ];

    for (let i = 0; i < 4; i++) {
      await Review.create({
        course: courses[0]._id,
        student: students[i]._id,
        rating: 5,
        reviewText: reviewComments[i],
        instructorReply: {
          replyText: 'Thank you so much! Excited to see the impressive projects you build next.',
          repliedAt: new Date(),
        },
        isApproved: true,
      });
    }

    // 9. Seed Payments
    await Payment.create({
      transactionId: 'pay_demo_mern_001',
      student: student1._id,
      course: courses[0]._id,
      amount: 49,
      currency: 'USD',
      paymentGateway: 'stripe',
      paymentStatus: 'completed',
      invoiceNumber: 'INV-2026-1001',
    });

    await Payment.create({
      transactionId: 'pay_demo_next_002',
      student: student2._id,
      course: courses[1]._id,
      amount: 39,
      currency: 'USD',
      paymentGateway: 'razorpay',
      paymentStatus: 'completed',
      invoiceNumber: 'INV-2026-1002',
    });

    // 10. Seed Live Classes (Section 11)
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 2);
    upcomingDate.setHours(18, 0, 0, 0);

    const liveTodayDate = new Date();
    liveTodayDate.setHours(liveTodayDate.getHours() + 1);

    await LiveClass.create({
      title: 'Live Q&A & Code Review: React 19 Server Actions & MongoDB Aggregation',
      course: courses[0]._id,
      instructor: instructors[0]._id,
      description: 'Bring your real project code for live screen sharing, optimization reviews, and interactive Q&A.',
      scheduledAt: upcomingDate,
      durationMinutes: 60,
      meetingUrl: 'https://meet.jit.si/learnease-mern-live-qa',
      meetingId: 'learnease-mern-live-qa',
      passcode: 'LEARN2026',
      status: 'scheduled',
    });

    await LiveClass.create({
      title: 'Architecting LLM Agents & Tool Pipelines with LangChain',
      course: courses[3]._id,
      instructor: instructors[2]._id,
      description: 'Hands-on live coding session demonstrating autonomous AI agent execution loops.',
      scheduledAt: liveTodayDate,
      durationMinutes: 90,
      meetingUrl: 'https://meet.jit.si/learnease-ai-agents-workshop',
      meetingId: 'learnease-ai-agents-workshop',
      passcode: 'AIROCK123',
      status: 'scheduled',
    });

    // 11. Seed Chat Rooms & Messages (Section 12)
    const mernRoom = await ChatRoom.create({
      name: `${courses[0].title} Group Chat`,
      type: 'course',
      course: courses[0]._id,
      participants: [instructors[0]._id, student1._id, student2._id, students[2]._id],
      lastMessage: {
        text: 'Welcome everyone! Feel free to ask questions about Module 1 anytime.',
        sender: instructors[0]._id,
        sentAt: new Date(),
      },
    });

    await Message.create({
      chatRoom: mernRoom._id,
      sender: instructors[0]._id,
      text: 'Welcome everyone to the MERN Stack Masterclass group! Feel free to share your progress or post debugging queries.',
    });

    await Message.create({
      chatRoom: mernRoom._id,
      sender: student1._id,
      text: 'Super excited to be here! The lesson on Mongoose schema optimization was brilliant.',
    });

    // 12. Seed Coupons (Section 10)
    await Coupon.create({
      code: 'WELCOME20',
      discountPercent: 20,
      maxDiscountAmount: 30,
      isActive: true,
      usageLimit: 500,
      usedCount: 12,
    });

    await Coupon.create({
      code: 'PROLEARN50',
      discountPercent: 50,
      maxDiscountAmount: 60,
      isActive: true,
      usageLimit: 200,
      usedCount: 45,
    });

    // 13. Seed Notifications
    await Notification.create({
      recipient: student1._id,
      title: 'Upcoming Live Session in 2 Days',
      message: 'Don\'t miss the live Q&A session for MERN Stack 2026 on Friday at 6:00 PM.',
      type: 'class',
      link: '/live-classes',
    });

    await Notification.create({
      recipient: adminUser._id,
      title: 'Platform Analytics Updated',
      message: 'Monthly student enrollments reached a new milestone of 1,250 learners.',
      type: 'system',
      link: '/dashboard/admin',
    });

    console.log('[Seeder] All sample data successfully seeded into MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

