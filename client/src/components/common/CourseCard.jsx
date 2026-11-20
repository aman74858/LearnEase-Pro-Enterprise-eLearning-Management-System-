import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CourseCard = ({ course, isWishlisted = false, onWishlistToggle }) => {
  const { isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();
  const [inWishlist, setInWishlist] = useState(isWishlisted);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast('Please login to add to wishlist', { icon: '🔒' });
      navigate('/login');
      return;
    }

    setLoadingWishlist(true);
    try {
      const res = await api.post(`/wishlist/${course._id}`);
      if (res.data?.success) {
        setInWishlist(res.data.inWishlist);
        toast.success(res.data.message);
        if (onWishlistToggle) onWishlistToggle(course._id, res.data.inWishlist);
      }
    } catch (err) {
      toast.error('Could not update wishlist.');
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-white dark:bg-[#18202C] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-card-hover transition-all flex flex-col h-full group"
    >
      {/* Thumbnail Banner */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* Level Tag */}
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-white/90 dark:bg-slate-900/90 text-gray-800 dark:text-gray-200 backdrop-blur-md shadow-sm">
          {course.level || 'All Levels'}
        </span>

        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          onClick={handleWishlist}
          disabled={loadingWishlist}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-gray-600 dark:text-gray-300 hover:text-[#F45B48] transition-colors shadow-sm cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 ${
              inWishlist ? 'fill-[#F45B48] text-[#F45B48]' : 'currentColor'
            }`}
          />
        </motion.button>

        {/* Duration Badge */}
        <span className="absolute bottom-3 right-3 px-2.5 py-1 text-[11px] font-medium rounded-md bg-black/70 text-white backdrop-blur-md flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#128F80]" />
          {course.durationHours || 12}h
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Pill */}
          <div className="flex items-center justify-between mb-2.5">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md"
              style={{
                backgroundColor: `${course.category?.color || '#128F80'}15`,
                color: course.category?.color || '#128F80',
              }}
            >
              {course.category?.name || 'Technology'}
            </span>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.averageRating || 4.9}</span>
              <span className="text-gray-400 dark:text-gray-500 font-normal">
                ({course.reviewCount || 0})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/courses/${course.slug}`}>
            <h3 className="font-heading font-bold text-base text-[#151B24] dark:text-white line-clamp-2 hover:text-[#128F80] dark:hover:text-[#3CBBA7] transition-colors leading-snug mb-2">
              {course.title}
            </h3>
          </Link>

          {/* Subtitle / Short description */}
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {course.subtitle || course.description}
          </p>
        </div>

        {/* Bottom Metadata & Price */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80">
          {/* Instructor row */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <img
                src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={course.instructor?.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                {course.instructor?.name || 'Lead Mentor'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Users className="w-3.5 h-3.5" />
              <span>{course.enrolledCount || 0}</span>
            </div>
          </div>

          {/* Price & Action button */}
          <div className="flex items-center justify-between">
            <div>
              {course.isFree ? (
                <span className="text-base font-heading font-extrabold text-[#16A36A]">
                  Free
                </span>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-heading font-extrabold text-[#151B24] dark:text-white">
                    ${course.discountPrice || course.price}
                  </span>
                  {course.discountPrice > 0 && course.discountPrice < course.price && (
                    <span className="text-xs text-gray-400 line-through">
                      ${course.price}
                    </span>
                  )}
                </div>
              )}
            </div>

            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#128F80]/10 text-[#128F80] dark:bg-[#128F80]/20 dark:text-[#3CBBA7] hover:bg-[#128F80] hover:text-white dark:hover:bg-[#128F80] dark:hover:text-white transition-all group-hover:scale-105 active:scale-95"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;

