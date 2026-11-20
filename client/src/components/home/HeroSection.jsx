import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowUpRight, Star, BookOpen } from 'lucide-react';
import heroCompositePng from '../../assets/hero-composite.png';
import api from '../../services/api';

const HeroSection = () => {
  const [courseCount, setCourseCount] = useState(15);

  useEffect(() => {
    api.get('/courses?limit=1')
      .then((res) => {
        if (res.data?.total) {
          setCourseCount(res.data.total);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-16 lg:pt-28 lg:pb-24 bg-[#F7F9FC] dark:bg-[#0F1319] transition-colors">
      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#128F80]/10 via-[#F45B48]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-[#128F80]/8 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          
          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN: Heading, Subtitle, CTAs & Statistics
          ══════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-6 flex flex-col items-start"
          >
            {/* Small Label Pill: • E-LEARNING PLATFORM */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F45B48]/10 text-[#F45B48] font-semibold text-xs tracking-wider uppercase mb-6 shadow-xs border border-[#F45B48]/20">
              <span className="w-2 h-2 rounded-full bg-[#F45B48] animate-pulse" />
              E-Learning Platform
            </div>

            {/* Main Heading */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-[54px] leading-[1.12] text-[#171B25] dark:text-white tracking-tight mb-6">
              Unlock Your Potential<br />
              with{' '}
              <span className="text-[#F45B48] relative inline-block">
                Powerful Online
                {/* Coral hand-drawn brush underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 250 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 10C65 4 185 4 246 10"
                    stroke="#F45B48"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span><br />
              Learning
            </h1>

            {/* Sub-description */}
            <p className="text-[#64748B] dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Gain competitive industry skills through production-quality curriculum, live interactive masterclasses, peer group discussions, and accredited certifications.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-12">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-white bg-[#128F80] hover:bg-[#087568] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group"
              >
                <span>Start Learning</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-3 text-base font-semibold text-[#171B25] dark:text-white hover:text-[#F45B48] dark:hover:text-[#F45B48] transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#F45B48] flex items-center justify-center text-white shadow-md group-hover:scale-110 active:scale-95 transition-transform relative">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                  <span className="absolute inset-0 rounded-full border-2 border-[#F45B48] animate-ping opacity-25 pointer-events-none" />
                </div>
                <span>How It Works</span>
              </a>
            </div>

            {/* Statistics Section */}
            <div className="pt-6 border-t border-gray-200/80 dark:border-gray-800 flex flex-wrap items-center gap-6 sm:gap-8">
              {/* Learners */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3 overflow-hidden">
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Student"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    alt="Student"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
                    alt="Student"
                  />
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#128F80] text-white text-xs font-bold ring-2 ring-white dark:ring-slate-900">
                    +10k
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#171B25] dark:text-white">10,000+ Learners</p>
                  <p className="text-xs text-[#64748B] dark:text-gray-400">Enrolled worldwide</p>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#171B25] dark:text-white">4.9 / 5.0 Rating</p>
                  <p className="text-xs text-[#64748B] dark:text-gray-400">From 3,200+ reviews</p>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 hidden md:block" />

              {/* Curricula */}
              <div className="hidden md:flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#128F80]/15 text-[#128F80] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#171B25] dark:text-white">{courseCount}+ Curricula</p>
                  <p className="text-xs text-[#64748B] dark:text-gray-400">Production MERN & AI</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN: Clean Hero Student Composition
              - Matches the reference screenshot with student thumbs up,
                teal backdrop squircle, orbit lines, floating brand cards,
                and books with transparent alpha background.
              - 100% genuine alpha transparency - no box, card, or border.
          ══════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-6 relative flex justify-center items-center"
          >
            {/* Soft Ambient Radial Floor Glow */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[420px] h-[240px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center bottom, rgba(18, 143, 128, 0.24) 0%, transparent 70%)' }}
            />

            {/* Student Illustration Container - Directly on Hero background with gentle subtle float */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="relative z-10 w-full max-w-[460px] sm:max-w-[540px] lg:max-w-[620px] flex items-center justify-center"
            >
              <img
                src={heroCompositePng}
                alt="LearnEase Pro - Confident Student with Headphones, Tablet & Thumbs Up"
                className="w-full h-auto max-h-[480px] sm:max-h-[540px] lg:max-h-[600px] object-contain select-none drop-shadow-[0_20px_35px_rgba(8,117,104,0.18)] dark:drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-[1.015]"
                draggable={false}
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
