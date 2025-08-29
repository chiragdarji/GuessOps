'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import LoginScreen from './LoginScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, login, isLoading, error } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-400 mx-auto mb-4"></div>
          <p className="text-2xl text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={login}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // Show protected content if authenticated
  return <>{children}</>;
}
