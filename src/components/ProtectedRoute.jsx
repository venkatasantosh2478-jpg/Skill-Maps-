import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({ 
  fallback = <DefaultFallback />, 
  unauthenticatedElement = <Navigate to="/login" replace />,
  requireAdmin = false 
}) {
  const { 
    isAuthenticated, 
    isLoadingAuth, 
    authChecked = true, 
    authError, 
    checkUserAuth, 
    isAdmin, 
    user 
  } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth && typeof checkUserAuth === 'function') {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return unauthenticatedElement;
  }

  if (!isAuthenticated || !user) {
    return unauthenticatedElement;
  }

  if (requireAdmin && !isAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

