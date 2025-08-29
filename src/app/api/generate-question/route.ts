import { NextRequest, NextResponse } from 'next/server';
import { questionGenerator } from '@/services/questionGenerator';
import { Language, Difficulty, LLMConfig } from '@/types';

// Helper function to get random difficulty with weighted distribution
function getRandomDifficulty(): Difficulty {
  const random = Math.random();
  
  // Weighted distribution: 40% easy, 35% medium, 25% hard
  if (random < 0.4) {
    return 'easy';
  } else if (random < 0.75) {
    return 'medium';
  } else {
    return 'hard';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      service, 
      difficulty = getRandomDifficulty(), // Random difficulty if not specified
      language = 'en', 
      llmConfig 
    }: {
      service?: string;
      difficulty?: Difficulty;
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

    // Generate question
    const question = await questionGenerator.generateQuestion({
      service,
      difficulty,
      language,
      llmConfig
    });

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error('Error generating question:', error);
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate question';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: 'Please ensure AWS Bedrock is properly configured and accessible.'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = (searchParams.get('difficulty') || getRandomDifficulty()) as Difficulty;
    const language = (searchParams.get('language') || 'en') as Language;
    const service = searchParams.get('service') || undefined;

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

    // Generate question
    const question = await questionGenerator.generateQuestion({
      service,
      difficulty,
      language
    });

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error('Error generating question:', error);
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate question';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: 'Please ensure AWS Bedrock is properly configured and accessible.'
      },
      { status: 500 }
    );
  }
}
