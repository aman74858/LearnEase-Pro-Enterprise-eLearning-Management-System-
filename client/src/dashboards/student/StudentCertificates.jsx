import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/my-certificates')
      .then((res) => {
        if (res.data?.success) setCertificates(res.data.certificates);
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
          My Verified Certificates
        </h1>
        <p className="text-xs text-gray-500">
          Cryptographically verified certificates earned by completing 100% course curriculum and passing evaluations.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-[#18202C] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-soft">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-2">
            No certificates unlocked yet
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
            Finish all lessons in any course and score 70%+ on the final assessment to unlock your official credential.
          </p>
          <Link
            to="/dashboard/student/my-courses"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#128F80] text-white hover:bg-[#087568] transition-all"
          >
            Continue Enrolled Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-400">
                    {cert.certificateId}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-1">
                  {cert.courseTitle || cert.course?.title}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Instructor: {cert.instructorName || cert.instructor?.name} • Grade: {cert.grade || 'A'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/verify-certificate/${cert.certificateId}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all shadow-sm"
                >
                  <span>View / Print PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;

