import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen pt-36 pb-20 flex items-center justify-center bg-[#F5F7FA] dark:bg-[#0F1319] text-center px-4">
      <div className="max-w-md mx-auto">
        <span className="font-heading font-black text-8xl text-[#128F80] block mb-2">404</span>
        <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-xs text-gray-500 mb-6">
          The requested path does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-[#128F80] text-white hover:bg-[#087568] transition-all shadow-card"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

