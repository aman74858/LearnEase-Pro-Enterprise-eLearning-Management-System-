import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Calendar, Users, Radio, ArrowRight } from 'lucide-react';

const LiveLearningBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-[#075C53] via-[#128F80] to-[#0A5A4F] text-white relative overflow-hidden">
      {/* Decorative blurred rings */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
      <div className="absolute left-10 top-0 w-60 h-60 rounded-full bg-[#F45B48]/20 blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F45B48] text-white font-bold text-xs uppercase tracking-wider mb-4 shadow-sm animate-pulse-subtle">
              <Radio className="w-3.5 h-3.5" />
              Live Interactive Classrooms
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4 leading-tight">
              Real-Time Code Reviews, Architecture Teardowns & Live Q&A
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Don't just watch static videos. Join live weekly classrooms, ask questions directly over video/audio, share your screen for live debugging, and network with instructors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/live-classes"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-heading font-bold text-sm bg-white text-[#075C53] hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all active:scale-95 group"
            >
              <span>Explore Live Schedule</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LiveLearningBanner;

