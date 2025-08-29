import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const config = {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasAWSCredentials: !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY,
      awsRegion: process.env.AWS_REGION || 'not-set',
      llmProvider: process.env.NEXT_PUBLIC_LLM_PROVIDER || 'not-set',
      llmModel: process.env.NEXT_PUBLIC_LLM_MODEL || 'not-set',
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      status: 'Configuration Check',
      config,
      recommendations: {
        primary: config.hasOpenAI ? 'OpenAI available' : 'OpenAI not configured',
        fallback: config.hasAWSCredentials ? 'AWS Bedrock available' : 'AWS Bedrock not configured',
        nextStep: !config.hasOpenAI && !config.hasAWSCredentials 
          ? 'Add OPENAI_API_KEY or AWS credentials to environment variables'
          : 'Configuration looks good!'
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Configuration check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
