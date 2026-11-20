import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses/instructor/my-courses');
      if (res.data?.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and all its modules/lessons?')) return;

    try {
      const res = await api.delete(`/courses/${courseId}`);
      if (res.data?.success) {
        toast.success(res.data.message);
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
      }
    } catch (err) {
      toast.error('Failed to delete course.');
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white mb-1">
            My Courses & Curricula
          </h1>
          <p className="text-xs text-gray-500">
            Publish, edit syllabus, manage video lectures, and monitor student numbers.
          </p>
        </div>

        <Link
          to="/dashboard/instructor/new-course"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all shadow-card"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Course</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-[#18202C] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-900/60 uppercase font-bold text-gray-400 border-b border-gray-100 dark:border-gray-800 tracking-wider">
              <tr>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Tuition</th>
                <th className="px-6 py-4">Enrolled</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {courses.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-12 h-9 rounded-lg object-cover"
                      />
                      <div className="max-w-xs">
                        <h4 className="font-heading font-bold text-gray-900 dark:text-white truncate">
                          {c.title}
                        </h4>
                        <span className="text-[10px] text-gray-400">{c.level}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                    {c.category?.name || 'Tech'}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#128F80]">
                    {c.isFree ? 'Free' : `$${c.discountPrice || c.price}`}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {c.enrolledCount || 0} students
                  </td>
                  <td className="px-6 py-4 font-bold text-amber-500">
                    ★ {c.averageRating || 5.0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/courses/${c.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#128F80] hover:bg-gray-100 dark:hover:bg-slate-800"
                        title="View Course"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;

