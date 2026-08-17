import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-muted)' }}>Loading Teerop POS...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to default screen based on actual user role
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'inventory_manager') return <Navigate to="/inventory" replace />;
    if (user.role === 'cashier') return <Navigate to="/pos" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};
