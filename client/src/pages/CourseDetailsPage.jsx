import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  PlayCircle,
  Lock,
  Users,
  Send,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CourseDetailsPage = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  // Accordion state
  const [expandedModules, setExpandedModules] = useState({});

  // Video Preview Modal state
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    title: '',
    videoUrl: '',
  });

  // Access Request Modal state
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestReason, setRequestReason] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Review form state
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewInput, setReviewInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/courses/${slug}`);
        if (res.data?.success) {
          setCourse(res.data.course);
          const curr = res.data.curriculum || [];
          setCurriculum(curr);
          setReviews(res.data.reviews || []);
          setRelatedCourses(res.data.relatedCourses || []);

          // Open all modules by default
          const expState = {};
          curr.forEach((m) => {
            expState[m._id] = true;
          });
          setExpandedModules(expState);

          if (isAuthenticated && res.data.course?._id) {
            // Check enrollment status
            const enrollRes = await api.get(`/enrollments/course/${res.data.course._id}`);
            if (enrollRes.data?.isEnrolled) {
              setIsEnrolled(true);
            }

            // Check if has pending request
            const reqRes = await api.get('/course-requests/my-requests');
            if (reqRes.data?.success) {
              const pending = reqRes.data.requests.some(
                (r) => r.course?._id === res.data.course._id && r.status === 'pending'
              );
              setHasPendingRequest(pending);
            }

            // Check wishlist status
            try {
              const wishRes = await api.get('/wishlist');
              if (wishRes.data?.success && Array.isArray(wishRes.data.wishlist)) {
                const inWish = wishRes.data.wishlist.some(
                  (c) => (c._id || c) === res.data.course._id
                );
                setIsWishlisted(inWish);
              }
            } catch (wErr) {
              console.log('Wishlist fetch error:', wErr);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [slug, isAuthenticated]);

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const toggleAllModules = (expand) => {
    const nextState = {};
    curriculum.forEach((m) => {
      nextState[m._id] = expand;
    });
    setExpandedModules(nextState);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast('Please login to save to your wishlist.', { icon: '🔒' });
      navigate('/login');
      return;
    }

    setTogglingWishlist(true);
    try {
      const res = await api.post(`/wishlist/${course._id}`);
      if (res.data?.success) {
        setIsWishlisted(res.data.inWishlist);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Could not update wishlist.');
    } finally {
      setTogglingWishlist(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Course link copied to clipboard!');
    } else {
      toast.success('Share this link: ' + window.location.href);
    }
  };

  const handleEnrollFree = async () => {
    if (!isAuthenticated) {
      toast('Please login to enroll in this course.', { icon: '🔒' });
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/enrollments/free/${course._id}`);
      if (res.data?.success) {
        toast.success('Successfully enrolled in this course!');
        setIsEnrolled(true);
        navigate(`/learn/${course._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not enroll.');
    }
  };

  const handleRequestAccessSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmittingRequest(true);
    try {
      const res = await api.post('/course-requests', {
        courseId: course._id,
        reason: requestReason,
      });
      if (res.data?.success) {
        toast.success(res.data.message);
        setHasPendingRequest(true);
        setRequestModalOpen(false);
        setRequestReason('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewInput.trim()) {
      toast.error('Please write a short review.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/reviews/${course._id}`, {
        rating: ratingInput,
        reviewText: reviewInput,
      });
      if (res.data?.success) {
        toast.success(res.data.message);
        setReviews([res.data.review, ...reviews]);
        setReviewInput('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#F5F7FA] dark:bg-[#0F1319]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#128F80] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Loading course syllabus...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-36 text-center bg-[#F5F7FA] dark:bg-[#0F1319]">
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <Link to="/courses" className="mt-4 inline-block text-[#128F80] underline">
          Return to course catalog
        </Link>
      </div>
    );
  }

  const totalLessons = curriculum.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);
  const allExpanded = curriculum.every((m) => expandedModules[m._id]);

  return (
    <div className="pt-28 pb-20 bg-[#F5F7FA] dark:bg-[#0F1319] min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-soft mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md"
                  style={{
                    backgroundColor: `${course.category?.color || '#128F80'}15`,
                    color: course.category?.color || '#128F80',
                  }}
                >
                  {course.category?.name || 'General Tech'}
                </span>
                <span className="px-3 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {course.level}
                </span>
                <span className="px-3 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {course.language}
                </span>
              </div>

              <h1 className="font-heading font-black text-2xl sm:text-4xl text-[#151B24] dark:text-white leading-tight mb-4">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-[#667085] dark:text-gray-300 leading-relaxed mb-6">
                {course.subtitle || course.description}
              </p>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{course.averageRating}</span>
                  <span className="text-gray-400 font-normal">({course.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#128F80]" />
                  <span>{course.enrolledCount} enrolled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#128F80]" />
                  <span>{course.durationHours} total hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#128F80]" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <img
                  src={course.instructor?.avatar}
                  alt={course.instructor?.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#128F80]"
                />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Course Instructor</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{course.instructor?.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-sm">{course.instructor?.headline}</p>
                </div>
              </div>
            </div>

            {/* Right Action / Pricing Card */}
            <div className="lg:col-span-4 bg-[#F5F7FA] dark:bg-[#0F1319] p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800">
              {/* Interactive Video Preview Thumbnail */}
              <div
                onClick={() =>
                  setPreviewModal({
                    isOpen: true,
                    title: `${course.title} — Official Preview`,
                    videoUrl: course.previewVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                  })
                }
                role="button"
                tabIndex={0}
                aria-label="Watch course video preview"
                className="aspect-video rounded-xl overflow-hidden mb-6 relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#128F80]"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 flex flex-col items-center justify-center transition-colors">
                  <div className="w-14 h-14 rounded-full bg-[#F45B48] text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform">
                    <PlayCircle className="w-7 h-7" />
                  </div>
                  <span className="mt-2 text-[11px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    Watch Free Trailer
                  </span>
                </div>
              </div>

              {/* Price & Action Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  {course.isFree ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-heading font-black text-[#16A36A]">Free</span>
                      <span className="text-xs text-gray-500">Instant Access</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-heading font-black text-[#151B24] dark:text-white">
                        ${course.discountPrice || course.price}
                      </span>
                      {course.discountPrice > 0 && (
                        <span className="text-sm text-gray-400 line-through">${course.price}</span>
                      )}
                      <span className="text-xs font-bold text-[#F45B48] ml-2">
                        Save {Math.round((1 - (course.discountPrice / course.price)) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Wishlist & Share buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWishlistToggle}
                    disabled={togglingWishlist}
                    aria-label="Wishlist course"
                    title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-[#F45B48] transition-all hover:scale-105 active:scale-95"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? 'fill-[#F45B48] text-[#F45B48]' : 'currentColor'
                      }`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    aria-label="Share course link"
                    title="Share Course"
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-[#128F80] transition-all hover:scale-105 active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action buttons based on status */}
              <div className="space-y-3">
                {isEnrolled ? (
                  <Link
                    to={`/learn/${course._id}`}
                    className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm text-center bg-[#128F80] hover:bg-[#087568] text-white flex items-center justify-center gap-2 shadow-card"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : course.isFree ? (
                  <button
                    onClick={handleEnrollFree}
                    className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm bg-[#128F80] hover:bg-[#087568] text-white transition-all shadow-card"
                  >
                    Enroll Now — Free
                  </button>
                ) : (
                  <>
                    <Link
                      to={`/checkout/${course._id}`}
                      className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm text-center bg-[#128F80] hover:bg-[#087568] text-white flex items-center justify-center gap-2 shadow-card"
                    >
                      <span>Buy Now & Start Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {hasPendingRequest ? (
                      <div className="w-full py-3 px-4 rounded-xl text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 text-center border border-amber-200">
                        ⏳ Access request pending instructor review
                      </div>
                    ) : (
                      <button
                        onClick={() => setRequestModalOpen(true)}
                        className="w-full py-3 px-4 rounded-xl font-heading font-semibold text-xs border border-gray-300 dark:border-gray-700 hover:border-[#128F80] text-gray-700 dark:text-gray-200 hover:text-[#128F80] transition-all"
                      >
                        Request Access / Scholarship
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/60 dark:border-gray-800 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#128F80]" />
                  <span>Full lifetime access to materials</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#128F80]" />
                  <span>Verifiable Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#128F80]" />
                  <span>Direct instructor & peer discussion room</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Curriculum & Objectives Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Objectives & Curriculum */}
          <div className="lg:col-span-8 space-y-8">
            {/* Learning Objectives */}
            {course.learningObjectives?.length > 0 && (
              <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
                <h3 className="font-heading font-bold text-xl text-[#151B24] dark:text-white mb-4">
                  What You Will Master in This Course
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-[#128F80] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Syllabus / Curriculum with Accordion */}
            <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#151B24] dark:text-white">
                    Course Curriculum
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {curriculum.length} modules • {totalLessons} lessons • {course.durationHours}h total length
                  </p>
                </div>

                {curriculum.length > 0 && (
                  <button
                    onClick={() => toggleAllModules(!allExpanded)}
                    className="text-xs font-semibold text-[#128F80] hover:underline px-3 py-1.5 rounded-lg bg-[#128F80]/10 hover:bg-[#128F80]/20 transition-colors"
                  >
                    {allExpanded ? 'Collapse All' : 'Expand All'}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {curriculum.map((mod, mIdx) => {
                  const isExpanded = !!expandedModules[mod._id];
                  return (
                    <div
                      key={mod._id}
                      className="border border-gray-200/80 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 transition-all shadow-sm"
                    >
                      {/* Module Accordion Header */}
                      <button
                        onClick={() => toggleModule(mod._id)}
                        className="w-full px-5 py-4 bg-gray-50/80 dark:bg-slate-800/70 hover:bg-gray-100/80 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[#128F80]/10 text-[#128F80] font-bold text-xs flex items-center justify-center shrink-0">
                            {mIdx + 1}
                          </span>
                          <span className="font-heading font-bold text-sm text-[#151B24] dark:text-white">
                            {mod.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 font-medium">
                            {mod.lessons?.length || 0} lessons
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180 text-[#128F80]' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Module Lessons (Expandable) */}
                      {isExpanded && (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800/60 bg-white dark:bg-slate-900/30">
                          {mod.lessons?.map((lesson) => (
                            <div
                              key={lesson._id}
                              className="px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {isEnrolled || lesson.isFreePreview ? (
                                  <PlayCircle className="w-4 h-4 text-[#128F80] shrink-0" />
                                ) : (
                                  <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                                )}
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {lesson.isFreePreview && (
                                  <button
                                    onClick={() =>
                                      setPreviewModal({
                                        isOpen: true,
                                        title: lesson.title,
                                        videoUrl:
                                          lesson.videoUrl ||
                                          course.previewVideoUrl ||
                                          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                                      })
                                    }
                                    className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#128F80]/15 text-[#128F80] hover:bg-[#128F80] hover:text-white transition-all shadow-xs"
                                  >
                                    Preview
                                  </button>
                                )}
                                <span className="text-xs text-gray-400">{lesson.durationMinutes}m</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Reviews & Feedback */}
            <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
              <h3 className="font-heading font-bold text-xl text-[#151B24] dark:text-white mb-6">
                Student Feedback & Ratings
              </h3>

              {/* Add review form if enrolled */}
              {isEnrolled && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="mb-8 p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200/60 dark:border-gray-800"
                >
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Leave your review</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRatingInput(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= ratingInput
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={reviewInput}
                    onChange={(e) => setReviewInput(e.target.value)}
                    placeholder="Share what you learned or your thoughts on the course..."
                    className="w-full p-3 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80] mb-3"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              rev.student?.avatar ||
                              'https://images.unsplash.com/photo-1535713875002?auto=format&fit=crop&w=100&q=80'
                            }
                            alt={rev.student?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {rev.student?.name || 'Verified Learner'}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {rev.reviewText}
                      </p>

                      {/* Instructor reply */}
                      {rev.instructorReply?.replyText && (
                        <div className="mt-3 pl-3 border-l-2 border-[#128F80] text-xs text-gray-500 dark:text-gray-400 pt-1">
                          <span className="font-bold text-[#128F80] block mb-0.5">Instructor Response:</span>
                          {rev.instructorReply.replyText}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 py-3 text-center">
                    No reviews yet. Be the first to share your learning experience!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Instructor Profile & Related Courses */}
          <div className="lg:col-span-4 space-y-8">
            {/* Instructor Bio Box */}
            <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft">
              <h4 className="font-heading font-bold text-base text-[#151B24] dark:text-white mb-4">
                About the Mentor
              </h4>
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={course.instructor?.avatar}
                  alt={course.instructor?.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#128F80]"
                />
                <div>
                  <h5 className="font-heading font-bold text-sm text-[#151B24] dark:text-white">
                    {course.instructor?.name}
                  </h5>
                  <p className="text-xs text-[#667085] dark:text-gray-400">
                    {course.instructor?.headline}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {course.instructor?.bio ||
                  'Passionate industry veteran committed to teaching production-level software design and full-stack engineering.'}
              </p>
            </div>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <div className="bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft">
                <h4 className="font-heading font-bold text-base text-[#151B24] dark:text-white mb-4">
                  Related Masterclasses
                </h4>
                <div className="space-y-4">
                  {relatedCourses.map((rel) => (
                    <Link
                      key={rel._id}
                      to={`/courses/${rel.slug}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <img
                        src={rel.thumbnail}
                        alt={rel.title}
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <h6 className="font-heading font-bold text-xs text-gray-900 dark:text-white truncate group-hover:text-[#128F80]">
                          {rel.title}
                        </h6>
                        <span className="text-[11px] text-[#128F80] font-bold">
                          {rel.isFree ? 'Free' : `$${rel.price}`}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white dark:bg-[#18202C] rounded-3xl max-w-3xl w-full overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl relative"
            >
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-[#128F80]" />
                  <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    {previewModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewModal({ isOpen: false, title: '', videoUrl: '' })}
                  className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video bg-black flex items-center justify-center">
                <video
                  key={previewModal.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  poster={course.thumbnail}
                >
                  <source src={previewModal.videoUrl} type="video/mp4" />
                  Your browser does not support HTML5 video preview.
                </video>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-900 flex items-center justify-between text-xs text-gray-500">
                <span>Previewing course content • LearnEase Pro</span>
                <button
                  onClick={() => setPreviewModal({ isOpen: false, title: '', videoUrl: '' })}
                  className="px-4 py-1.5 rounded-lg font-semibold bg-[#128F80] text-white hover:bg-[#087568] transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Access Request Modal */}
      <AnimatePresence>
        {requestModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white dark:bg-[#18202C] rounded-3xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 shadow-2xl"
            >
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-2">
                Request Course Access
              </h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Submit your reason to the course instructor. Upon approval, you will gain full access to all lectures, resources, and live sessions.
              </p>
              <form onSubmit={handleRequestAccessSubmit}>
                <textarea
                  rows={4}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Explain why you want to take this course or your learning goals..."
                  className="w-full p-3 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80] mb-4"
                  required
                />
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingRequest}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-[#128F80] text-white hover:bg-[#087568] transition-all cursor-pointer"
                  >
                    {submittingRequest ? 'Sending...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseDetailsPage;
