# LearnEase Pro — Enterprise eLearning Management System (MERN)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-128F80.svg?style=flat-square)](https://react.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055.svg?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101.svg?style=flat-square&logo=socketdotio)](https://socket.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)

**LearnEase Pro** is a modern, responsive, production-ready full-stack eLearning Management System (LMS) inspired by minimal educational SaaS platforms. It is built on the **MERN Stack** (MongoDB, Express.js, React 18 with Vite, Node.js) and features real-time WebSocket communication, micro-animations, role-based dashboards, secure payments, and cryptographic completion certificates.

<img width="1917" height="867" alt="image" src="https://github.com/user-attachments/assets/20c61a47-cbbb-4c25-b0e8-c63e3aca11de" />

---
## 🚀 Live Deployment 
<a href="https://learn-ease-pro-enterprise-e-learning-management-syst-9cmt42we4.vercel.app/">
  Visit LearnEase Pro
</a>

## 🎨 UI/UX Design System & Color Tokens

The visual identity follows a modern, accessible palette with full light and dark mode persistence:

| Token Name | Hex Code | Purpose |
| :--- | :---: | :--- |
| **Primary Brand Teal** | `#128F80` | Primary buttons, active states, progress indicators, branding |
| **Dark Hover Teal** | `#087568` | Hover states, focused controls, high-contrast borders |
| **Accent Coral** | `#F45B48` | Badges, call-to-actions, play triggers, notification counters |
| **Navy Headings** | `#171B25` | High-contrast typography in light mode |
| **Muted Body Text** | `#64748B` | Secondary descriptions, metadata, subtitles |
| **Light Background** | `#F7F9FC` | Default canvas background in light theme |
| **Dark Background** | `#0F1319` | Deep slate canvas background in dark theme |
| **Dark Surface** | `#18202C` | Card and modal surface in dark theme |

### Typography & Accessibility
- **Heading Font**: Poppins (Bold, 600–900 weight)
- **Body Font**: Inter (Clean legibility, 400–500 weight)
- **Smooth Animations**: Framer Motion with automatic `@media (prefers-reduced-motion: reduce)` compliance.

---

## 🚀 Core Features

### 1. Robust Authentication & Role-Based Access Control (RBAC)
- 3 distinct user roles: **Admin**, **Instructor**, and **Student**.
- JWT access tokens with secure HTTP-only cookies and Authorization bearer headers.
- Password hashing with `bcryptjs`.
- Session persistence, password resets, and profile customization.

### 2. Interactive Curriculum & Course Builder
- Hierarchical course management: Courses ➔ Modules ➔ Lessons.
- Embedded video player with progress tracking and lesson completion markers.
- Downloadable lesson attachments (PDFs, exercises, links).
- Dynamic multi-faceted catalog filters (category, price level, difficulty, ratings, sorting).

### 3. Scholarship & Course Access Request System
- 1-click free enrollments and multi-provider paid checkouts (Stripe & Razorpay).
- **Access Request Workflow**: Students can request subsidized/scholarship course access. Instructors and administrators can approve or reject applications in real time with automated notification triggers.

### 4. Interactive Live Video Masterclasses
- Instructors schedule live masterclasses with custom dates, agenda, and participant caps.
- Integrated video classroom with camera, microphone, screen sharing, and live attendance logging.

### 5. Real-Time Group Chat (Socket.IO)
- Course-specific collaborative discussion rooms.
- Live typing indicators, active participant lists, and persistent message history stored in MongoDB.

### 6. Interactive Quizzes & Cryptographic Certificates
- Post-module assessment quizzes with passing criteria and instant explanation feedback.
- Automatic completion calculation (0% to 100%).
- Real-time generation of verifiable **Certificates of Completion** (`LEP-CERT-...`) printable or downloadable as PDF.
- Public certificate validation portal at `/verify-certificate/:certificateId`.

### 7. Administrative Analytics & Governance
- Comprehensive Recharts analytics: 6-month revenue & enrollment graphs, category breakdown, user demographics, and ledger records.
- User management: account activation, suspension, and instructor vetting.
- Subject taxonomy: Full CRUD on course categories.

---

## 🔑 Sample Login Emails & Passwords (Demo Accounts)

The database comes pre-seeded with **1 Administrator**, **5 Instructors**, and **20 Students** across various courses and roles. 

> [!TIP]
> **Universal Password for all demo accounts**: `Password123!`
> You can also use the 1-click demo buttons on the login page (`/login`) to instantly sign in without typing.

