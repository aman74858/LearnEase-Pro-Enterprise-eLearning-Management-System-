import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('🎉 You have subscribed to our tech learning updates!');
    setEmail('');
  };

  return (
    <section className="py-20 bg-[#F5F7FA] dark:bg-[#0F1319] transition-colors overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-3xl bg-[#128F80] dark:bg-[#087568] p-8 sm:p-14 text-white relative overflow-hidden shadow-card"
        >
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/10 blur-xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="font-heading font-black text-3xl sm:text-4xl mb-4">
              Stay Ahead with Weekly Engineering Insights
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8">
              Join 45,000+ developers receiving free tutorials, live webinar invites, course discounts, and industry tech roadmaps.
            </p>

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-white font-medium text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  Thank you! Check your inbox for your free starter roadmap.
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                      required
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3.5 rounded-xl font-heading font-bold text-sm bg-[#F45B48] hover:bg-[#DE3C24] text-white shadow-md transition-all shrink-0 cursor-pointer"
                  >
                    Subscribe Now
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
            <p className="text-xs text-white/60 mt-4">Zero spam. Unsubscribe at any time with one click.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;

