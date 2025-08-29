import OpenAI from 'openai';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { LLMProvider, LLMConfig } from '@/types';
import { configService } from './configService';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class LLMService {
  private static instance: LLMService;
  private openaiClient: OpenAI | null = null;
  private bedrockClient: BedrockRuntimeClient | null = null;
  private config: LLMConfig;
  private initializationPromise: Promise<void>;
  private isInitialized = false;

  constructor(config: LLMConfig) {
    this.config = config;
    // Initialize clients asynchronously and store the promise
    this.initializationPromise = this.initializeClients();
  }

  static getInstance(config?: LLMConfig): LLMService {
    if (!LLMService.instance || (config && config.provider !== LLMService.instance.config.provider)) {
      const defaultConfig: LLMConfig = {
        provider: 'bedrock',
        model: 'anthropic.claude-3-haiku-20240307-v1:0',
        region: 'us-east-1'
      };
      LLMService.instance = new LLMService(config || defaultConfig);
    }
    return LLMService.instance;
  }

  private async initializeClients(): Promise<void> {
    try {
      // Get configuration from Parameter Store
      const secureConfig = await configService.getGuessOpsConfig();
      
      // Update config with values from Parameter Store
      this.config.provider = secureConfig.llmProvider || this.config.provider;
      this.config.model = secureConfig.llmModel || this.config.model;
      this.config.region = secureConfig.bedrockRegion || this.config.region;
      
      console.log(`🤖 Initializing LLM service with provider: ${this.config.provider}`);
      
      if (this.config.provider === 'openai') {
        const apiKey = secureConfig.openaiApiKey || process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
          console.warn('OpenAI API key not found in Parameter Store or environment variables');
          return;
        }

        this.openaiClient = new OpenAI({
          apiKey,
          dangerouslyAllowBrowser: false
        });
        console.log('✅ OpenAI client initialized');
        
      } else if (this.config.provider === 'bedrock') {
        const region = this.config.region || 'us-west-2';
        
        this.bedrockClient = new BedrockRuntimeClient({
          region,
          // Use default credential provider chain (AWS CLI, IAM roles, etc.)
          ...(process.env.AWS_ACCESS_KEY_ID && {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
              ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN })
            }
          })
        });
        console.log(`✅ Bedrock client initialized for region: ${region}, model: ${this.config.model}`);
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize LLM clients:', error);
      this.isInitialized = false;
    }
  }

  async generateResponse(
    messages: LLMMessage[],
    options: {
      maxTokens?: number;
      temperature?: number;
    } = {}
  ): Promise<LLMResponse> {
    // Wait for initialization to complete
    if (!this.isInitialized) {
      console.log('⏳ Waiting for LLM service initialization...');
      await this.initializationPromise;
    }
    const { maxTokens = 200, temperature = 0.8 } = options;

    if (this.config.provider === 'openai') {
      return this.generateOpenAIResponse(messages, { maxTokens, temperature });
    } else if (this.config.provider === 'bedrock') {
      return this.generateBedrockResponse(messages, { maxTokens, temperature });
    } else {
      throw new Error(`Unsupported LLM provider: ${this.config.provider}`);
    }
  }

  private async generateOpenAIResponse(
    messages: LLMMessage[],
    options: { maxTokens: number; temperature: number }
  ): Promise<LLMResponse> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const completion = await this.openaiClient.chat.completions.create({
        model: this.config.model || 'gpt-4o-mini',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: options.maxTokens,
        temperature: options.temperature
      });

      const content = completion.choices[0]?.message?.content || '';
      const usage = completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens
      } : undefined;

      return { content, usage };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate response with OpenAI');
    }
  }

  private async generateBedrockResponse(
    messages: LLMMessage[],
    options: { maxTokens: number; temperature: number }
  ): Promise<LLMResponse> {
    if (!this.bedrockClient) {
      throw new Error('Bedrock client not initialized');
    }

    try {
      const modelId = this.config.model || 'anthropic.claude-3-haiku-20240307-v1:0';
      
      // Format messages for Claude
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');
      
      const prompt = this.formatClaudePrompt(userMessages, systemMessage?.content);

      const requestBody = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        ...(systemMessage && { system: systemMessage.content })
      };

      const command = new InvokeModelCommand({
        modelId,
        contentType: 'application/json',
        body: JSON.stringify(requestBody)
      });

      const response = await this.bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      const content = responseBody.content[0]?.text || '';
      const usage = responseBody.usage ? {
        promptTokens: responseBody.usage.input_tokens,
        completionTokens: responseBody.usage.output_tokens,
        totalTokens: responseBody.usage.input_tokens + responseBody.usage.output_tokens
      } : undefined;

      return { content, usage };
    } catch (error) {
      console.error('Bedrock API error:', error);
      throw new Error('Failed to generate response with Bedrock');
    }
  }

  private formatClaudePrompt(messages: LLMMessage[], systemPrompt?: string): string {
    let prompt = '';
    
    if (systemPrompt) {
      prompt += `System: ${systemPrompt}\n\n`;
    }

    messages.forEach(message => {
      if (message.role === 'user') {
        prompt += `Human: ${message.content}\n\n`;
      } else if (message.role === 'assistant') {
        prompt += `Assistant: ${message.content}\n\n`;
      }
    });

    prompt += 'Assistant: ';
    return prompt;
  }

  // Utility method to test connection
  async testConnection(): Promise<boolean> {
    try {
      const testMessages: LLMMessage[] = [
        { role: 'user', content: 'Say "Hello" if you can hear me.' }
      ];
      
      const response = await this.generateResponse(testMessages, {
        maxTokens: 10,
        temperature: 0.1
      });
      
      return response.content.toLowerCase().includes('hello');
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  getConfig(): LLMConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<LLMConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeClients().catch(console.error);
  }
}

// Available Bedrock models
export const BEDROCK_MODELS = {
  'anthropic.claude-3-haiku-20240307-v1:0': 'Claude 3 Haiku (Fast & Cost-effective)',
  'anthropic.claude-3-sonnet-20240229-v1:0': 'Claude 3 Sonnet (Balanced)',
  'anthropic.claude-3-opus-20240229-v1:0': 'Claude 3 Opus (Most Capable)',
  'amazon.titan-text-express-v1': 'Amazon Titan Text Express',
  'ai21.j2-ultra-v1': 'AI21 Labs Jurassic-2 Ultra',
  'cohere.command-text-v14': 'Cohere Command',
  'meta.llama2-70b-chat-v1': 'Meta Llama 2 70B Chat'
};

// Available OpenAI models
export const OPENAI_MODELS = {
  'gpt-4o': 'GPT-4o (Most Capable)',
  'gpt-4o-mini': 'GPT-4o Mini (Fast & Cost-effective)',
  'gpt-4-turbo': 'GPT-4 Turbo',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo'
};

export const llmService = LLMService.getInstance();
