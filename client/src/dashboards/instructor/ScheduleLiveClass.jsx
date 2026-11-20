import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Clock, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ScheduleLiveClass = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/courses/instructor/my-courses')
      .then((res) => {
        if (res.data?.success && res.data.courses.length > 0) {
          setCourses(res.data.courses);
          setCourseId(res.data.courses[0]._id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !courseId || !scheduledAt) {
      toast.error('Please fill in title, course, and scheduled time.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/live-classes', {
        title,
        courseId,
        description,
        scheduledAt,
        durationMinutes: Number(durationMinutes),
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Live class scheduled successfully!');
        navigate('/live-classes');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule live class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white mb-1">
          Schedule Live Masterclass
        </h1>
        <p className="text-xs text-gray-500">
          Set up an interactive live video classroom. Enrolled students will receive session alerts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Associated Course *
          </label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
            required
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Class Title / Topic *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Live Architecture Q&A: Optimizing MongoDB Queries & React SSR"
            className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Scheduled Date & Time *
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Session Duration (Minutes)
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Session Agenda & Instructions
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should students prepare beforehand? (e.g. bring repository links, microphone)..."
            className="w-full p-4 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm bg-[#128F80] hover:bg-[#087568] text-white shadow-card transition-all active:scale-95"
        >
          {loading ? 'Creating Meeting Room...' : 'Schedule Live Masterclass'}
        </button>
      </form>
    </div>
  );
};

export default ScheduleLiveClass;

