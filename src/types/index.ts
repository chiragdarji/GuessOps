export interface Question {
  id: string;
  service: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'en' | 'hi' | 'gu';
  poem: string;
  explanation: string;
  options?: string[]; // 4 multiple choice options including correct answer
  correctAnswer?: string; // The correct service name for validation
}

export interface GameState {
  currentQuestion: Question | null;
  isRevealed: boolean;
  timeRemaining: number;
  isPlaying: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'en' | 'hi' | 'gu';
  timerDuration: number;
}

export interface FuzzyGuessResult {
  isClose: boolean;
  closeness: 'very-close' | 'close' | 'not-close';
  message: string;
}

export type Language = 'en' | 'hi' | 'gu';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type LLMProvider = 'openai' | 'bedrock';

export interface LLMConfig {
  provider: LLMProvider;
  model?: string;
  region?: string;
}
