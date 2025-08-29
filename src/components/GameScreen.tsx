'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/types';

interface GameScreenProps {
  question?: Question;
  isLoading: boolean;
  isRevealed: boolean;
  timeRemaining?: number;
  isTimeUp: boolean;
  showTimer: boolean;
  onNext: () => void;
  onReveal: () => void;
  onSkip?: () => void;
}

export default function GameScreen({
  question,
  isLoading,
  isRevealed,
  timeRemaining,
  isTimeUp,
  showTimer,
  onNext,
  onReveal,
  onSkip
}: GameScreenProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger fade-in animation when question loads
  useEffect(() => {
    if (question && !isLoading) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [question, isLoading]);

  // Format timer display
  const formatTime = (seconds?: number) => {
    if (seconds === undefined) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return 'bg-blue-600 text-blue-100';
    
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-600 text-green-100';
      case 'medium': return 'bg-yellow-600 text-yellow-100';
      case 'hard': return 'bg-red-600 text-red-100';
      default: return 'bg-blue-600 text-blue-100';
    }
  };

  return (
    <div className="h-screen w-screen gaming-bg-animated gaming-text flex flex-col overflow-hidden relative">
      {/* Gaming Particles Effect */}
      <div className="gaming-particles">
        {[...Array(12)].map((_, i) => (
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

      {/* Compact Header - Smaller height */}
      <header className="flex justify-between items-center px-6 py-3 gaming-card border-none rounded-none bg-opacity-90 backdrop-blur-lg min-h-[70px] border-b border-orange-400/20">
        <div className="flex items-center space-x-4 flex-1">
          <img 
            src="https://communityday.awsugvad.in/images/Logo%20_%20AWS%20UG%20Vadodara.svg" 
            alt="AWS User Groups Vadodara" 
            className="h-10 w-auto gaming-glow flex-shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex flex-col flex-1">
            <h1 className="gaming-title text-2xl lg:text-3xl whitespace-nowrap">GuessOps</h1>
            <span className="gaming-subtitle text-sm lg:text-base whitespace-nowrap opacity-80">AWS Community Knowledge Hub</span>
          </div>
        </div>
        
        {/* Difficulty badge - Larger size */}
        <div className="flex-shrink-0 w-32 flex justify-end">
          {question && !isLoading && question.difficulty && (
            <div className={`gaming-badge gaming-badge-${question.difficulty.toLowerCase()} gaming-pulse text-sm lg:text-base px-4 py-2`}>
              {question.difficulty.toUpperCase()}
            </div>
          )}
        </div>
      </header>

      {/* Floating Community Sidebar */}
      <div className="fixed top-1/2 left-2 lg:left-6 transform -translate-y-1/2 z-10">
        <div className="gaming-card p-3 lg:p-4 bg-opacity-95 backdrop-blur-lg border-2 border-orange-400/50 gaming-glow max-w-[160px] lg:max-w-[200px] hover:scale-105 hover:border-orange-400/80 transition-all duration-300 cursor-pointer group">
          {/* QR Code */}
          <div className="text-center mb-4">
            <div className="bg-white p-2 rounded-lg mb-2 mx-auto w-fit">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent('https://www.meetup.com/aws-community-vadodara/')}`}
                alt="AWS UG Vadodara Meetup QR"
                className="w-20 h-20 lg:w-24 lg:h-24"
              />
            </div>
            <p className="gaming-text-secondary text-xs font-semibold text-orange-400 group-hover:animate-pulse">
              Join Our Community
            </p>
          </div>
          
          {/* Community Stats */}
          <div className="text-center space-y-2 border-t border-orange-400/30 pt-3">
            <div className="gaming-text-secondary text-xs">
              <div className="text-orange-400 font-semibold">4,010+ Members</div>
              <div className="mt-1">AWS UG Vadodara</div>
            </div>
            <div className="gaming-text-secondary text-xs">
              <div className="text-blue-400 font-semibold">📅 Sep 13, 2025</div>
              <div>Community Day</div>
            </div>
            <div className="gaming-text-secondary text-xs opacity-80">
              meetup.com/aws-community-vadodara
            </div>
          </div>
        </div>
      </div>

      {/* Main content area - More space with compact header */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative">
        {isLoading ? (
          // Loading state
          <div className="text-center gaming-fade-in">
            <div className="gaming-loading mx-auto mb-8"></div>
            <h2 className="gaming-title text-6xl mb-6">Generating Question...</h2>
            <p className="gaming-text-secondary text-3xl">AI is crafting your AWS riddle</p>
            <div className="mt-8 flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        ) : question ? (
          // Question display
          <div className={`text-center w-full max-w-7xl transition-all duration-1000 ${isAnimating ? 'gaming-fade-in' : 'gaming-slide-up'}`}>
            {/* Poem - Smaller when revealed */}
            <div className={`gaming-card gaming-glow transition-all duration-700 ${
              isRevealed ? 'mb-4 p-4' : 'mb-8 p-8'
            }`}>
              <div className={`gaming-text leading-relaxed font-light whitespace-pre-line tracking-wide transition-all duration-700 ${
                isRevealed ? 'text-2xl' : 'text-3xl lg:text-4xl'
              }`}>
                {question.poem}
              </div>
            </div>

            {/* Timer display - Hide when options are shown or revealed */}
            {showTimer && timeRemaining !== undefined && !isTimeUp && !isRevealed && (
              <div className="mb-8">
                <div className="relative inline-block gaming-timer">
                  <div className="gaming-text text-8xl font-mono font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="absolute -inset-6 border-2 border-green-400 rounded-lg gaming-glow animate-pulse"></div>
                </div>
                <p className="gaming-subtitle text-2xl mt-4">Time Remaining</p>
              </div>
            )}

            {/* Time's up message - Hide when answer is revealed */}
            {isTimeUp && !isRevealed && (
              <div className="mb-6 gaming-pulse">
                <div className="gaming-title text-6xl lg:text-8xl mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent gaming-glow">
                  TIME'S UP!
                </div>
                <p className="gaming-text-secondary text-xl lg:text-2xl animate-pulse">Choose an option to see the answer</p>
              </div>
            )}

            {/* Multiple Choice Options */}
            {question && !isLoading && !isRevealed && (
              <div className="mt-6 w-full max-w-7xl mx-auto px-3">
                <h3 className="gaming-subtitle text-2xl lg:text-3xl mb-6 text-center">Choose the correct AWS service:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 justify-center">
                  {question.options?.map((option, index) => (
                    <button
                      key={index}
                      className="gaming-btn-secondary text-base lg:text-lg p-4 lg:p-5 text-left hover:scale-102 transition-transform w-full min-h-[70px] flex items-center"
                      onClick={() => {
                        // For now, just reveal the answer when any option is clicked
                        // In future, we can add scoring logic here
                        onReveal();
                      }}
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <span className="gaming-title text-base lg:text-lg bg-orange-500 text-white px-3 py-2 rounded-full min-w-[40px] max-w-[40px] h-[40px] flex items-center justify-center flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1 text-left text-base lg:text-lg leading-relaxed break-words hyphens-auto">{option}</span>
                      </div>
                    </button>
                  )) || (
                    // Fallback if no options generated
                    <div className="col-span-2 text-center">
                      <button
                        onClick={onReveal}
                        className="gaming-btn text-2xl"
                      >
                        Reveal Answer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Revealed answer - Full width and responsive */}
            {isRevealed && (
              <div className="mt-8 w-full max-w-7xl mx-auto">
                {/* Service name - No tick mark, smaller font */}
                <div className="gaming-card p-6 border-4 border-green-400 gaming-glow gaming-fade-in mb-6">
                  <h3 className="gaming-title text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent text-center">
                    {question.service.replace(/^[•\-\*]\s*/, '')}
                  </h3>
                </div>
                
                {/* Explanation box - Smaller font */}
                <div className="gaming-card p-6 md:p-8 border-2 border-green-400/50 gaming-glow">
                  <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-xl p-4 md:p-6 border border-green-400/20">
                    <p className="gaming-text text-xl md:text-2xl lg:text-3xl leading-relaxed opacity-95 text-left break-words hyphens-auto">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Initial state
          <div className="text-center gaming-fade-in">
            <div className="mb-8">
              <img 
                src="https://communityday.awsugvad.in/images/Logo%20_%20AWS%20UG%20Vadodara.svg" 
                alt="AWS User Groups Vadodara" 
                className="mx-auto mb-6 h-32 w-auto"
                onError={(e) => {
                  // Fallback if logo doesn't load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h2 className="gaming-title text-6xl lg:text-8xl mb-4">GuessOps</h2>
            <h3 className="gaming-title text-3xl lg:text-4xl mb-8 text-green-400">AWS User Groups Vadodara</h3>
            <p className="gaming-text-secondary text-3xl lg:text-4xl mb-8">Community Learning & Knowledge Sharing</p>
            <p className="gaming-text text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto">
              Test your AWS expertise in this interactive cloud knowledge challenge designed for the AWS community
            </p>
            <div className="gaming-text text-2xl lg:text-3xl">
              Click <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-bold">Start Game</span> to begin your AWS journey
            </div>
            <div className="mt-12 flex justify-center">
              <div className="gaming-card p-6 gaming-glow">
                <div className="gaming-text-secondary text-lg">🎮 Professional Gaming Experience</div>
              </div>
            </div>
          </div>
        )}

        {/* Moderator controls overlay */}
        <div className="absolute bottom-8 right-8 flex space-x-4">
          {!isLoading && (
            <>
              {!question || isRevealed ? (
                <button
                  onClick={onNext}
                  className="gaming-btn text-2xl"
                >
                  {!question ? 'Start Game' : 'Next Question'}
                </button>
              ) : (
                <>
                  {onSkip && (
                    <button
                      onClick={onSkip}
                      className="gaming-btn-secondary text-xl"
                    >
                      Skip Question
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer with community info */}
      <footer className="gaming-card border-none rounded-none bg-opacity-95 backdrop-blur-lg p-6 text-center">
        <div className="mb-4">
          <p className="gaming-text-secondary text-2xl">
            {isLoading ? 'Please wait while we generate your question...' :
             question && !isRevealed ? '🎯 Guess the AWS service!' :
             isRevealed ? '🎯 Ready for the next challenge?' :
             '🚀 Welcome! Click Start Game to begin your AWS adventure'}
          </p>
        </div>
        <div className="border-t border-green-400/20 pt-4 text-center">
          <p className="gaming-text-secondary text-lg">
            🌟 Powered by <span className="text-orange-400 font-semibold">AWS User Groups Vadodara</span>
          </p>
          <p className="gaming-text-secondary text-sm mt-2">
            Community-driven learning • Knowledge sharing • Networking
          </p>
        </div>
      </footer>
    </div>
  );
}
