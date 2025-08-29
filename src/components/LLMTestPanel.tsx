'use client';

import React, { useState } from 'react';
import { useQuestionGenerator } from '@/hooks/useQuestionGenerator';
import { Language, Difficulty, LLMProvider } from '@/types';

export default function LLMTestPanel() {
  const {
    question,
    isLoading,
    error,
    generateQuestion,
    clearError,
    clearQuestions
  } = useQuestionGenerator();

  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [language, setLanguage] = useState<Language>('en');
  const [provider, setProvider] = useState<LLMProvider>('bedrock');
  const [model, setModel] = useState('anthropic.claude-3-haiku-20240307-v1:0');

  const handleGenerateQuestion = async () => {
    await generateQuestion({
      difficulty,
      language,
      llmConfig: {
        provider,
        model,
        region: 'us-east-1'
      }
    });
  };

  const bedrockModels = {
    'anthropic.claude-3-haiku-20240307-v1:0': 'Claude 3 Haiku',
    'anthropic.claude-3-sonnet-20240229-v1:0': 'Claude 3 Sonnet',
    'amazon.titan-text-express-v1': 'Amazon Titan Text Express'
  };

  const openaiModels = {
    'gpt-4o-mini': 'GPT-4o Mini',
    'gpt-4o': 'GPT-4o',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo'
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🤖 LLM Question Generator Test Panel
      </h2>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LLM Provider
          </label>
          <select
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value as LLMProvider);
              setModel(e.target.value === 'bedrock' 
                ? 'anthropic.claude-3-haiku-20240307-v1:0' 
                : 'gpt-4o-mini'
              );
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="bedrock">AWS Bedrock</option>
            <option value="openai">OpenAI</option>
          </select>
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {provider === 'bedrock' 
              ? Object.entries(bedrockModels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))
              : Object.entries(openaiModels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))
            }
          </select>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="gu">Gujarati</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleGenerateQuestion}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              ✨ Generate Question
            </>
          )}
        </button>

        <button
          onClick={clearQuestions}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
        >
          🗑️ Clear
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-400 mr-2">⚠️</div>
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Generated Question Display */}
      {question && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Generated Question
              </h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {difficulty.toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {language.toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {provider.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Poem */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">🎵 Poem:</h4>
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm">
                {question.poem}
              </pre>
            </div>
          </div>

          {/* Answer */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">✅ Answer:</h4>
            <div className="bg-green-50 p-3 rounded-md border border-green-200">
              <p className="text-green-800 font-semibold text-lg">
                {question.service}
              </p>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">💡 Explanation:</h4>
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p className="text-yellow-800">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
