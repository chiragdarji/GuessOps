import { NextRequest, NextResponse } from 'next/server';
import { configService } from '@/services/configService';

export async function GET() {
  try {
    const config = await configService.getGuessOpsConfig();
    
    // Don't expose sensitive data in the response
    const safeConfig = {
      llmProvider: config.llmProvider,
      llmModel: config.llmModel,
      bedrockRegion: config.bedrockRegion,
      hasOpenAIKey: !!config.openaiApiKey,
      ssmConnected: await configService.testConnection()
    };

    return NextResponse.json({
      status: 'success',
      config: safeConfig
    });
  } catch (error) {
    console.error('Error getting config:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Failed to get configuration',
        config: {
          llmProvider: 'bedrock',
          llmModel: 'anthropic.claude-3-haiku-20240307-v1:0',
          bedrockRegion: 'us-west-2',
          hasOpenAIKey: false,
          ssmConnected: false
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      openaiApiKey,
      bedrockRegion,
      llmProvider,
      llmModel
    } = body;

    // Validate input
    if (llmProvider && !['openai', 'bedrock'].includes(llmProvider)) {
      return NextResponse.json(
        { error: 'Invalid LLM provider' },
        { status: 400 }
      );
    }

    // Store configuration
    const success = await configService.storeGuessOpsConfig({
      openaiApiKey,
      bedrockRegion,
      llmProvider,
      llmModel
    });

    if (success) {
      // Clear cache to force reload
      configService.clearCache();
      
      return NextResponse.json({
        status: 'success',
        message: 'Configuration updated successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update configuration' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Clear configuration cache
    configService.clearCache();
    
    return NextResponse.json({
      status: 'success',
      message: 'Configuration cache cleared'
    });
  } catch (error) {
    console.error('Error clearing config cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear configuration cache' },
      { status: 500 }
    );
  }
}
