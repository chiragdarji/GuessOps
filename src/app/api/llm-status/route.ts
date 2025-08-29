import { NextRequest, NextResponse } from 'next/server';
import { questionGenerator } from '@/services/questionGenerator';
import { BEDROCK_MODELS, OPENAI_MODELS } from '@/services/llmService';

export async function GET() {
  try {
    // Test current LLM connection
    const isConnected = await questionGenerator.testLLMConnection();
    const currentConfig = questionGenerator.getLLMConfig();
    const availableServices = questionGenerator.getAvailableServices();

    return NextResponse.json({
      status: 'success',
      llm: {
        connected: isConnected,
        currentProvider: currentConfig.provider,
        currentModel: currentConfig.model,
        region: currentConfig.region
      },
      availableModels: {
        bedrock: BEDROCK_MODELS,
        openai: OPENAI_MODELS
      },
      availableServices,
      serviceCount: availableServices.length
    });
  } catch (error) {
    console.error('Error checking LLM status:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Failed to check LLM status',
        llm: {
          connected: false
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, model, region } = body;

    // Validate provider
    if (!['openai', 'bedrock'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be "openai" or "bedrock"' },
        { status: 400 }
      );
    }

    // Switch provider
    questionGenerator.switchProvider({
      provider,
      model,
      region
    });

    // Test new connection
    const isConnected = await questionGenerator.testLLMConnection();

    return NextResponse.json({
      status: 'success',
      message: `Switched to ${provider}`,
      connected: isConnected,
      config: {
        provider,
        model,
        region
      }
    });
  } catch (error) {
    console.error('Error switching LLM provider:', error);
    return NextResponse.json(
      { error: 'Failed to switch LLM provider' },
      { status: 500 }
    );
  }
}