### 1. Platform Administrator

| Name | Role | Email | Password | Access & Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **Dr. Evelyn Vance** | Administrator | `admin@learnease.com` | `Password123!` | Full control: Platform Analytics, Manage Users, All Courses, Categories, Revenue Ledgers |

### 2. Instructors

| Name | Domain / Specialization | Email | Password | Access & Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **Fariya Islam** | Senior Full-Stack & React | `fariya@learnease.com` | `Password123!` | Course Builder, Module/Lesson Creator, Access Request Approvals, Live Scheduler |
| **Alex Rivera** | Cloud Architect & DevOps | `alex@learnease.com` | `Password123!` | AWS & Kubernetes Curriculum, Live Masterclasses, Quiz Management |
| **Dr. Sophia Chen** | AI Scientist & Deep Learning | `sophia@learnease.com` | `Password123!` | Generative AI & PyTorch Curriculum, Live Video Sessions |
| **Marcus Brody** | Principal UI/UX Designer | `marcus@learnease.com` | `Password123!` | Design Systems, Figma Masterclasses, Student Feedback |
| **Tariq Rahman** | Cybersecurity Analyst & CEH | `tariq@learnease.com` | `Password123!` | Ethical Hacking & Defensive Security Curriculum |

### 3. Sample Students

| Name | Email | Password | Status & Pre-Enrolled Data |
| :--- | :--- | :--- | :--- |
| **David Miller** | `student1@learnease.com` | `Password123!` | Enrolled in 3 courses; verified certificate holder (`LEP-CERT-2026-9481`) |
| **Emma Watson** | `student2@learnease.com` | `Password123!` | Enrolled in Web Dev & Data Science; active access requests |
| **James Wilson** | `student3@learnease.com` | `Password123!` | Enrolled in Cloud Computing masterclass |
| **Olivia Taylor** | `student4@learnease.com` | `Password123!` | Enrolled in AI & Machine Learning paths |
| **Lucas Anderson** | `student5@learnease.com` | `Password123!` | Active learner with completed quiz submissions |
| **Ava Martinez** | `student6@learnease.com` | `Password123!` | Enrolled in Python Programming path |
| **Liam Thomas** | `student7@learnease.com` | `Password123!` | Enrolled in Full-Stack MERN curriculum |
| **Isabella Garcia**| `student8@learnease.com` | `Password123!` | Enrolled in UI/UX Design course |
| **Noah Robinson** | `student9@learnease.com` | `Password123!` | Enrolled in Cybersecurity course |
| **Mia Clark** | `student10@learnease.com` | `Password123!` | Enrolled in Digital Marketing & Growth |

*(Additional student accounts `student11@learnease.com` through `student20@learnease.com` are also available with the same password: `Password123!`)*

---

### 🎟️ Sample Discount Coupons & Verification

- **20% Off Coupon**: `WELCOME20` (Apply at checkout)
- **50% Off Coupon**: `PROLEARN50` (Apply at checkout)
- **Verified Certificate Sample**: `LEP-CERT-2026-9481` (Test live at `/verify-certificate/LEP-CERT-2026-9481`)

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Visual Analytics**: Recharts
- **Networking**: Axios with interceptors
- **Real-Time Client**: Socket.IO Client
- **Toast Notifications**: React Hot Toast
- **Celebration Effects**: Canvas Confetti

### Backend (`/server`)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose (22 data models)
- **WebSockets**: Socket.IO
- **Security**: Helmet, CORS, Express Rate Limit, Cookie-Parser
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs
- **Payment Integrations**: Stripe & Razorpay SDKs
- **File Uploads**: Multer

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local service or MongoDB Atlas URI)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/learnease-pro.git
cd "LearnEase Pro"

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/learnease_pro
JWT_SECRET=your_jwt_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173

# Cloudinary (Profile Image Uploads)
CLOUDINARY_CLOUD_NAME=dsnj9vngs

