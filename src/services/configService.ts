import { SSMClient, GetParameterCommand, PutParameterCommand } from '@aws-sdk/client-ssm';

export interface SecureConfig {
  openaiApiKey?: string;
  bedrockRegion?: string;
  llmProvider?: 'openai' | 'bedrock';
  llmModel?: string;
}

export class ConfigService {
  private static instance: ConfigService;
  private ssmClient: SSMClient;
  private cache: Map<string, { value: string; expires: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.ssmClient = new SSMClient({
      region: process.env.AWS_REGION || 'us-west-2'
    });
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Get a parameter from AWS Systems Manager Parameter Store
   */
  async getParameter(parameterName: string, decrypt: boolean = true): Promise<string | null> {
    const cacheKey = `${parameterName}-${decrypt}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.value;
    }

    try {
      const command = new GetParameterCommand({
        Name: parameterName,
        WithDecryption: decrypt
      });

      const response = await this.ssmClient.send(command);
      const value = response.Parameter?.Value || null;

      // Cache the result
      if (value) {
        this.cache.set(cacheKey, {
          value,
          expires: Date.now() + this.CACHE_TTL
        });
      }

      return value;
    } catch (error) {
      console.error(`Failed to get parameter ${parameterName}:`, error);
      return null;
    }
  }

  /**
   * Store a parameter in AWS Systems Manager Parameter Store
   */
  async putParameter(
    parameterName: string, 
    value: string, 
    description?: string,
    isSecure: boolean = true
  ): Promise<boolean> {
    try {
      const command = new PutParameterCommand({
        Name: parameterName,
        Value: value,
        Type: isSecure ? 'SecureString' : 'String',
        Description: description,
        Overwrite: true
      });

      await this.ssmClient.send(command);
      
      // Update cache
      const cacheKey = `${parameterName}-true`;
      this.cache.set(cacheKey, {
        value,
        expires: Date.now() + this.CACHE_TTL
      });

      return true;
    } catch (error) {
      console.error(`Failed to put parameter ${parameterName}:`, error);
      return false;
    }
  }

  /**
   * Get all GuessOps configuration from Parameter Store
   */
  async getGuessOpsConfig(): Promise<SecureConfig> {
    const config: SecureConfig = {};

    try {
      // Try to get parameters with fallback to environment variables
      const [openaiKey, bedrockRegion, provider, model] = await Promise.allSettled([
        this.getParameter('/guessops/openai-api-key'),
        this.getParameter('/guessops/bedrock-region', false),
        this.getParameter('/guessops/llm-provider', false),
        this.getParameter('/guessops/llm-model', false)
      ]);

      config.openaiApiKey = 
        (openaiKey.status === 'fulfilled' ? openaiKey.value : null) || 
        process.env.OPENAI_API_KEY;

      config.bedrockRegion = 
        (bedrockRegion.status === 'fulfilled' ? bedrockRegion.value : null) || 
        process.env.AWS_REGION || 
        'us-west-2';

      config.llmProvider = 
        (provider.status === 'fulfilled' ? provider.value as 'openai' | 'bedrock' : null) || 
        (process.env.NEXT_PUBLIC_LLM_PROVIDER as 'openai' | 'bedrock') || 
        'bedrock';

      config.llmModel = 
        (model.status === 'fulfilled' ? model.value : null) || 
        process.env.NEXT_PUBLIC_LLM_MODEL || 
        'anthropic.claude-3-haiku-20240307-v1:0';

    } catch (error) {
      console.error('Error getting GuessOps config:', error);
      // Fallback to environment variables
      config.openaiApiKey = process.env.OPENAI_API_KEY;
      config.bedrockRegion = process.env.AWS_REGION || 'us-west-2';
      config.llmProvider = (process.env.NEXT_PUBLIC_LLM_PROVIDER as 'openai' | 'bedrock') || 'bedrock';
      config.llmModel = process.env.NEXT_PUBLIC_LLM_MODEL || 'anthropic.claude-3-haiku-20240307-v1:0';
    }

    return config;
  }

  /**
   * Store GuessOps configuration in Parameter Store
   */
  async storeGuessOpsConfig(config: SecureConfig): Promise<boolean> {
    const operations: Promise<boolean>[] = [];

    if (config.openaiApiKey) {
      operations.push(
        this.putParameter(
          '/guessops/openai-api-key',
          config.openaiApiKey,
          'OpenAI API key for GuessOps question generation',
          true
        )
      );
    }

    if (config.bedrockRegion) {
      operations.push(
        this.putParameter(
          '/guessops/bedrock-region',
          config.bedrockRegion,
          'AWS Bedrock region for GuessOps',
          false
        )
      );
    }

    if (config.llmProvider) {
      operations.push(
        this.putParameter(
          '/guessops/llm-provider',
          config.llmProvider,
          'LLM provider for GuessOps (openai or bedrock)',
          false
        )
      );
    }

    if (config.llmModel) {
      operations.push(
        this.putParameter(
          '/guessops/llm-model',
          config.llmModel,
          'LLM model identifier for GuessOps',
          false
        )
      );
    }

    try {
      const results = await Promise.all(operations);
      return results.every(result => result === true);
    } catch (error) {
      console.error('Error storing GuessOps config:', error);
      return false;
    }
  }

  /**
   * Clear the configuration cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Test AWS Systems Manager connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to get a test parameter (this will fail gracefully if it doesn't exist)
      await this.getParameter('/guessops/test-connection', false);
      return true;
    } catch (error) {
      console.error('SSM connection test failed:', error);
      return false;
    }
  }
}

export const configService = ConfigService.getInstance();
