import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code,
  BarChart2,
  Cpu,
  GitBranch,
  Terminal,
  FileCode,
  Layout,
  Cloud,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';

const iconMap = {
  Code,
  BarChart2,
  Cpu,
  GitBranch,
  Terminal,
  FileCode,
  Layout,
  Cloud,
  ShieldCheck,
  TrendingUp,
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.data?.success) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => console.error('Failed to load categories:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-[#F5F7FA] dark:bg-[#0F1319] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#128F80] tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-[#128F80]"></span>
              Explore Paths
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] dark:text-white">
              Popular Course Categories
            </h2>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#128F80] hover:text-[#087568] group transition-colors"
          >
            <span>Browse All Courses</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat, idx) => {
            const IconComponent = iconMap[cat.icon] || Code;
            return (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.35), ease: 'easeOut' }}
                whileHover={{ y: -5 }}
              >
                <Link
                  to={`/courses?category=${cat.slug}`}
                  className="group p-6 rounded-2xl bg-white dark:bg-[#18202C] border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between h-full"
                >
                  <div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${cat.color || '#128F80'}15`,
                        color: cat.color || '#128F80',
                      }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-[#151B24] dark:text-white group-hover:text-[#128F80] dark:group-hover:text-[#3CBBA7] transition-colors mb-1.5">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#667085] dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>{cat.courseCount || 1} available courses</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#128F80] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

