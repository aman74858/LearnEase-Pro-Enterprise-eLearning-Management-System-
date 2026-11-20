import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, DollarSign, Star, PlusCircle, Video, FileQuestion, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const InstructorOverview = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({ totalCourses: 0, totalStudents: 0, averageRating: 5.0 });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const courseRes = await api.get('/courses/instructor/my-courses');
        if (courseRes.data?.success) {
          setCourses(courseRes.data.courses);
          setAnalytics(courseRes.data.analytics);
        }

        const reqRes = await api.get('/course-requests?status=pending');
        if (reqRes.data?.success) {
          setPendingRequests(reqRes.data.requests);
        }
      } catch (err) {
        console.error('Error fetching instructor overview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="relative">
          <div className="w-10 h-10 border-3 border-[#128F80]/20 border-t-[#128F80] rounded-full animate-spin" />
          <div className="absolute inset-0 rounded-full bg-[#128F80]/10 blur-xs animate-pulse" />
        </div>
        <p className="text-xs font-semibold text-[#64748B] dark:text-gray-400 tracking-wide">
          Loading instructor portal...
        </p>
      </div>
    );
  }

  // Calculate estimated earnings
  const estimatedEarnings = courses.reduce((acc, c) => acc + ((c.enrolledCount || 0) * (c.discountPrice || c.price || 0) * 0.7), 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18202C] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-soft"
      >
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#128F80] mb-1 block">
            Instructor Portal
          </span>
          <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white">
            Hello, {user?.name}!
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your courses, review student applications, and host live masterclasses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/instructor/new-course"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all shadow-card active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Course</span>
          </Link>
          <Link
            to="/dashboard/instructor/schedule-live"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#128F80] transition-all active:scale-95"
          >
            <Video className="w-4 h-4 text-[#F45B48]" />
            <span>Schedule Live</span>
          </Link>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Published Courses', val: analytics.totalCourses, icon: BookOpen, color: 'text-[#128F80]', bg: 'bg-[#128F80]/10' },
          { label: 'Active Students', val: analytics.totalStudents, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Est. Earnings', val: `$${Math.round(estimatedEarnings)}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Average Rating', val: analytics.averageRating, icon: Star, color: 'text-[#F45B48]', bg: 'bg-[#F45B48]/10' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className="bg-white dark:bg-[#18202C] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft transition-shadow hover:shadow-card"
            >
              <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-500 font-medium">{m.label}</span>
              <h3 className="font-heading font-black text-2xl text-gray-900 dark:text-white mt-1">
                {m.val}
              </h3>
            </motion.div>
          );
        })}
      </div>

      {/* Pending Access Requests Widget */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50/60 dark:bg-amber-950/20 rounded-3xl p-6 border border-amber-200 dark:border-amber-900/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-base text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-amber-600" />
              {pendingRequests.length} Pending Student Access Requests
            </h3>
            <Link
              to="/dashboard/instructor/requests"
              className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline"
            >
              Review Now →
            </Link>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300/80">
            You have students requesting enrollment access. Approving them immediately unlocks your curriculum and fires a congratulatory notification.
          </p>
        </div>
      )}

      {/* Courses List Snippet */}
      <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
            Recent Courses
          </h3>
          <Link
            to="/dashboard/instructor/courses"
            className="text-xs font-bold text-[#128F80] hover:underline"
          >
            Manage All
          </Link>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {courses.slice(0, 4).map((c) => (
            <div key={c._id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-14 h-10 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-1">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {c.enrolledCount || 0} students • {c.level} • {c.isFree ? 'Free' : `$${c.price}`}
                  </p>
                </div>
              </div>

              <Link
                to={`/courses/${c.slug}`}
                className="text-xs font-semibold text-[#128F80] hover:underline shrink-0"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorOverview;

