import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Guards the admin panel. Redirects anonymous visitors to the homepage (and
 * opens the auth modal), and redirects logged-in non-admin users to their
 * dashboard - only accounts with is_admin=true (e.g. kd8260) can reach the
 * admin panel routes.
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    if (!user) {
      openAuthModal();
    }
  }, [user, openAuthModal]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
