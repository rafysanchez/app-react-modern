import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { authService } from '../../services/auth.service';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = () => {
  const { isAuthenticated, loading, setUser } = useAuth();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
        setUser(user)
    }
  }, [setUser]);

  if (loading) {
    return <LoadingSpinner label="Loading..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
