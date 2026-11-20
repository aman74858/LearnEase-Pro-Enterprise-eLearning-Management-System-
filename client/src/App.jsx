import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public & Student Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ClassroomPage from './pages/ClassroomPage';
import LiveClassesPage from './pages/LiveClassesPage';
import LiveClassRoomPage from './pages/LiveClassRoomPage';
import CheckoutPage from './pages/CheckoutPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Student Dashboard Pages
import StudentOverview from './dashboards/student/StudentOverview';
import EnrolledCourses from './dashboards/student/EnrolledCourses';
import StudentCertificates from './dashboards/student/StudentCertificates';
import StudentRequests from './dashboards/student/StudentRequests';
import StudentWishlist from './dashboards/student/StudentWishlist';
import ProfileSettings from './dashboards/ProfileSettings';

// Instructor Dashboard Pages
import InstructorOverview from './dashboards/instructor/InstructorOverview';
import ManageCourses from './dashboards/instructor/ManageCourses';
import CourseBuilder from './dashboards/instructor/CourseBuilder';
import AccessRequests from './dashboards/instructor/AccessRequests';
import ScheduleLiveClass from './dashboards/instructor/ScheduleLiveClass';

// Admin Dashboard Pages
import AdminOverview from './dashboards/admin/AdminOverview';
import ManageUsers from './dashboards/admin/ManageUsers';
import ManageAllCourses from './dashboards/admin/ManageAllCourses';
import ManageCategories from './dashboards/admin/ManageCategories';
import ManagePayments from './dashboards/admin/ManagePayments';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#18202C',
            color: '#FFFFFF',
            fontSize: '13px',
            borderRadius: '12px',
          },
        }}
      />

      <Routes>
        {/* Main Website Pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailsPage />} />
          <Route path="/live-classes" element={<LiveClassesPage />} />
          <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
          <Route path="/verify-certificate/:certificateId" element={<VerifyCertificatePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Classroom & Checkout (Focused Mode) */}
        <Route
          path="/learn/:courseId"
          element={
            <ProtectedRoute>
              <ClassroomPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/:courseId"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live-room/:id"
          element={
            <ProtectedRoute>
              <LiveClassRoomPage />
            </ProtectedRoute>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentOverview />} />
          <Route path="my-courses" element={<EnrolledCourses />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="requests" element={<StudentRequests />} />
          <Route path="wishlist" element={<StudentWishlist />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>

        {/* Instructor Dashboard */}
        <Route
          path="/dashboard/instructor"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InstructorOverview />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="new-course" element={<CourseBuilder />} />
          <Route path="requests" element={<AccessRequests />} />
          <Route path="schedule-live" element={<ScheduleLiveClass />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="courses" element={<ManageAllCourses />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="payments" element={<ManagePayments />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>

        {/* Wildcard 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;

