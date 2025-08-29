'use client';

import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoginScreen({ onLogin, isLoading = false, error }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      await onLogin(username.trim(), password);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        const formEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(formEvent);
      }
    }
  };

  return (
    <div className="h-screen w-screen gaming-bg-animated flex items-center justify-center relative">
      {/* Gaming Particles Effect */}
      <div className="gaming-particles">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="gaming-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Login card */}
      <div className="relative z-10 gaming-card p-12 w-full max-w-md gaming-fade-in gaming-glow">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 gaming-glow gaming-pulse">
            <span className="gaming-text font-bold text-4xl">G</span>
          </div>
          <h1 className="gaming-title text-4xl mb-2">GuessOps</h1>
          <p className="gaming-subtitle text-xl">AWS Community Knowledge Hub</p>
          <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mt-4 rounded-full gaming-glow"></div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username field */}
          <div>
            <label htmlFor="username" className="block gaming-text text-lg font-medium mb-3">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="w-full px-4 py-4 text-xl gaming-card border-2 border-green-400/30 rounded-lg gaming-text placeholder-gray-400 focus:border-green-400 focus:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter moderator username"
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block gaming-text text-lg font-medium mb-3">
              PASSWORD
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="w-full px-4 py-4 text-xl gaming-card border-2 border-green-400/30 rounded-lg gaming-text placeholder-gray-400 focus:border-green-400 focus:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 disabled:opacity-50"
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="gaming-card border-2 border-red-400/50 bg-red-900/20 text-red-300 px-4 py-3 text-center gaming-pulse">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="gaming-text text-lg">{error}</span>
              </div>
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className="w-full gaming-btn text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="gaming-loading w-6 h-6"></div>
                <span>ACCESSING SYSTEM...</span>
              </div>
            ) : (
              'ACCESS COMMUNITY HUB'
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="gaming-text-secondary text-sm">
            🎮 For booth moderators only
          </p>
          <p className="gaming-text-secondary text-xs mt-2 opacity-70">
            Session will end when browser is closed
          </p>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-6 gaming-card p-4 border border-green-400/20">
          <p className="gaming-text-secondary text-sm text-center mb-2">⌨️ Gaming Controls:</p>
          <div className="flex justify-center space-x-4 text-xs gaming-text-secondary">
            <span><kbd className="gaming-card px-2 py-1 border border-green-400/30">Tab</kbd> Navigate</span>
            <span><kbd className="gaming-card px-2 py-1 border border-green-400/30">Enter</kbd> Access</span>
          </div>
        </div>
      </div>

      {/* Version info */}
      <div className="absolute bottom-4 right-4 gaming-text-secondary text-sm opacity-60">
        🏢 GuessOps v1.0 - AWS User Groups Vadodara
      </div>
    </div>
  );
}
