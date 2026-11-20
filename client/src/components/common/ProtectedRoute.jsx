import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] dark:bg-[#0F1319]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#128F80] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to proper role dashboard
    const redirectUrl =
      user.role === 'admin'
        ? '/dashboard/admin'
        : user.role === 'instructor'
        ? '/dashboard/instructor'
        : '/dashboard/student';
    return <Navigate to={redirectUrl} replace />;
  }

  return children;
};

export default ProtectedRoute;

