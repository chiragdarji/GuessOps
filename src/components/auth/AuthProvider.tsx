'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple credential validation (for booth environment)
const getValidCredentials = () => {
  // Default credentials for booth environment
  const defaultCredentials = [
    { username: 'moderator', password: 'guessops2024' },
    { username: 'admin', password: 'aws-booth' },
    { username: 'booth', password: 'community-day' },
  ];

  // Add custom credentials from environment variables
  const customCredentials = [];
  
  // Check for custom username/password from environment
  if (process.env.NEXT_PUBLIC_MODERATOR_USERNAME && process.env.NEXT_PUBLIC_MODERATOR_PASSWORD) {
    customCredentials.push({
      username: process.env.NEXT_PUBLIC_MODERATOR_USERNAME,
      password: process.env.NEXT_PUBLIC_MODERATOR_PASSWORD,
    });
  }

  // Additional custom credentials (can add more pairs)
  if (process.env.NEXT_PUBLIC_ADMIN_USERNAME && process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    customCredentials.push({
      username: process.env.NEXT_PUBLIC_ADMIN_USERNAME,
      password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
    });
  }

  return [...defaultCredentials, ...customCredentials];
};

const VALID_CREDENTIALS = getValidCredentials();

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const sessionData = sessionStorage.getItem('guessops-auth');
        if (sessionData) {
          const { username: savedUsername, timestamp } = JSON.parse(sessionData);
          const now = Date.now();
          const sessionAge = now - timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours

          if (sessionAge < maxAge) {
            setIsAuthenticated(true);
            setUsername(savedUsername);
          } else {
            // Session expired
            sessionStorage.removeItem('guessops-auth');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        sessionStorage.removeItem('guessops-auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Login function
  const login = async (inputUsername: string, inputPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Validate credentials
      const isValid = VALID_CREDENTIALS.some(
        cred => cred.username === inputUsername && cred.password === inputPassword
      );

      if (isValid) {
        // Save session
        const sessionData = {
          username: inputUsername,
          timestamp: Date.now(),
        };
        sessionStorage.setItem('guessops-auth', JSON.stringify(sessionData));

        setIsAuthenticated(true);
        setUsername(inputUsername);
        setError(null);
        return true;
      } else {
        setError('Invalid username or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    sessionStorage.removeItem('guessops-auth');
    sessionStorage.removeItem('guessops-settings'); // Clear game settings too
    setIsAuthenticated(false);
    setUsername(null);
    setError(null);
  };

  // Auto-logout on browser close (handled by sessionStorage)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // SessionStorage will be cleared automatically
      // This is just for cleanup if needed
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    username,
    login,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-400 mx-auto mb-4"></div>
            <p className="text-2xl text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // This will be handled by the main app component
    }

    return <Component {...props} />;
  };
}
