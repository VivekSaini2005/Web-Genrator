import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  // Show a blank/loading screen while checking context state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div>
      </div>
    );
  }

  // If there's no auth token, bump the visitor back to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token is present, render the protected component(s)
  return <Outlet />;
};

export default ProtectedRoute;
