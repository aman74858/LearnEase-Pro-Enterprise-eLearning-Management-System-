import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, Calendar, Clock, Radio, Users, CheckCircle, ExternalLink } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LiveClassesPage = () => {
  const { user, isAuthenticated, isInstructor } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await api.get('/live-classes', {
          params: filter !== 'all' ? { status: filter } : {},
        });
        if (res.data?.success) {
          setClasses(res.data.liveClasses);
        }
      } catch (err) {
        console.error('Error fetching live classes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [filter]);

  const handleJoinClass = async (liveClass) => {
    if (!isAuthenticated) {
      toast('Please login to join live class', { icon: '🔒' });
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/live-classes/${liveClass._id}/join`);
      if (res.data?.success) {
        toast.success(res.data.message);
        navigate(`/live-room/${liveClass._id}`);
      }
    } catch (err) {
      toast.error('Failed to enter live room.');
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#F5F7FA] dark:bg-[#0F1319] min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F45B48]/10 text-[#F45B48] font-bold text-xs uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Live Interactive Hub
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] dark:text-white">
              Upcoming Live Masterclasses
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
              Join real-time video sessions with top tech mentors. Ask questions live, share your code, and receive direct architecture feedback.
            </p>
          </div>

          {isInstructor && (
            <Link
              to="/dashboard/instructor/schedule-live"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all shadow-card shrink-0"
            >
              <Video className="w-4 h-4" />
              Schedule Live Class
            </Link>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Sessions' },
            { id: 'scheduled', label: 'Upcoming' },
            { id: 'live', label: 'Happening Now' },
            { id: 'completed', label: 'Past Recordings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === item.id
                  ? 'bg-[#128F80] text-white shadow-sm'
                  : 'bg-white dark:bg-[#18202C] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Classes List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="rounded-3xl bg-white dark:bg-[#18202C] h-64 animate-pulse"></div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-white dark:bg-[#18202C] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-soft">
            <Video className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-1">
              No live sessions in this category
            </h3>
            <p className="text-xs text-gray-500">Check back soon or browse our on-demand course library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => {
              const classDate = new Date(cls.scheduledAt);
              return (
                <div
                  key={cls._id}
                  className="bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-[#128F80]/10 text-[#128F80]">
                        {cls.course?.title || 'Interactive Masterclass'}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          cls.status === 'live'
                            ? 'bg-rose-500/10 text-rose-500 animate-pulse'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cls.status === 'live' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                        {cls.status}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {cls.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-6">
                      {cls.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80">
                    <div className="flex items-center justify-between mb-5 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#128F80]" />
                        <span>{classDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#128F80]" />
                        <span>{classDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({cls.durationMinutes}m)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cls.instructor?.avatar}
                          alt={cls.instructor?.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#128F80]"
                        />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {cls.instructor?.name}
                        </span>
                      </div>

                      <button
                        onClick={() => handleJoinClass(cls)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs bg-[#128F80] hover:bg-[#087568] text-white shadow-card active:scale-95 transition-all"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Live Room</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassesPage;
