'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameScreen from './GameScreen';
import TimerDisplay from './TimerDisplay';
import { Question } from '@/types';
import { useAuth } from './auth/AuthProvider';
import { textToSpeechService, VoiceId } from '@/services/textToSpeechService';

interface GameSettings {
  timerDuration: number;
  soundEffectsEnabled: boolean;
  showDifficulty: boolean;
  ttsEnabled: boolean;
  voiceId: VoiceId;
  ttsProvider: 'polly' | 'webspeech';
}

const DEFAULT_SETTINGS: GameSettings = {
  timerDuration: 30, // 30 seconds default
  soundEffectsEnabled: true,
  showDifficulty: true,
  ttsEnabled: true,
  voiceId: 'Aditi', // Indian English voice for more natural sound
  ttsProvider: 'polly', // Use AWS Polly as primary TTS
};

export default function GameController() {
  const { logout, username } = useAuth();
  
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  // Question history to prevent repeats
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);

  // Load settings from session storage
  useEffect(() => {
    const savedSettings = sessionStorage.getItem('guessops-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setGameSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to session storage
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    const updated = { ...gameSettings, ...newSettings };
    setGameSettings(updated);
    sessionStorage.setItem('guessops-settings', JSON.stringify(updated));
    
    // Update TTS service configuration
    textToSpeechService.updateConfig({
      provider: updated.ttsProvider,
      voiceId: updated.voiceId
    });
  }, [gameSettings]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            setIsTimeUp(true);
            setShowTimer(false); // Hide timer when it expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeRemaining]);

  // Generate new question
  const generateQuestion = useCallback(async () => {
    // Stop any ongoing speech before generating new question
    textToSpeechService.stop();
    
    setIsLoading(true);
    setIsRevealed(false);
    setIsTimeUp(false);
    setShowTimer(false);
    setIsTimerActive(false);

    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Let API randomly select difficulty level
          excludeServices: questionHistory.slice(-5) // Avoid last 5 questions
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const question: Question = await response.json();
      
      // Update question history
      setQuestionHistory(prev => [...prev, question.service].slice(-10)); // Keep last 10
      
      setCurrentQuestion(question);
      
      // Start timer after question loads
      setTimeout(async () => {
        setTimeRemaining(gameSettings.timerDuration);
        setShowTimer(true); // Show timer when question is ready
        setIsTimerActive(true);
        
        // Trigger text-to-speech with new service
        if (gameSettings.ttsEnabled) {
          try {
            await textToSpeechService.speak(question.poem, {
              provider: gameSettings.ttsProvider,
              voiceId: gameSettings.voiceId,
              rate: 0.9, // Natural speed for Indian voice
              volume: 1.0
            });
          } catch (error) {
            console.error('TTS failed:', error);
          }
        }
      }, 500); // Small delay for smooth animation
      
    } catch (error) {
      console.error('Failed to generate question:', error);
      // Show error message to user
      alert('Failed to generate question. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [gameSettings.timerDuration, questionHistory]);

  // Handle next question
  const handleNext = useCallback(() => {
    generateQuestion();
  }, [generateQuestion]);

  // Handle reveal answer
  const handleReveal = useCallback(async () => {
    setIsRevealed(true);
    setShowTimer(false); // Hide timer during reveal
    setIsTimerActive(false);
    
    // Read the answer aloud with TTS service
    if (gameSettings.ttsEnabled && currentQuestion) {
      try {
        const answerText = `The answer is ${currentQuestion.service}. ${currentQuestion.explanation}`;
        await textToSpeechService.speak(answerText, {
          provider: gameSettings.ttsProvider,
          voiceId: gameSettings.voiceId,
          rate: 0.85, // Slightly slower for answer explanation
          volume: 1.0
        });
      } catch (error) {
        console.error('Answer TTS failed:', error);
      }
    }
  }, [currentQuestion, gameSettings]);

  // Handle skip question
  const handleSkip = useCallback(() => {
    generateQuestion();
  }, [generateQuestion]);

  // Handle timer expiry
  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true);
    setIsTimerActive(false);
    setShowTimer(false);
  }, []);

  // Keyboard shortcuts for moderator
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isLoading) return;
      
      switch (event.key.toLowerCase()) {
        case 'n':
        case ' ': // Spacebar
          if (!currentQuestion || isRevealed) {
            handleNext();
          }
          break;
        case 'r':
          if (currentQuestion && !isRevealed) {
            handleReveal();
          }
          break;
        case 's':
          if (currentQuestion && !isRevealed) {
            handleSkip();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, isRevealed, isTimeUp, timeRemaining, isLoading, handleNext, handleReveal, handleSkip]);

  return (
    <div className="relative">
      {/* Main game screen */}
      <GameScreen
        question={currentQuestion || undefined}
        isLoading={isLoading}
        isRevealed={isRevealed}
        timeRemaining={timeRemaining}
        isTimeUp={isTimeUp}
        showTimer={false} // We'll use separate timer component
        onNext={handleNext}
        onReveal={handleReveal}
        onSkip={handleSkip}
      />

      {/* Floating timer overlay */}
      {showTimer && currentQuestion && !isRevealed && !isTimeUp && (
        <div className="fixed top-1/2 right-12 transform -translate-y-1/2 z-10">
          <TimerDisplay
            timeRemaining={timeRemaining}
            totalTime={gameSettings.timerDuration}
            isVisible={showTimer && !isRevealed && !isTimeUp}
            onTimeUp={handleTimeUp}
            playSound={gameSettings.soundEffectsEnabled}
          />
        </div>
      )}

      {/* Moderator panel */}
      <div className="fixed bottom-4 left-4 z-20">
        <div className="bg-gray-800 rounded-lg p-4 text-white text-sm opacity-90 hover:opacity-100 transition-opacity">
          {/* Moderator info */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
            <div>
              <div className="text-xs text-gray-400">Community Moderator:</div>
              <div className="text-sm font-medium text-orange-400">{username}</div>
              <div className="text-xs text-gray-500">AWS UG Vadodara</div>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
              title="Logout and return to login screen"
            >
              Logout
            </button>
          </div>
          
          {/* Controls */}
          <div className="text-xs text-gray-400 mb-2">Keyboard Shortcuts:</div>
          <div className="space-y-1 text-xs">
            <div><kbd className="bg-gray-700 px-1 rounded">N</kbd> or <kbd className="bg-gray-700 px-1 rounded">Space</kbd> - Next</div>
            <div><kbd className="bg-gray-700 px-1 rounded">R</kbd> - Reveal</div>
            <div><kbd className="bg-gray-700 px-1 rounded">S</kbd> - Skip</div>
          </div>
        </div>
      </div>

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
          <div>Timer: {timeRemaining}s</div>
          <div>Active: {isTimerActive ? 'Yes' : 'No'}</div>
          <div>Time Up: {isTimeUp ? 'Yes' : 'No'}</div>
          <div>Revealed: {isRevealed ? 'Yes' : 'No'}</div>
          <div>Questions: {questionHistory.length}</div>
          <div>TTS: {gameSettings.ttsEnabled ? `${gameSettings.ttsProvider}/${gameSettings.voiceId}` : 'Off'}</div>
        </div>
      )}
    </div>
  );
}
