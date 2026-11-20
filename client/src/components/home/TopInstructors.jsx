import React from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import googleLogo from '../../assets/partners/google.png';
import metaLogo from '../../assets/partners/meta.png';
import awsLogo from '../../assets/partners/aws.png';
import spotifyLogo from '../../assets/partners/spotify.png';

const mentors = [
  {
    name: 'Fariya Islam',
    role: 'Senior React & Full-Stack Architect',
    company: 'Meta',
    companyLogo: metaLogo,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    rating: 5.0,
    students: '12,400+',
    courses: 4,
  },
  {
    name: 'Dr. Sophia Chen',
    role: 'AI Research Scientist & Deep Learning Lead',
    company: 'Google',
    companyLogo: googleLogo,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    students: '9,800+',
    courses: 3,
  },
  {
    name: 'Alex Rivera',
    role: 'Lead Cloud Architect & AWS Consultant',
    company: 'AWS',
    companyLogo: awsLogo,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    students: '7,500+',
    courses: 2,
  },
  {
    name: 'Marcus Brody',
    role: 'Principal UI/UX Designer & Product Strategist',
    company: 'Spotify',
    companyLogo: spotifyLogo,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    students: '6,200+',
    courses: 2,
  },
];

const TopInstructors = () => {
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
            Expert Mentorship
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] dark:text-white mb-4">
            Learn From Industry Leaders
          </h2>
          <p className="text-sm sm:text-base text-[#667085] dark:text-gray-400">
            Our instructors are active senior architects, engineering directors, and product leaders from world-class organizations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mentors.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-white dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-card text-center flex flex-col items-center transition-all duration-200"
            >
              <div className="relative mb-4">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-[#128F80]"
                />
                <span className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-1 rounded-lg shadow-sm">
                  <Star className="w-4 h-4 fill-white" />
                </span>
              </div>

              {/* Company affiliation badge */}
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-gray-700 mb-2 min-h-[28px]">
                <img src={m.companyLogo} alt={m.company} className="h-4 max-w-[52px] w-auto object-contain" />
              </div>

              <h3 className="font-heading font-bold text-lg text-[#151B24] dark:text-white mb-1">
                {m.name}
              </h3>
              <p className="text-xs text-[#667085] dark:text-gray-400 mb-4 line-clamp-2">
                {m.role}
              </p>

              <div className="w-full pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-around text-xs text-gray-500 mt-auto">
                <div className="flex items-center gap-1 font-semibold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{m.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{m.students}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  <span>{m.courses} courses</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopInstructors;
