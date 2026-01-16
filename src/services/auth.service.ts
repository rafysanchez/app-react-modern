import apiClient from './api/apiClient';
import { AuthToken, User } from '../types/auth.types';

const login = async (email: string, password: string): Promise<{ user: User, token: AuthToken }> => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  const { accessToken, refreshToken, expiresIn, user } = data;
  const token = { accessToken, refreshToken, expiresIn };
  localStorage.setItem('token', JSON.stringify(token));
  localStorage.setItem('user', JSON.stringify(user));
  return { user, token };
};

const logout = async (): Promise<void> => {
  // In a real app, you'd want to invalidate the token on the server
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const tokenString = localStorage.getItem('token');
        if (!tokenString) return null;

        const token: AuthToken = JSON.parse(tokenString);
        const { data } = await apiClient.post('/auth/refresh', { refreshToken: token.refreshToken });
        const newAccessToken = data.accessToken;
        
        const newToken = { ...token, accessToken: newAccessToken };
        localStorage.setItem('token', JSON.stringify(newToken));
        
        return newAccessToken;
    } catch (error) {
        console.error('Failed to refresh access token', error);
        logout();
        return null;
    }
};


const getAccessToken = (): string | null => {
  const tokenString = localStorage.getItem('token');
  if (!tokenString) return null;
  const token: AuthToken = JSON.parse(tokenString);
  return token.accessToken;
};

const getRefreshToken = (): string | null => {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) return null;
    const token: AuthToken = JSON.parse(tokenString);
    return token.refreshToken;
}

const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};

const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  return JSON.parse(userString);
};

export const authService = {
  login,
  logout,
  refreshAccessToken,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  getCurrentUser,
};
