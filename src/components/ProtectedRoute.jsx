import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    // Save the attempted URL so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;