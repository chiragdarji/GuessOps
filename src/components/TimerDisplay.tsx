'use client';

import React, { useEffect, useState } from 'react';

interface TimerDisplayProps {
  timeRemaining: number;
  totalTime: number;
  isVisible: boolean;
  onTimeUp: () => void;
  playSound?: boolean;
}

export default function TimerDisplay({
  timeRemaining,
  totalTime,
  isVisible,
  onTimeUp,
  playSound = true
}: TimerDisplayProps) {
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  // Play timeout sound when time reaches zero
  useEffect(() => {
    if (timeRemaining === 0 && !hasPlayedSound && playSound) {
      // Play timeout sound effect - use Web Audio API with fallback
      try {
        // Create a simple beep sound using Web Audio API as fallback
        const audioContext = new (window.AudioContext || (window as typeof window.AudioContext).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz beep
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        setHasPlayedSound(true);
      } catch (error) {
        console.warn('Could not play timeout sound:', error);
      }
      
      onTimeUp();
    }
  }, [timeRemaining, hasPlayedSound, playSound, onTimeUp]);

  // Reset sound flag when timer restarts
  useEffect(() => {
    if (timeRemaining > 0) {
      setHasPlayedSound(false);
    }
  }, [timeRemaining]);

  if (!isVisible) return null;

  // Calculate progress for circular animation
  const progress = (timeRemaining / totalTime) * 100;
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get color based on time remaining
  const getTimerColor = () => {
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage > 50) return 'text-green-400 stroke-green-400';
    if (percentage > 25) return 'text-yellow-400 stroke-yellow-400';
    return 'text-red-400 stroke-red-400';
  };

  return (
    <div className="flex flex-col items-center justify-center gaming-timer">
      {/* Circular timer */}
      <div className="relative gaming-glow">
        <svg
          className="transform -rotate-90 w-64 h-64 drop-shadow-2xl"
          width="256"
          height="256"
        >
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
            fill="transparent"
          />
          {/* Outer glow circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="rgba(0,255,136,0.2)"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${getTimerColor()} transition-all duration-1000 ease-linear gaming-timer-circle`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Time display in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`gaming-text text-6xl font-mono font-bold ${getTimerColor()} gaming-glow`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {/* Timer label */}
      <p className="gaming-subtitle text-2xl mt-6">
        TIME REMAINING
      </p>

      {/* Enhanced pulsing effects when time is low */}
      {timeRemaining <= 10 && timeRemaining > 0 && (
        <>
          <div className="absolute inset-0 border-4 border-red-400 rounded-full animate-ping opacity-75 gaming-glow"></div>
          <div className="absolute inset-0 border-2 border-orange-400 rounded-full animate-pulse opacity-50"></div>
        </>
      )}

      {/* Critical time warning */}
      {timeRemaining <= 5 && timeRemaining > 0 && (
        <div className="absolute -inset-8 border-4 border-red-500 rounded-full animate-bounce opacity-60 gaming-glow"></div>
      )}
    </div>
  );
}
