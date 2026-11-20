import React from 'react';
import { motion } from 'framer-motion';
import { Video, Award, MessageSquare, Terminal, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: Terminal,
    title: 'Industry-Grade Project Curricula',
    description: 'Build real-world production applications using modern enterprise stacks, not just toys or trivial todo lists.',
    color: '#128F80',
  },
  {
    icon: Video,
    title: 'Live Interactive Masterclasses',
    description: 'Join real-time video classrooms with industry leaders, participate in live screen-sharing, and get instant answers.',
    color: '#F45B48',
  },
  {
    icon: MessageSquare,
    title: 'Peer Discussion & Direct Mentorship',
    description: 'Collaborate with fellow learners and instructors in dedicated course chatrooms with real-time WebSockets.',
    color: '#075C53',
  },
  {
    icon: Award,
    title: 'Accredited Verifiable Certificates',
    description: 'Earn cryptographic, uniquely identified certificates upon 100% course completion that link directly to your portfolio.',
    color: '#16A36A',
  },
  {
    icon: ShieldCheck,
    title: 'Flexible Access & Free Trials',
    description: 'Explore free introductory lectures or submit access requests directly to course instructors for sponsored seats.',
    color: '#F4B740',
  },
  {
    icon: Zap,
    title: 'Self-Paced Progress Tracking',
    description: 'Track lesson milestones, test your retention with quizzes, and resume exactly where you left off across any device.',
    color: '#3CBBA7',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-[#F5F7FA] dark:bg-[#0F1319] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#128F80] tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#128F80]"></span>
            Why LearnEase Pro
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] dark:text-white mb-4">
            Designed for Modern Tech Mastery
          </h2>
          <p className="text-sm sm:text-base text-[#667085] dark:text-gray-400">
            Everything you need to transform from beginner or junior developer to confident, job-ready full-stack engineer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-2xl bg-white dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-card transition-all duration-200"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${feat.color}15`,
                    color: feat.color,
                  }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#151B24] dark:text-white mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#667085] dark:text-gray-400 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

