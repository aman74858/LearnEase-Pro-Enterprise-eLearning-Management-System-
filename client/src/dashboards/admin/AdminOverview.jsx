import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  FileQuestion,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import api from '../../services/api';

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then((res) => {
        if (res.data?.success) setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="relative">
          <div className="w-10 h-10 border-3 border-[#128F80]/20 border-t-[#128F80] rounded-full animate-spin" />
          <div className="absolute inset-0 rounded-full bg-[#128F80]/10 blur-xs animate-pulse" />
        </div>
        <p className="text-xs font-semibold text-[#64748B] dark:text-gray-400 tracking-wide">
          Loading platform metrics...
        </p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const monthlyRevenue = data?.monthlyRevenue || [];
  const recentUsers = data?.recentUsers || [];
  const recentPayments = data?.recentPayments || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <span className="text-xs uppercase font-bold tracking-wider text-[#128F80] mb-1 block">
          Platform Administration
        </span>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
          System Overview & Analytics
        </h1>
        <p className="text-xs text-gray-500">
          Real-time metrics from MongoDB database across learners, instructors, courses, and transactions.
        </p>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Students', val: stats.totalStudents || 0, icon: Users, color: 'text-[#128F80]', bg: 'bg-[#128F80]/10' },
          { label: 'Total Instructors', val: stats.totalInstructors || 0, icon: UserCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Total Revenue', val: `$${stats.totalRevenue || 0}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Courses', val: stats.totalCourses || 0, icon: BookOpen, color: 'text-[#F45B48]', bg: 'bg-[#F45B48]/10' },
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

      {/* Analytics Chart (Recharts) */}
      <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              Revenue & Enrollment Trajectory
            </h3>
            <p className="text-xs text-gray-400">Monthly breakdown over the last 6 months</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#128F80]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#128F80]"></span>
              Revenue ($)
            </span>
            <span className="flex items-center gap-1.5 text-[#F45B48]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F45B48]"></span>
              Enrollments
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#128F80" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#128F80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB30" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#128F80"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row: Recent Users & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Registrations */}
        <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white">
              Recent User Registrations
            </h3>
            <Link to="/dashboard/admin/users" className="text-xs font-bold text-[#128F80] hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentUsers.map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#128F80]/20"
                  />
                  <div>
                    <h5 className="font-heading font-bold text-xs text-gray-900 dark:text-white">
                      {u.name}
                    </h5>
                    <p className="text-[11px] text-gray-400">{u.email}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    u.role === 'admin'
                      ? 'bg-rose-500/10 text-rose-500'
                      : u.role === 'instructor'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <Link to="/dashboard/admin/payments" className="text-xs font-bold text-[#128F80] hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentPayments.map((p) => (
              <div key={p._id} className="py-3 flex items-center justify-between">
                <div>
                  <h5 className="font-heading font-bold text-xs text-gray-900 dark:text-white">
                    {p.course?.title || 'Masterclass Tuition'}
                  </h5>
                  <p className="text-[11px] text-gray-400">
                    By {p.student?.name} • Invoice: {p.invoiceNumber}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-heading font-bold text-xs text-[#16A36A] block">
                    +${p.amount}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    {p.paymentGateway}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;

