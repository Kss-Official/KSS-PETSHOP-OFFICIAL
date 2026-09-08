import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import type { Role } from '../features/auth/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requiredRole?: Role;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredRole,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#3FA65C] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const isTargetAdmin =
      requiredRole === 'ADMIN' || (allowedRoles && allowedRoles.includes('ADMIN') && !allowedRoles.includes('CUSTOMER'));
    const loginPath = isTargetAdmin ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  const effectiveRoles = allowedRoles || (requiredRole ? [requiredRole] : []);
  if (effectiveRoles.length > 0 && user && !effectiveRoles.includes(user.role) && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
