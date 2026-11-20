import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../components/common/CourseCard';
import api from '../services/api';
import { Search, Filter, SlidersHorizontal, BookOpen, X } from 'lucide-react';

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [level, setLevel] = useState(searchParams.get('level') || 'all');
  const [priceType, setPriceType] = useState(searchParams.get('priceType') || 'all');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Load categories
    api.get('/categories')
      .then((res) => {
        if (res.data?.success) setCategories(res.data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        sort,
      };
      if (search) params.search = search;
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (level && level !== 'all') params.level = level;
      if (priceType && priceType !== 'all') params.priceType = priceType;

      const res = await api.get('/courses', { params });
      if (res.data?.success) {
        setCourses(res.data.courses);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, level, priceType, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setLevel('all');
    setPriceType('all');
    setSort('popular');
    setPage(1);
  };

  return (
    <div className="pt-28 pb-20 bg-[#F5F7FA] dark:bg-[#0F1319] min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] dark:text-white mb-3">
            Explore All Masterclasses
          </h1>
          <p className="text-sm text-[#667085] dark:text-gray-400">
            Learn with production-ready curriculum taught by verified tech leaders. Filter by level, price, and topic.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-white dark:bg-[#18202C] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search JavaScript, React, AI, AWS..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 py-2 px-3 focus:outline-none focus:border-[#128F80]"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Sidebar + Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white dark:bg-[#18202C] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-heading font-bold text-base text-[#151B24] dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#128F80]" />
                  Filter Courses
                </h3>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#F45B48] hover:underline font-semibold"
                >
                  Reset All
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Category
                </label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => { setSelectedCategory('all'); setPage(1); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-[#128F80] text-white font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => { setSelectedCategory(c.slug); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === c.slug
                          ? 'bg-[#128F80] text-white font-semibold'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] opacity-70">({c.courseCount || 0})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Difficulty Level
                </label>
                <div className="space-y-1.5">
                  {['all', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => { setLevel(lvl); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        level === lvl
                          ? 'bg-[#128F80] text-white font-semibold'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {lvl === 'all' ? 'All Difficulties' : lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Tuition
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'free', label: 'Free' },
                    { id: 'paid', label: 'Paid' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setPriceType(p.id); setPage(1); }}
                      className={`py-1.5 text-center rounded-lg text-xs font-medium transition-colors ${
                        priceType === p.id
                          ? 'bg-[#128F80] text-white font-semibold'
                          : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
              <span>Showing {courses.length} of {total} courses</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="rounded-2xl bg-white dark:bg-[#18202C] h-80 animate-pulse border border-gray-100 dark:border-gray-800"></div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white dark:bg-[#18202C] rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-soft">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-2">
                  No courses match your filters
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                  Try adjusting your search keywords, difficulty level, or select another category.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-[#128F80] text-white hover:bg-[#087568] transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => {
                          setPage(i + 1);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 rounded-xl font-heading font-bold text-sm transition-all ${
                          page === i + 1
                            ? 'bg-[#128F80] text-white shadow-card'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
