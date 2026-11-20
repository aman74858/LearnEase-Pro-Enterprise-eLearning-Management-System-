import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import CourseCard from '../../components/common/CourseCard';
import toast from 'react-hot-toast';

const StudentWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/wishlist')
      .then((res) => {
        if (res.data?.success) setWishlist(res.data.wishlist || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleRemoveFromWishlist = (courseId) => {
    setWishlist((prev) => prev.filter((c) => c._id !== courseId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#128F80] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white mb-1">
          Saved Wishlist
        </h1>
        <p className="text-xs text-gray-500">
          Courses and workshops you've bookmarked for future learning.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white dark:bg-[#18202C] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-soft">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-1">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Click the heart icon on any course card to bookmark it here.
          </p>
          <Link
            to="/courses"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#128F80] text-white hover:bg-[#087568] transition-all"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isWishlisted={true}
              onWishlistToggle={handleRemoveFromWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentWishlist;

