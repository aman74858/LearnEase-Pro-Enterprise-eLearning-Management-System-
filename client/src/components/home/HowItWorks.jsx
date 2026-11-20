import React from 'react';
import { motion } from 'framer-motion';
import { Search, PlayCircle, Award, Briefcase } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse & Select Course',
    description: 'Explore cutting-edge curricula across MERN, AI, Cloud, and Data Science with free preview videos.',
  },
  {
    number: '02',
    icon: PlayCircle,
    title: 'Enroll or Request Access',
    description: 'Instant checkout via Stripe/Razorpay or submit a course access request directly for review.',
  },
  {
    number: '03',
    icon: Award,
    title: 'Learn, Build & Test',
    description: 'Watch HD videos, download resources, take quizzes, and interact in real-time student group chat.',
  },
  {
    number: '04',
    icon: Briefcase,
    title: 'Earn Verified Credentials',
    description: 'Graduate with authentic, verifiable PDF certificates and level-up your professional career.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-[#151B24] transition-colors scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F45B48] tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#F45B48]"></span>
            Learning Roadmap
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] dark:text-white mb-4">
            How LearnEase Pro Works
          </h2>
          <p className="text-sm sm:text-base text-[#667085] dark:text-gray-400">
            Four simple steps to transform your technical skills and launch your next high-impact career move.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl transition-all"
              >
                {/* Step Number */}
                <div className="w-16 h-16 rounded-2xl bg-[#128F80]/10 text-[#128F80] dark:bg-[#128F80]/20 dark:text-[#3CBBA7] flex items-center justify-center font-heading font-black text-xl mb-6 shadow-sm group-hover:scale-105 transition-transform">
                  {step.number}
                </div>

                <h3 className="font-heading font-bold text-lg text-[#151B24] dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

