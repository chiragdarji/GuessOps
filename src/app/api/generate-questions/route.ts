import { NextRequest, NextResponse } from 'next/server';
import { questionGenerator } from '@/services/questionGenerator';
import { Language, Difficulty, LLMConfig } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      count = 5,
      difficulty = 'easy', 
      language = 'en', 
      llmConfig 
    }: {
      count: number;
      difficulty: Difficulty;
      language: Language;
      llmConfig?: LLMConfig;
    } = body;

    // Validate inputs
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    if (!['en', 'hi', 'gu'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language' },
        { status: 400 }
      );
    }

    if (count < 1 || count > 20) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 20' },
        { status: 400 }
      );
    }

    // Generate questions
    const questions = await questionGenerator.generateMultipleQuestions(
      count,
      difficulty,
      language,
      llmConfig
    );

    return NextResponse.json({ questions, count: questions.length }, { status: 200 });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '5');
    const difficulty = (searchParams.get('difficulty') || 'easy') as Difficulty;
    const language = (searchParams.get('language') || 'en') as Language;

    // Validate inputs
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    if (!['en', 'hi', 'gu'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language' },
        { status: 400 }
      );
    }

    if (count < 1 || count > 20) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 20' },
        { status: 400 }
      );
    }

    // Generate questions
    const questions = await questionGenerator.generateMultipleQuestions(
      count,
      difficulty,
      language
    );

    return NextResponse.json({ questions, count: questions.length }, { status: 200 });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
