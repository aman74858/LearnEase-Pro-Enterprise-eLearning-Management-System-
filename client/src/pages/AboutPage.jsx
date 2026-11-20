import React from 'react';
import { Target, Users, Award, Shield, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-28 pb-20 bg-[#F5F7FA] dark:bg-[#0F1319] min-h-screen transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#128F80]/10 text-[#128F80] font-bold text-xs uppercase tracking-wider mb-3">
            Empowering Future Builders
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#151B24] dark:text-white mb-4">
            Democratizing World-Class Tech Education
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            LearnEase Pro was born to bridge the gap between superficial video tutorials and real-world engineering excellence.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-[#128F80]/10 text-[#128F80] flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-2">
              Our Mission
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              To empower anyone anywhere to acquire high-value technical proficiencies with certified guidance and live mentorship.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-[#F45B48]/10 text-[#F45B48] flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-2">
              Vibrant Community
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Connect directly with ambitious peers and experienced mentors across 40+ countries in real-time discussion rooms.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-2">
              Verifiable Quality
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Every course is backed by practical quizzes, real-world portfolio requirements, and cryptographically verified certificates.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;

