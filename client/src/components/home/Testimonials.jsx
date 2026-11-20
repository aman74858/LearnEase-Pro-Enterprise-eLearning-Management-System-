import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'David Miller',
    role: 'Full-Stack Developer at FinTech Global',
    avatar: 'https://images.unsplash.com/photo-1535713875002?auto=format&fit=crop&w=150&q=80',
    quote: 'LearnEase Pro changed my career completely. The MERN Stack course taught me production MongoDB indexing, JWT auth with secure cookies, and live socket chat that helped me ace my technical interview!',
    rating: 5,
  },
  {
    name: 'Emma Watson',
    role: 'AI Engineer at SynthLogic',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    quote: 'Dr. Sophia\'s Generative AI course is unmatched. Building real RAG pipelines and autonomous agents gave me hands-on confidence that textbook tutorials could never replicate.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Cloud DevOps Specialist at CloudScale',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    quote: 'The live interactive classes and direct instructor answers were game-changers. Passed my AWS Solutions Architect exam on the very first try!',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white dark:bg-[#151B24] transition-colors overflow-hidden">
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
            Learner Success
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] dark:text-white mb-4">
            Loved by 10,000+ Learners Worldwide
          </h2>
          <p className="text-sm sm:text-base text-[#667085] dark:text-gray-400">
            Read authentic reviews from professionals who leveraged LearnEase Pro to break into top engineering roles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-[#F5F7FA] dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 flex flex-col justify-between shadow-soft hover:shadow-card transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#128F80]/30" />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60 dark:border-gray-800">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#128F80]"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#151B24] dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

