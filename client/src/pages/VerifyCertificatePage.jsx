import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, ShieldCheck, Download, Printer, Search, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../services/api';

const VerifyCertificatePage = () => {
  const { certificateId } = useParams();
  const [searchId, setSearchId] = useState(certificateId || 'LEP-CERT-2026-9481');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const certRef = useRef();

  const handleVerify = async (idToQuery) => {
    if (!idToQuery) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/certificates/verify/${idToQuery.trim()}`);
      if (res.data?.success) {
        setCertificate(res.data.certificate);
      }
    } catch (err) {
      setError('Certificate ID not found or invalid.');
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      handleVerify(certificateId);
    } else {
      handleVerify('LEP-CERT-2026-9481');
    }
  }, [certificateId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-28 pb-20 bg-[#F5F7FA] dark:bg-[#0F1319] min-h-screen transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#128F80]/10 text-[#128F80] font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            Accredited Verification Portal
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 dark:text-white mb-2">
            Verify LearnEase Pro Certificate
          </h1>
          <p className="text-xs text-gray-500">
            Enter any unique student certificate identification code to instantly authenticate completion status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. LEP-CERT-2026-9481"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white uppercase font-bold focus:outline-none focus:border-[#128F80]"
            />
          </div>
          <button
            onClick={() => handleVerify(searchId)}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#128F80] text-white hover:bg-[#087568] transition-all shrink-0"
          >
            Verify Code
          </button>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs text-center border border-rose-200">
            {error}
          </div>
        )}

        {/* Certificate Preview Document (Printable / Downloadable) */}
        {certificate && (
          <div className="space-y-6">
            <div className="flex justify-end gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" />
                Print / Download PDF
              </button>
            </div>

            <div
              ref={certRef}
              className="bg-white rounded-3xl p-8 sm:p-14 border-8 border-double border-[#128F80]/30 shadow-2xl relative overflow-hidden text-center text-[#151B24]"
            >
              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#128F80]"></div>
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#128F80]"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#128F80]"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#128F80]"></div>

              {/* Top Seal */}
              <div className="w-16 h-16 rounded-full bg-[#128F80]/10 text-[#128F80] mx-auto flex items-center justify-center mb-6">
                <Award className="w-9 h-9" />
              </div>

              <span className="text-xs font-heading font-black uppercase tracking-[0.25em] text-[#F45B48] mb-2 block">
                Certificate of Completion
              </span>

              <p className="text-xs text-gray-500 mb-6 italic">This is proudly presented to</p>

              <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#151B24] underline decoration-[#128F80] decoration-2 underline-offset-8 mb-6">
                {certificate.studentName || certificate.student?.name}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed mb-6">
                for successfully completing all curriculum requirements, coding laboratories, assignments, and practical knowledge evaluations for
              </p>

              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#128F80] mb-8">
                {certificate.courseTitle || certificate.course?.title}
              </h3>

              {/* Signatures & Seal Row */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200/80 max-w-lg mx-auto text-left text-xs">
                <div>
                  <div className="font-heading font-bold text-sm text-gray-900 border-b border-gray-400 pb-1 mb-1 italic font-serif">
                    {certificate.instructorName || certificate.instructor?.name || 'Lead Instructor'}
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Course Instructor</span>
                </div>

                <div className="text-right">
                  <div className="font-heading font-bold text-sm text-gray-900 border-b border-gray-400 pb-1 mb-1">
                    {new Date(certificate.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Date Issued</span>
                </div>
              </div>

              {/* Footer Verification Code */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400">
                <span>LearnEase Pro Online Learning Academy</span>
                <span className="font-mono font-bold text-gray-700">ID: {certificate.certificateId}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyCertificatePage;
