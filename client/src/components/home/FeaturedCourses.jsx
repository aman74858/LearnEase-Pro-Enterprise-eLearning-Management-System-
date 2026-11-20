import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CourseCard from '../common/CourseCard';
import api from '../../services/api';
import { ArrowRight, Sparkles } from 'lucide-react';

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/featured')
      .then((res) => {
        if (res.data?.success) {
          setCourses(res.data.courses);
        }
      })
      .catch((err) => console.error('Error fetching featured courses:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-[#151B24] transition-colors overflow-hidden">
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F45B48] tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F45B48]" />
              Handpicked Programs
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] dark:text-white">
              Featured Online Masterclasses
            </h2>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#128F80] hover:text-[#087568] group transition-colors"
          >
            <span>View All {courses.length ? `${courses.length}+` : ''} Courses</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl bg-gray-100 dark:bg-gray-800 h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: Math.min(idx * 0.08, 0.4), ease: 'easeOut' }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;

