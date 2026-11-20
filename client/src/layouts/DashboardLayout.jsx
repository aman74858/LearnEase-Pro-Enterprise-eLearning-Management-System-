import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import Logo from '../components/common/Logo';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Award,
  Heart,
  FileQuestion,
  Users,
  Settings,
  FolderKanban,
  DollarSign,
  PlusCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout, isAdmin, isInstructor, isStudent } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Student navigation links
  const studentLinks = [
    { name: 'Overview', path: '/dashboard/student', icon: LayoutDashboard },
    { name: 'My Enrolled Courses', path: '/dashboard/student/my-courses', icon: BookOpen },
    { name: 'My Certificates', path: '/dashboard/student/certificates', icon: Award },
    { name: 'Course Requests', path: '/dashboard/student/requests', icon: FileQuestion },
    { name: 'Saved Wishlist', path: '/dashboard/student/wishlist', icon: Heart },
    { name: 'Live Classes', path: '/live-classes', icon: Video },
    { name: 'My Profile', path: '/dashboard/student/profile', icon: Settings },
  ];

  // Instructor navigation links
  const instructorLinks = [
    { name: 'Dashboard Overview', path: '/dashboard/instructor', icon: LayoutDashboard },
    { name: 'My Courses', path: '/dashboard/instructor/courses', icon: BookOpen },
    { name: 'Create Course', path: '/dashboard/instructor/new-course', icon: PlusCircle },
    { name: 'Access Requests', path: '/dashboard/instructor/requests', icon: FileQuestion },
    { name: 'Schedule Live Class', path: '/dashboard/instructor/schedule-live', icon: Video },
    { name: 'My Profile', path: '/dashboard/instructor/profile', icon: Settings },
  ];

  // Admin navigation links
  const adminLinks = [
    { name: 'Platform Analytics', path: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/dashboard/admin/users', icon: Users },
    { name: 'All Platform Courses', path: '/dashboard/admin/courses', icon: BookOpen },
    { name: 'Categories Manager', path: '/dashboard/admin/categories', icon: Layers },
    { name: 'Payments & Revenue', path: '/dashboard/admin/payments', icon: DollarSign },
    { name: 'My Profile', path: '/dashboard/admin/profile', icon: Settings },
  ];

  const currentLinks = isAdmin ? adminLinks : isInstructor ? instructorLinks : studentLinks;

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0F1319] flex flex-col md:flex-row transition-colors">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white dark:bg-[#18202C] px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 z-40">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-[#18202C] border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between z-50 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between mb-8">
            <Logo size="md" />
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800 flex items-center gap-3 mb-6">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover border border-[#128F80]/30"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-heading font-bold text-xs text-gray-900 dark:text-white truncate">
                {user?.name}
              </h4>
              <span className="inline-block text-[10px] uppercase font-bold text-[#128F80] bg-[#128F80]/10 px-2 py-0.5 rounded">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/dashboard/student' || link.path === '/dashboard/instructor' || link.path === '/dashboard/admin'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#128F80] text-white shadow-card'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          {!isAdmin && (
            <Link
              to="/courses"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#128F80]" />
              <span>Browse All Courses</span>
            </Link>
          )}
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLayout;

