import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, Award, Clock } from 'lucide-react';
import api from '../../services/api';

const EnrolledCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my-courses')
      .then((res) => {
        if (res.data?.success) setEnrollments(res.data.enrollments);
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
          My Enrolled Masterclasses
        </h1>
        <p className="text-xs text-gray-500">
          Track your course completion milestones, watch lectures, and download certificates.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white dark:bg-[#18202C] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-soft">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-2">
            You haven't enrolled in any courses yet
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Browse our catalog and start learning with free or comprehensive masterclasses.
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
          {enrollments.map((enr) => (
            <div
              key={enr._id}
              className="bg-white dark:bg-[#18202C] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <img
                  src={enr.course?.thumbnail}
                  alt={enr.course?.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#128F80]/10 text-[#128F80] mb-2 inline-block">
                    {enr.course?.category?.name || 'Curriculum'}
                  </span>
                  <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white line-clamp-2 mb-2">
                    {enr.course?.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Instructor: {enr.course?.instructor?.name}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-50 dark:border-gray-800/80">
                <div className="my-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                    <span>Progress</span>
                    <span className="font-bold text-[#128F80]">{enr.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#128F80] h-full rounded-full transition-all duration-300"
                      style={{ width: `${enr.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <Link
                    to={`/learn/${enr.course?._id}`}
                    className="flex-1 py-2 px-3 text-center rounded-xl font-heading font-bold text-xs bg-[#128F80] hover:bg-[#087568] text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Go to Classroom</span>
                  </Link>

                  {enr.progressPercentage === 100 && (
                    <Link
                      to="/dashboard/student/certificates"
                      className="p-2 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors"
                      title="View Certificate"
                    >
                      <Award className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;

