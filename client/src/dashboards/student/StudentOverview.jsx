import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Clock, ArrowRight, PlayCircle, Video, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentOverview = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({ totalEnrolled: 0, completed: 0, inProgress: 0 });
  const [certificatesCount, setCertificatesCount] = useState(0);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const enrollRes = await api.get('/enrollments/my-courses');
        if (enrollRes.data?.success) {
          setEnrollments(enrollRes.data.enrollments);
          setStats(enrollRes.data.stats);
        }

        const certRes = await api.get('/certificates/my-certificates');
        if (certRes.data?.success) {
          setCertificatesCount(certRes.data.certificates.length);
        }

        const liveRes = await api.get('/live-classes?status=scheduled');
        if (liveRes.data?.success) {
          setUpcomingClasses(liveRes.data.liveClasses.slice(0, 2));
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="relative">
          <div className="w-10 h-10 border-3 border-[#128F80]/20 border-t-[#128F80] rounded-full animate-spin" />
          <div className="absolute inset-0 rounded-full bg-[#128F80]/10 blur-xs animate-pulse" />
        </div>
        <p className="text-xs font-semibold text-[#64748B] dark:text-gray-400 tracking-wide">
          Loading student dashboard...
        </p>
      </div>
    );
  }

  const latestCourse = enrollments[0];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-gradient-to-r from-[#128F80] to-[#075C53] rounded-3xl p-6 sm:p-10 text-white shadow-card relative overflow-hidden"
      >
        <div className="relative z-10 max-w-xl">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-200 mb-2 block">
            Student Dashboard
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl mb-2">
            Welcome back, {user?.name.split(' ')[0]}! 🚀
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
            You're making great progress. Complete your lessons, take the module assessments, and earn your verified industry certificates.
          </p>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-[#075C53] hover:bg-gray-100 shadow-md transition-all active:scale-95"
          >
            <span>Explore More Masterclasses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Enrolled', val: stats.totalEnrolled, icon: BookOpen, color: 'text-[#128F80]', bg: 'bg-[#128F80]/10' },
          { label: 'In Progress', val: stats.inProgress, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Completed', val: stats.completed, icon: CheckCircle2, color: 'text-[#16A36A]', bg: 'bg-[#16A36A]/10' },
          { label: 'Certificates', val: certificatesCount, icon: Award, color: 'text-[#F45B48]', bg: 'bg-[#F45B48]/10' },
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

      {/* Continue Learning Widget */}
      {latestCourse && (
        <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#128F80]">
                Resume Learning
              </span>
              <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white mt-0.5">
                {latestCourse.course?.title}
              </h3>
            </div>
            <Link
              to={`/learn/${latestCourse.course?._id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all shadow-card"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Enter Classroom</span>
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>Overall Course Completion</span>
              <span>{latestCourse.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#128F80] h-full rounded-full transition-all duration-500"
                style={{ width: `${latestCourse.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Live Classes Widget */}
      {upcomingClasses.length > 0 && (
        <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-[#F45B48]" />
              Upcoming Live Sessions
            </h3>
            <Link to="/live-classes" className="text-xs font-bold text-[#128F80] hover:underline">
              View All Schedule
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcomingClasses.map((cls) => (
              <div
                key={cls._id}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#128F80] bg-[#128F80]/10 px-2 py-0.5 rounded">
                    {cls.course?.title}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white mt-2 mb-1">
                    {cls.title}
                  </h4>
                  <p className="text-xs text-gray-400 mb-4">
                    Host: {cls.instructor?.name} • {new Date(cls.scheduledAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to={`/live-room/${cls._id}`}
                  className="w-full py-2 text-center rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all"
                >
                  Join Live Room
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOverview;