**Frontend (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed Database

Populate demo users, 16 full-curriculum courses, categories, certificates, and live classes:

```bash
cd server
npm run seed
```

### 4. Run Both Servers Concurrently

From the root project directory:
```bash
npm run dev
```

Or run each service individually:
```bash
# Terminal 1 — Backend API (Port 5000)
cd server
npm run dev

# Terminal 2 — Frontend App (Port 5173)
cd client
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Verified API Endpoints (100% 200 OK)

The backend provides a RESTful API tested across all roles:

| Category | Method | Route | Description | Auth Required |
| :--- | :---: | :--- | :--- | :---: |
| **System** | `GET` | `/api/health` | Service status check | No |
| **Catalog** | `GET` | `/api/categories` | Browse all categories | No |
| **Catalog** | `GET` | `/api/courses` | Paginated course catalog | No |
| **Catalog** | `GET` | `/api/courses/featured` | Featured course highlights | No |
| **Catalog** | `GET` | `/api/courses/:slug` | Detailed course & syllabus | Optional |
| **Live** | `GET` | `/api/live-classes` | Scheduled live sessions | No |
| **Verification** | `GET` | `/api/certificates/verify/:id` | Certificate authenticity check | No |
| **Auth** | `POST` | `/api/auth/register` | Student or instructor registration | No |
| **Auth** | `POST` | `/api/auth/login` | JWT credentials login | No |
| **Auth** | `GET` | `/api/auth/me` | Fetch active user profile | Bearer Token |
| **Student** | `GET` | `/api/enrollments/my-courses` | User enrolled courses & progress | Student |
| **Student** | `GET` | `/api/wishlist` | Saved courses | Student |
| **Student** | `GET` | `/api/notifications` | User notifications | Student / Any |
| **Student** | `GET` | `/api/course-requests/my-requests`| Submitted access requests | Student |
| **Student** | `GET` | `/api/certificates/my-certificates`| Earned completion certificates | Student |
| **Payment** | `POST` | `/api/payments/apply-coupon` | Validate discount code | Student |
| **Upload** | `POST` | `/api/upload/profile-image` | Upload avatar to Cloudinary CDN (with local fallback) | Authenticated |
| **Upload** | `GET` | `/api/upload/cloudinary-status` | Check Cloudinary connection state | Authenticated |
| **Instructor** | `GET` | `/api/courses/instructor/my-courses`| Instructor's authored courses | Instructor |
| **Instructor** | `POST` | `/api/courses` | Create new course draft | Instructor |
| **Admin** | `GET` | `/api/admin/analytics` | Financial & demographic stats | Admin |
| **Admin** | `GET` | `/api/admin/users` | Platform user administration | Admin |

---

## 📁 Repository Directory Structure

```
LearnEase Pro/
├── client/
│   ├── public/                 # Static assets & favicons
│   ├── src/
│   │   ├── assets/             # Brand logos, hero illustrations, composites
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, CourseCard, ThemeToggle, ProtectedRoute
│   │   │   ├── home/           # HeroSection, FeaturedCourses, Categories, FAQ, etc.
│   │   │   ├── player/         # VideoPlayer, Curriculum, QuizModal
│   │   │   └── chat/           # WebSocket real-time discussion window
│   │   ├── context/            # AuthContext, ThemeContext, SocketContext
│   │   ├── dashboards/
│   │   │   ├── student/        # Overview, EnrolledCourses, Certificates, Wishlist
│   │   │   ├── instructor/     # Overview, ManageCourses, CourseBuilder, LiveScheduler
│   │   │   └── admin/          # AdminOverview, ManageUsers, Analytics, Categories
│   │   ├── layouts/            # MainLayout, DashboardLayout
│   │   ├── pages/              # Home, Courses, Details, Classroom, Checkout, VerifyCert
│   │   ├── services/           # Axios client configured with JWT interceptors
│   │   ├── App.jsx             # React Router declarative routing
│   │   ├── index.css           # Global Tailwind utilities & reduced-motion rules
│   │   └── main.jsx            # Application root
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── config/                 # MongoDB database connector
│   ├── controllers/            # Auth, Course, Request, Payment, LiveClass, Quiz, Admin
│   ├── middleware/             # JWT auth, RBAC permissions, error handlers, Multer
│   ├── models/                 # Mongoose schema definitions (22 models)
│   ├── routes/                 # Express route handlers
│   ├── seed/                   # Seeder script (`seeder.js`)
│   ├── sockets/                # Socket.IO chat and notification handlers
│   ├── uploads/                # Local asset & media storage
│   ├── server.js               # Express & HTTP server entry point
│   ├── package.json
│   └── .env
│
├── README.md
└── package.json                # Root concurrently workspace orchestration
```

---

## 🛡️ Production Build & Verification

```bash
# Build the client for production
cd client
npm run build
```
The client compiles cleanly with **0 errors** using Vite into `/client/dist`.

---

## 📄 License

This project is licensed under the ISC License.

© 2026 LearnEase Pro Team. All rights reserved.
