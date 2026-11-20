import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Check, Sparkles } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CourseBuilder = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('All Levels');
  const [price, setPrice] = useState(49);
  const [discountPrice, setDiscountPrice] = useState(29);
  const [isFree, setIsFree] = useState(false);
  const [durationHours, setDurationHours] = useState(20);
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80');
  const [previewVideoUrl, setPreviewVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [learningObjectives, setLearningObjectives] = useState('Master core architecture\nBuild production projects\nDeploy to cloud');
  const [requirements, setRequirements] = useState('Basic computer literacy');

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.data?.success && res.data.categories.length > 0) {
          setCategories(res.data.categories);
          setCategory(res.data.categories[0]._id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) {
      toast.error('Please complete title, category, and description.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        subtitle,
        description,
        category,
        level,
        price: isFree ? 0 : Number(price),
        discountPrice: isFree ? 0 : Number(discountPrice),
        isFree,
        durationHours: Number(durationHours),
        thumbnail,
        previewVideoUrl,
        learningObjectives: learningObjectives.split('\n').filter((s) => s.trim()),
        requirements: requirements.split('\n').filter((s) => s.trim()),
      };

      const res = await api.post('/courses', payload);
      if (res.data?.success) {
        toast.success(res.data.message || 'Course published successfully!');
        navigate('/dashboard/instructor/courses');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white">
            Create New Masterclass
          </h1>
          <p className="text-xs text-gray-500">
            Publish a new comprehensive curriculum to the LearnEase Pro catalog.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-soft space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Course Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Master Full-Stack Next.js 15 & PostgreSQL"
            className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
            required
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Short Subtitle
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="One-line elevator pitch for course cards..."
            className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
          />
        </div>

        {/* Category & Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
              required
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Difficulty Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
            >
              <option value="All Levels">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Pricing row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Regular Price ($)
            </label>
            <input
              type="number"
              disabled={isFree}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Discount Price ($)
            </label>
            <input
              type="number"
              disabled={isFree}
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80] disabled:opacity-50"
            />
          </div>

          <div className="pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="w-4 h-4 text-[#128F80] rounded focus:ring-[#128F80]"
              />
              <span>Offer this course for Free</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Course Detailed Syllabus & Overview *
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what students will learn, projects built, and prerequisites..."
            className="w-full p-4 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
            required
          />
        </div>

        {/* Media URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Thumbnail Image URL
            </label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-xs border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Preview Video URL (MP4 stream)
            </label>
            <input
              type="text"
              value={previewVideoUrl}
              onChange={(e) => setPreviewVideoUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-xs border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
            />
          </div>
        </div>

        {/* Learning Objectives */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Key Learning Objectives (One per line)
          </label>
          <textarea
            rows={3}
            value={learningObjectives}
            onChange={(e) => setLearningObjectives(e.target.value)}
            className="w-full p-4 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-heading font-bold text-sm bg-[#128F80] hover:bg-[#087568] text-white shadow-card transition-all active:scale-95"
        >
          {loading ? 'Publishing Course...' : 'Publish Course to Catalog'}
        </button>
      </form>
    </div>
  );
};

export default CourseBuilder;

