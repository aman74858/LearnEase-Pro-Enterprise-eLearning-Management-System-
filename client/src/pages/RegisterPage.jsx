import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/common/Logo';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password Strength Calculation
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, text: '', color: 'bg-gray-200' };
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, text: 'Weak', color: 'bg-rose-500', width: 'w-1/3' };
    if (score <= 4) return { score, text: 'Moderate', color: 'bg-amber-500', width: 'w-2/3' };
    return { score, text: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        headline: headline.trim() || (role === 'instructor' ? 'Course Instructor' : 'Passionate Student'),
      });

      if (result?.success) {
        if (role === 'instructor') {
          navigate('/dashboard/instructor');
        } else {
          navigate('/dashboard/student');
        }
      } else {
        setErrorMessage(result?.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen flex items-center justify-center bg-[#F5F7FA] dark:bg-[#0F1319] px-4 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-lg w-full bg-white dark:bg-[#18202C] rounded-3xl p-8 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-float"
      >

        {/* Header */}
        <div className="text-center mb-7">
          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <h2 className="font-heading font-black text-2xl text-gray-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Join thousands of developers and educators leveling up daily.
          </p>
        </div>

        {/* Account Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 rounded-2xl bg-gray-100 dark:bg-slate-900">
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setRole('student')}

            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${role === 'student'
              ? 'bg-white dark:bg-[#18202C] text-[#128F80] shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
          >
            <User className="w-4 h-4" />
            I am a Student
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setRole('instructor')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${role === 'instructor'
              ? 'bg-white dark:bg-[#18202C] text-[#128F80] shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
          >
            <Briefcase className="w-4 h-4" />
            I am an Instructor
          </motion.button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80] focus:ring-2 focus:ring-[#128F80]/20 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="jane@domain.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80] focus:ring-2 focus:ring-[#128F80]/20 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Min. 6 characters"
                className="w-full pl-10 pr-11 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80] focus:ring-2 focus:ring-[#128F80]/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1 animate-fadeIn">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>Strength: <strong className="font-semibold text-gray-700 dark:text-gray-300">{strength.text}</strong></span>
                  <span>{password.length >= 8 ? '✓ Good length' : 'Min 8 recommended'}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Re-enter your password"
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none transition-all ${confirmPassword && confirmPassword !== password
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-gray-200 dark:border-gray-700 focus:border-[#128F80]'
                  }`}
              />
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="text-[11px] text-rose-500 mt-1">Passwords do not match.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              Professional Headline / Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder={role === 'instructor' ? 'Senior Full-Stack Engineer' : 'Aspiring Software Developer'}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80] focus:ring-2 focus:ring-[#128F80]/20 transition-all"
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm bg-[#128F80] hover:bg-[#087568] text-white transition-all duration-200 shadow-card hover:shadow-card-hover flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-4"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#128F80] dark:text-[#3CBBA7] hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
