import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does the Course Access Request feature work?',
    a: 'Students can request access to any course by clicking "Request Access" on the course details page. The instructor or platform admin will receive an immediate notification, review the application, and grant full enrollment upon approval.',
  },
  {
    q: 'Are certificates included upon course completion?',
    a: 'Yes! Once you reach 100% progress across all lessons and pass the course assessment quiz, our system dynamically generates a cryptographically unique, verified PDF certificate that you can print, download, or share with employers.',
  },
  {
    q: 'How do live learning classes work?',
    a: 'Instructors schedule live sessions directly in their dashboard. Enrolled students receive notifications and can enter our embedded interactive live room (with video, microphone, screen sharing, and live text chat) with one click.',
  },
  {
    q: 'Can I purchase individual courses without a monthly subscription?',
    a: 'Absolutely! You can purchase standalone lifetime access to any specific course via Stripe or Razorpay, or enroll directly in our free courses anytime.',
  },
  {
    q: 'Can instructors upload their own videos and resources?',
    a: 'Yes. Verified instructors have complete course management capabilities: they can create modules, upload lecture videos and PDFs, set quizzes, review student access requests, and reply to course reviews.',
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-20 bg-white dark:bg-[#151B24] transition-colors overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F45B48] tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#F45B48]"></span>
            Common Questions
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#667085] dark:text-gray-400">
            Have questions about LearnEase Pro? Here are answers to the most common inquiries.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06, ease: 'easeOut' }}
                className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-[#F5F7FA] dark:bg-[#18202C] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between font-heading font-bold text-base text-[#151B24] dark:text-white hover:text-[#128F80] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ml-4 ${
                      isOpen ? 'transform rotate-180 text-[#128F80]' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-[#667085] dark:text-gray-300 leading-relaxed border-t border-gray-200/40 dark:border-gray-800/60 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

