import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const StudentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/course-requests/my-requests')
      .then((res) => {
        if (res.data?.success) setRequests(res.data.requests);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
          My Course Access Requests
        </h1>
        <p className="text-xs text-gray-500">
          Track the status of your scholarship and access requests reviewed by instructors.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white dark:bg-[#18202C] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-soft">
          <FileQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-1">
            No active access requests
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            You can request access directly from any paid course overview page.
          </p>
          <Link
            to="/courses"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#128F80] text-white hover:bg-[#087568] transition-all"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#18202C] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-soft overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {requests.map((req) => (
              <div key={req._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={req.course?.thumbnail}
                    alt={req.course?.title}
                    className="w-16 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
                      {req.course?.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted on: {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 italic mt-1">
                      Reason: "{req.reason}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      req.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : req.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {req.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {req.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                    {req.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                    <span>{req.status}</span>
                  </span>

                  {req.status === 'approved' && (
                    <Link
                      to={`/learn/${req.course?._id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all"
                    >
                      <span>Enter Class</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRequests;

