import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from '@/shared/hooks/use-toast';
import { apiClient, ApiRequestError } from '@/shared/lib/apiClient';
import { isValidToken, getUserIdFromToken } from '@/shared/lib/tokenUtils';
import type { User, AuthResponse } from '@/shared/types';
type RegisterRequestBody = {
  email: string;
  password: string;
  fullName?: string;
  username?: string;
  phone?: string;
};

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
    username?: string,
    phone?: string
  ) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async (authToken: string): Promise<User | null> => {
    try {
      // Try to get user data from /api/auth/me endpoint
      const userData = await apiClient.get<User>('/api/auth/me', { token: authToken });
      return userData;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);

      // Fallback: create basic user object from token
      const userId = getUserIdFromToken(authToken);
      if (userId) {
        return {
          id: userId,
          email: '', // Will be populated when backend supports it
        };
      }

      return null;
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('token');

      if (stored && isValidToken(stored)) {
        setToken(stored);

        // Fetch user data
        const userData = await fetchUserProfile(stored);
        setUser(userData);
      } else {
        // Token is invalid or expired, clean up
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }

      setLoading(false);
    };

    initAuth();
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiClient.postNoRetry<AuthResponse>(
        '/api/auth/login',
        {
          email,
          password,
        },
        { skipAuth: true }
      );

      localStorage.setItem('token', data.token);
      setToken(data.token);

      // Fetch user profile
      const userData = await fetchUserProfile(data.token);
      setUser(userData);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw new Error(error.getUserMessage());
      }
      throw new Error('Failed to sign in. Please try again.');
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string,
    username?: string,
    phone?: string
  ) => {
    try {
      const requestBody: RegisterRequestBody = {
        email,
        password,
      };

      // Add optional fields if provided
      if (fullName) requestBody.fullName = fullName;
      if (username) requestBody.username = username;
      if (phone) requestBody.phone = phone;

      const data = await apiClient.postNoRetry<AuthResponse>('/api/auth/register', requestBody, { skipAuth: true });

      localStorage.setItem('token', data.token);
      setToken(data.token);

      // Fetch user profile
      const userData = await fetchUserProfile(data.token);
      setUser(userData);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw new Error(error.getUserMessage());
      }
      throw new Error('Failed to create account. Please try again.');
    }
  };

  const signInWithGoogle = async (idToken: string) => {
    try {
      console.log('[AuthContext] Sending Google ID token to backend');

      const data = await apiClient.postNoRetry<AuthResponse>('/api/auth/google-signin', {
        idToken
      }, { skipAuth: true });

      localStorage.setItem('token', data.token);
      setToken(data.token);

      // Fetch user profile
      const userData = await fetchUserProfile(data.token);
      setUser(userData);

      console.log('[AuthContext] Google sign-in successful');
    } catch (error) {
      console.error('[AuthContext] Google sign-in failed:', error);
      if (error instanceof ApiRequestError) {
        throw new Error(error.getUserMessage());
      }
      throw new Error('Failed to sign in with Google. Please try again.');
    }
  };

  const signOut = async () => {
    try {
      // Try to call logout endpoint
      await apiClient.postNoRetry('/api/auth/logout', undefined, { token });
    } catch (err) {
      console.error('Logout API call failed:', err);
      // Continue with local cleanup even if API call fails
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (token) {
      const userData = await fetchUserProfile(token);
      setUser(userData);
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
