import { useState, useCallback } from 'react';
import { Question, Language, Difficulty, LLMConfig } from '@/types';

interface UseQuestionGeneratorReturn {
  question: Question | null;
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  generateQuestion: (params: {
    service?: string;
    difficulty: Difficulty;
    language: Language;
    llmConfig?: LLMConfig;
  }) => Promise<void>;
  generateMultipleQuestions: (params: {
    count: number;
    difficulty: Difficulty;
    language: Language;
    llmConfig?: LLMConfig;
  }) => Promise<void>;
  clearError: () => void;
  clearQuestions: () => void;
}

export function useQuestionGenerator(): UseQuestionGeneratorReturn {
  const [question, setQuestion] = useState<Question | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = useCallback(async (params: {
    service?: string;
    difficulty: Difficulty;
    language: Language;
    llmConfig?: LLMConfig;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate question');
      }

      const data = await response.json();
      setQuestion(data.question);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateMultipleQuestions = useCallback(async (params: {
    count: number;
    difficulty: Difficulty;
    language: Language;
    llmConfig?: LLMConfig;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearQuestions = useCallback(() => {
    setQuestion(null);
    setQuestions([]);
  }, []);

  return {
    question,
    questions,
    isLoading,
    error,
    generateQuestion,
    generateMultipleQuestions,
    clearError,
    clearQuestions,
  };
}
