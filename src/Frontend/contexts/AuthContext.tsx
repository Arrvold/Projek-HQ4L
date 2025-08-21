'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { identityManager } from '../lib/identityManager';
import { icGameService, UserProfile } from '../lib/icService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  userExists: boolean;
  principal: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (username: string) => Promise<{ success: boolean; error?: string }>;
  checkAuthStatus: () => Promise<void>;
  checkUserExists: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userExists, setUserExists] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await identityManager.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const currentPrincipal = await identityManager.getPrincipalString();
        setPrincipal(currentPrincipal);
        console.log('User authenticated with principal:', currentPrincipal);
      } else {
        setPrincipal(null);
        setUserProfile(null);
        setUserExists(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setPrincipal(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user exists in backend
  const checkUserExists = async () => {
    if (!isAuthenticated) {
      setUserExists(false);
      return;
    }

    try {
      const exists = await icGameService.checkUserExists();
      setUserExists(exists);
      console.log('User exists check:', exists);
    } catch (error) {
      console.error('Error checking user exists:', error);
      setUserExists(false);
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!isAuthenticated) {
      setUserProfile(null);
      return;
    }

    try {
      const result = await icGameService.getUserProfile();
      if (result.success && result.data) {
        setUserProfile(result.data);
        console.log('User profile refreshed:', result.data);
      } else {
        setUserProfile(null);
        console.log('No user profile found');
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      setUserProfile(null);
    }
  };

  // Login with Internet Identity
  const login = async () => {
    try {
      setIsLoading(true);
      await identityManager.login();
      await checkAuthStatus();
      await checkUserExists();
      
      if (userExists) {
        await refreshUserProfile();
      }
      
      console.log('Internet Identity login completed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      await identityManager.logout();
      setIsAuthenticated(false);
      setUserProfile(null);
      setUserExists(false);
      setPrincipal(null);
      console.log('Internet Identity logout completed');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const registerUser = async (username: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const result = await icGameService.registerUser(username);
      if (result.success) {
        setUserExists(true);
        setUserProfile(result.data || null);
        console.log('User registered successfully:', result.data);
      }
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
      if (isAuthenticated) {
        await checkUserExists();
        if (userExists) {
          await refreshUserProfile();
        }
      }
    };

    initializeAuth();
  }, []);

  // Update user exists and profile when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      checkUserExists();
    }
  }, [isAuthenticated]);

  // Update user profile when user exists changes
  useEffect(() => {
    if (isAuthenticated && userExists) {
      refreshUserProfile();
    }
  }, [userExists]);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    userProfile,
    userExists,
    principal,
    login,
    logout,
    registerUser,
    checkAuthStatus,
    checkUserExists,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
