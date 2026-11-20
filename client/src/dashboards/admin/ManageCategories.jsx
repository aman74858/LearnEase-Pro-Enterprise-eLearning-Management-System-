import React, { useState, useEffect } from 'react';
import { Layers, PlusCircle, Trash2, Edit } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New category form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Code');
  const [color, setColor] = useState('#128F80');
  const [creating, setCreating] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data?.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const res = await api.post('/categories', { name, description, icon, color });
      if (res.data?.success) {
        toast.success(res.data.message);
        setName('');
        setDescription('');
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data?.success) {
        toast.success(res.data.message);
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete category.');
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
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white mb-1">
          Categories & Subject Taxonomy
        </h1>
        <p className="text-xs text-gray-500">
          Create and organize technical domain tags used across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Category Form */}
        <div className="lg:col-span-5 bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft">
          <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-4">
            Add New Category
          </h3>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Blockchain & Web3"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short domain summary..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Lucide Icon Name
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Code, Cpu, Cloud..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Brand Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-500">{color}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 rounded-xl font-bold text-xs bg-[#128F80] hover:bg-[#087568] text-white transition-all shadow-card"
            >
              {creating ? 'Creating...' : 'Save Category'}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-7 bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft">
          <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-4">
            Existing Categories ({categories.length})
          </h3>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {categories.map((cat) => (
              <div key={cat._id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    {cat.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                      {cat.name}
                    </h5>
                    <p className="text-[11px] text-gray-400">
                      Slug: {cat.slug} • {cat.courseCount || 0} courses
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;

