import React, { useState, useEffect } from 'react';
import { FileQuestion, CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AccessRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/course-requests', {
        params: filter !== 'all' ? { status: filter } : {},
      });
      if (res.data?.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleUpdateStatus = async (requestId, status) => {
    try {
      const res = await api.put(`/course-requests/${requestId}/status`, {
        status,
        adminNote: status === 'approved' ? 'Request approved by instructor. Welcome!' : 'Declined at this time.',
      });

      if (res.data?.success) {
        toast.success(res.data.message);
        fetchRequests();
      }
    } catch (err) {
      toast.error('Failed to update request.');
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
            Student Access Requests
          </h1>
          <p className="text-xs text-gray-500">
            Review student scholarship applications and course access inquiries. Approving grants instant curriculum access.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === st
                  ? 'bg-[#128F80] text-white shadow-sm'
                  : 'bg-white dark:bg-[#18202C] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white dark:bg-[#18202C] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-soft">
          <FileQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-1">
            No access requests found
          </h3>
          <p className="text-xs text-gray-500">
            When students submit access inquiries for your courses, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={r.student?.avatar}
                  alt={r.student?.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#128F80]/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
                      {r.student?.name}
                    </h4>
                    <span className="text-[11px] text-gray-400">({r.student?.email})</span>
                  </div>
                  <p className="text-xs font-semibold text-[#128F80] mt-0.5">
                    Course: {r.course?.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic mt-2 bg-gray-50 dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                    "{r.reason}"
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    Requested on: {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                {r.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(r._id, 'approved')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#16A36A] hover:bg-[#128F80] text-white transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Access</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(r._id, 'rejected')}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-rose-300 text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      r.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}
                  >
                    {r.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessRequests;

