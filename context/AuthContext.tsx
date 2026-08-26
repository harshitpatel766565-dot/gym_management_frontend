'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';

import {
  User,
  LoginCredentials,
  RegisterData,
} from '@/types/user';

import { authService } from '@/services/authService';
import { userService } from '@/services/userService';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;

  logout: () => void;

  updateProfile: (
    profileData: Parameters<typeof userService.updateProfile>[1]
  ) => Promise<void>;

  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing login session
  const initAuth = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Login
  const login = async (
    credentials: LoginCredentials
  ): Promise<User> => {
    setIsLoading(true);

    try {
      const response = await authService.login(credentials);

      if (!response.data) {
        throw new Error(response.message || 'Login failed');
      }

      const loggedInUser = response.data.user;

      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (
    data: RegisterData
  ): Promise<User> => {
    setIsLoading(true);

    try {
      const response = await authService.register(data);

      if (!response.data) {
        throw new Error(response.message || 'Registration failed');
      }

      const registeredUser = response.data.user;

      setUser(registeredUser);

      return registeredUser;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Update Profile
  const updateProfile = async (
    profileData: Parameters<typeof userService.updateProfile>[1]
  ) => {
    if (!user) return;

    const response = await userService.updateProfile(
      user.id,
      profileData
    );

    if (response.success && response.data) {
      setUser(response.data);
    }
  };

  // Refresh User
  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}