import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute Wrapper
 * Redirects unauthenticated users to the login page.
 * Authenticated users are allowed to render the nested child routes (Outlet).
 */
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * PublicRoute Wrapper
 * Redirects authenticated users AWAY from login/signup pages to the dashboard.
 */
export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
