import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Se verifică sesiunea...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
