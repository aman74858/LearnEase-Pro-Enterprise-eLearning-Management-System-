import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import {
  Search,
  BookOpen,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Bell,
  Video,
  ChevronDown,
} from 'lucide-react';
import api from '../../services/api';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isInstructor } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications')
        .then((res) => {
          if (res.data?.success) {
            setUnreadNotifications(res.data.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const getDashboardLink = () => {
    if (isAdmin) return '/dashboard/admin';
    if (isInstructor) return '/dashboard/instructor';
    return '/dashboard/student';
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    ...(isAuthenticated ? [{ name: 'Live Classes', path: '/live-classes' }] : []),
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#151B24]/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Logo size="lg" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-[#128F80] ${
                    isActive
                      ? 'text-[#128F80] font-semibold flex items-center gap-1.5'
                      : 'text-[#171B25]/80 dark:text-gray-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#128F80]"></span>}
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/courses"
              aria-label="Search Courses"
              className="p-2 text-gray-500 hover:text-[#128F80] dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#128F80] dark:hover:border-[#128F80] transition-all bg-white dark:bg-slate-800 shadow-sm"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#128F80]/20"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 mr-1" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50 origin-top-right"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-[#128F80]/10 text-[#128F80] dark:bg-[#128F80]/20 dark:text-[#3CBBA7]">
                          {user.role}
                        </span>
                      </div>

                      <Link
                        to={getDashboardLink()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#128F80]" />
                        Dashboard
                      </Link>

                      {user.role === 'student' && (
                        <Link
                          to="/dashboard/student/my-courses"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-[#128F80]" />
                          My Enrolled Courses
                        </Link>
                      )}

                      <Link
                        to="/live-classes"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Video className="w-4 h-4 text-[#F45B48]" />
                        Live Classes
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-800 mt-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#171B25] dark:text-gray-200 hover:text-[#128F80] transition-colors px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#128F80] hover:bg-[#087568] rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-95"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden mt-4 pb-6 pt-2 border-t border-gray-200 dark:border-gray-800"
            >
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-[#128F80] py-1 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2.5 px-4 rounded-xl font-medium bg-[#128F80] hover:bg-[#087568] text-white transition-colors"
                      >
                        Go to Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-center py-2.5 px-4 rounded-xl font-medium border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2.5 px-4 rounded-xl font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#128F80] transition-colors"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2.5 px-4 rounded-xl font-medium bg-[#128F80] hover:bg-[#087568] text-white transition-colors"
                      >
                        Join Us
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;

