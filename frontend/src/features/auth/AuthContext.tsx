import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthResponse } from './types';
import apiClient from '../../lib/axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('pawfectly_token');
      const savedUser = localStorage.getItem('pawfectly_user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          // Verify with backend /api/auth/me
          const response = await apiClient.get<User>('/auth/me');
          if (response.data) {
            setUser(response.data);
            localStorage.setItem('pawfectly_user', JSON.stringify(response.data));
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('pawfectly_token');
          localStorage.removeItem('pawfectly_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('pawfectly_token');
      localStorage.removeItem('pawfectly_user');
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = React.useCallback((authData: AuthResponse) => {
    const userData: User = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      phone: authData.phone,
    };

    setToken(authData.token);
    setUser(userData);
    localStorage.setItem('pawfectly_token', authData.token);
    localStorage.setItem('pawfectly_user', JSON.stringify(userData));
  }, []);

  const logout = React.useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pawfectly_token');
    localStorage.removeItem('pawfectly_user');
  }, []);

  const updateUser = React.useCallback((updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('pawfectly_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const authValue = React.useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, token, isLoading, login, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
