import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for exploring programming fundamentals and introductory workshops.',
    features: [
      'Access to all Free Courses',
      'Community discussion forums',
      'Downloadable lecture code samples',
      'Basic lesson completion tracking',
    ],
    buttonText: 'Get Started Free',
    buttonLink: '/register',
    isPopular: false,
  },
  {
    name: 'Pro Monthly',
    price: '$29',
    period: 'per month',
    description: 'Unlimited access to all production masterclasses, live rooms, and certificates.',
    features: [
      'Unlimited access to all 15+ Masterclasses',
      'Live interactive video masterclasses weekly',
      'Real-time course group chat with instructors',
      'Verifiable accredited PDF certificates',
      'Quizzes, assignments & instructor code reviews',
      'Priority student support',
    ],
    buttonText: 'Start Pro Trial',
    buttonLink: '/register',
    isPopular: true,
  },
  {
    name: 'Enterprise Annual',
    price: '$199',
    period: 'per year',
    description: 'Best value for career changers and dev teams wanting full mastery with 40% savings.',
    features: [
      'Everything in Pro Monthly included',
      'Save 40% compared to monthly billing',
      '1-on-1 monthly portfolio mentorship session',
      'Lifetime certificate verification pages',
      'Early access to newly released courses',
      'Offline video downloads on mobile',
    ],
    buttonText: 'Claim Annual Pass',
    buttonLink: '/register',
    isPopular: false,
  },
];

const PricingPlans = () => {
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
            Flexible Memberships
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm sm:text-base text-[#667085] dark:text-gray-400">
            Choose the learning plan that fits your career goals. Cancel or switch anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1, ease: 'easeOut' }}
              whileHover={{ y: plan.isPopular ? -4 : -6 }}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 relative ${
                plan.isPopular
                  ? 'bg-white dark:bg-[#18202C] border-2 border-[#128F80] shadow-card-hover scale-105 z-10'
                  : 'bg-white dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-card'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#F45B48] text-white text-xs font-heading font-bold shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-heading font-bold text-xl text-[#151B24] dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 min-h-[36px]">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-heading font-black text-4xl text-[#151B24] dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">/{plan.period}</span>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    What's included:
                  </p>
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-4 h-4 rounded-full bg-[#128F80]/10 text-[#128F80] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to={plan.buttonLink}
                className={`w-full py-3.5 px-6 rounded-xl font-heading font-semibold text-sm text-center transition-all active:scale-95 shadow-sm ${
                  plan.isPopular
                    ? 'bg-[#128F80] hover:bg-[#087568] text-white shadow-card'
                    : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-[#151B24] dark:text-white'
                }`}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;

