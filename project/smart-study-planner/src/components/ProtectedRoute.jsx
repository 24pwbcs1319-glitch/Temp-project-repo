import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/**
 * Route guard component that checks for an active session.
 * Redirects to the login page if the user is unauthenticated.
 */
export default function ProtectedRoute() {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
