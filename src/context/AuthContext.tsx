import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, loading, setLoading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
