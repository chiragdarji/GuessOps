import { Question, Language, Difficulty, LLMProvider, LLMConfig } from '@/types';
import { LLMService, LLMMessage } from './llmService';

// AWS Services list - Popular and Latest Services (2024)
const AWS_SERVICES = [
  // Core Compute Services
  'Amazon EC2', 'AWS Lambda', 'AWS Fargate', 'Amazon ECS', 'Amazon EKS',
  'Amazon Elastic Beanstalk', 'AWS Batch', 'Amazon Lightsail', 'AWS App Runner',
  
  // Storage Services
  'Amazon S3', 'Amazon EBS', 'Amazon EFS', 'Amazon FSx', 'AWS Storage Gateway',
  'Amazon S3 Glacier', 'AWS Backup', 'Amazon S3 Intelligent-Tiering',
  
  // Database Services
  'Amazon RDS', 'Amazon DynamoDB', 'Amazon Redshift', 'Amazon ElastiCache',
  'Amazon DocumentDB', 'Amazon Neptune', 'Amazon Timestream', 'Amazon QLDB',
  'Amazon MemoryDB', 'Amazon Aurora', 'Amazon Aurora Serverless',
  
  // Networking & CDN
  'Amazon VPC', 'Amazon CloudFront', 'Amazon Route 53', 'AWS Direct Connect',
  'AWS VPN', 'AWS Transit Gateway', 'Amazon API Gateway', 'AWS App Mesh',
  'AWS Cloud WAN', 'Amazon CloudFront Functions',
  
  // Security & Identity
  'AWS IAM', 'Amazon Cognito', 'AWS Secrets Manager', 'AWS Certificate Manager',
  'AWS WAF', 'AWS Shield', 'Amazon GuardDuty', 'AWS Security Hub',
  'AWS KMS', 'AWS CloudHSM', 'Amazon Macie', 'AWS Identity Center',
  
  // Monitoring & Management
  'Amazon CloudWatch', 'AWS X-Ray', 'AWS CloudTrail', 'AWS Config',
  'AWS Systems Manager', 'Amazon EventBridge', 'AWS Organizations',
  'AWS Control Tower', 'AWS Well-Architected Tool', 'Amazon CloudWatch Logs',
  
  // Messaging & Integration
  'Amazon SNS', 'Amazon SQS', 'Amazon EventBridge', 'AWS Step Functions',
  'Amazon MQ', 'Amazon Kinesis', 'Amazon Kinesis Data Firehose',
  'Amazon Kinesis Data Analytics', 'AWS AppSync', 'Amazon Simple Email Service',
  
  // DevOps & CI/CD
  'AWS CodePipeline', 'AWS CodeBuild', 'AWS CodeDeploy', 'AWS CodeCommit',
  'AWS CodeStar', 'AWS Cloud9', 'AWS CloudFormation', 'AWS CDK',
  'AWS Amplify', 'Amazon CodeGuru', 'AWS Copilot',
  
  // AI/ML Services (Popular & Latest)
  'Amazon SageMaker', 'Amazon Bedrock', 'Amazon Q', 'Amazon Rekognition',
  'Amazon Polly', 'Amazon Transcribe', 'Amazon Translate', 'Amazon Comprehend',
  'Amazon Lex', 'Amazon Kendra', 'Amazon Personalize', 'Amazon Forecast',
  'Amazon Textract', 'Amazon CodeWhisperer', 'Amazon Titan',
  
  // Analytics & Data
  'Amazon Athena', 'AWS Glue', 'Amazon EMR', 'Amazon QuickSight',
  'Amazon OpenSearch', 'AWS Data Pipeline', 'Amazon Managed Streaming for Kafka',
  'AWS Lake Formation', 'Amazon DataZone', 'Amazon Clean Rooms',
  
  // Serverless & Event-Driven
  'AWS Lambda', 'Amazon API Gateway', 'AWS Step Functions', 'Amazon EventBridge',
  'AWS AppSync', 'Amazon DynamoDB', 'Aurora Serverless', 'AWS Fargate',
  
  // Container Services
  'Amazon ECS', 'Amazon EKS', 'AWS Fargate', 'Amazon ECR',
  'AWS Copilot', 'AWS App Runner', 'Amazon ECS Anywhere', 'Amazon EKS Anywhere',
  
  // Edge & IoT
  'AWS IoT Core', 'AWS IoT Device Management', 'AWS IoT Analytics',
  'AWS IoT Greengrass', 'Amazon FreeRTOS', 'AWS IoT SiteWise',
  'AWS Wavelength', 'AWS Local Zones', 'AWS Outposts',
  
  // Business Applications
  'Amazon WorkSpaces', 'Amazon AppStream', 'Amazon Connect',
  'Amazon Chime', 'AWS WorkDocs', 'AWS WorkMail', 'Amazon Honeycode',
  'AWS Supply Chain', 'Amazon One Enterprise',
  
  // Latest Services (2023-2024)
  'Amazon Q', 'Amazon Bedrock', 'AWS Application Composer', 'Amazon DataZone',
  'Amazon Supply Chain', 'AWS Clean Rooms', 'Amazon Security Lake',
  'AWS Verified Permissions', 'Amazon One Enterprise', 'AWS SimSpace Weaver'
];

interface GenerateQuestionParams {
  service?: string;
  difficulty: Difficulty;
  language: Language;
  llmConfig?: LLMConfig;
}

export class QuestionGenerator {
  private static instance: QuestionGenerator;
  private generatedQuestions: Map<string, Question[]> = new Map();
  private llmService: LLMService;

  constructor() {
    // Default to Bedrock with Claude Haiku for cost-effectiveness
    const defaultConfig: LLMConfig = {
      provider: 'bedrock',
      model: 'anthropic.claude-3-haiku-20240307-v1:0',
      region: process.env.AWS_REGION || 'ap-south-1'
    };
    this.llmService = LLMService.getInstance(defaultConfig);
  }

  static getInstance(): QuestionGenerator {
    if (!QuestionGenerator.instance) {
      QuestionGenerator.instance = new QuestionGenerator();
    }
    return QuestionGenerator.instance;
  }

  private getPromptForLanguage(language: Language, service: string, difficulty: Difficulty): string {
    const difficultyInstructions = {
      easy: 'simple, basic functionality',
      medium: 'intermediate features and use cases',
      hard: 'advanced features, architecture patterns, and complex scenarios'
    };

    const basePrompts = {
      en: `Create a fun, simple poem riddle about an AWS cloud service for Indian developers and tech enthusiasts.

           LANGUAGE REQUIREMENTS:
           - Use SIMPLE ENGLISH that Indian audiences can easily understand
           - Use common words, avoid complex vocabulary
           - Make it relatable to Indian context where possible
           - Keep sentences short and clear
           
           CONTENT REQUIREMENTS:
           - NEVER mention the service name, abbreviations, or obvious technical terms
           - Focus on ${difficultyInstructions[difficulty]} using simple metaphors
           - Make it challenging but fair - not too difficult to guess
           - The poem should be 4 lines long with simple rhyming
           - Use everyday analogies that Indians can relate to
           - Describe what the service DOES in simple terms
           
           DIFFICULTY LEVEL: ${difficulty}
           - Easy: Very simple language, obvious benefits
           - Medium: Moderate language, some technical concepts
           - Hard: More complex scenarios but still simple language
           
           The AWS service to describe (but never name): ${service}`,
      
      hi: `${service} के बारे में एक मजेदार, तुकबंदी वाली कविता बनाएं जो इसकी कार्यक्षमता का संकेत दे लेकिन सीधे नाम न बताए।
           ${difficultyInstructions[difficulty]} पर ध्यान दें।
           कविता 4 लाइन की होनी चाहिए, गेसिंग गेम के लिए उपयुक्त।
           इसे AWS Community Day के प्रतिभागियों के लिए आकर्षक और यादगार बनाएं।`,
      
      gu: `${service} વિશે એક મજાની, છંદોબદ્ધ કવિતા બનાવો જે તેની કાર્યક્ષમતાનો સંકેત આપે પરંતુ સીધું નામ ન બતાવે।
           ${difficultyInstructions[difficulty]} પર ધ્યાન આપો।
           કવિતા 4 લાઇનની હોવી જોઈએ, ગેસિંગ ગેમ માટે યોગ્ય।
           તેને AWS Community Day ના સહભાગીઓ માટે આકર્ષક અને યાદગાર બનાવો।`
    };

    return basePrompts[language];
  }

  private getExplanationPrompt(language: Language, service: string): string {
    const explanationPrompts = {
      en: `Provide a concise 1-2 sentence explanation of what ${service} does in AWS.`,
      hi: `${service} AWS में क्या करता है, इसका संक्षिप्त 1-2 वाक्य में विवरण दें।`,
      gu: `${service} AWS માં શું કરે છે, તેની સંક્ષિપ્ત 1-2 વાક્યમાં સમજૂતી આપો।`
    };

    return explanationPrompts[language];
  }

  async generateQuestion(params: GenerateQuestionParams): Promise<Question> {
    const { service = this.getRandomService(), difficulty, language, llmConfig } = params;
    
    // Update LLM service if config provided
    if (llmConfig) {
      this.llmService.updateConfig(llmConfig);
    }
    
    try {
      // Generate poem
      const poemMessages: LLMMessage[] = [
        {
          role: 'system',
          content: `You are a friendly poem writer creating simple riddles about AWS services for Indian developers and tech community. Your goal is to make AWS concepts accessible and fun for Indian audiences.

WRITING STYLE FOR INDIAN AUDIENCE:
- Use SIMPLE ENGLISH that everyone can understand
- Use everyday Indian analogies (like trains, markets, festivals, family)
- Keep vocabulary simple and relatable
- Make it educational but fun
- Think like explaining to a friend, not writing complex poetry

FORBIDDEN TECHNICAL WORDS (NEVER USE):
For Lambda: function, serverless, event-driven, trigger, runtime, execution
For S3: bucket, storage, object, file, data lake, repository
For EC2: instance, virtual machine, VM, compute, server, host  
For RDS: database, DB, relational, SQL, MySQL, PostgreSQL
For DynamoDB: NoSQL, database, table, key-value, document
For CloudFront: CDN, content delivery, cache, edge, distribution
For VPC: network, virtual private cloud, subnet, security group
For IAM: identity, access, user, role, permission, policy
For API Gateway: API, gateway, REST, HTTP, endpoint, proxy
For CloudWatch: monitoring, metrics, logs, alerts, dashboard
For Route 53: DNS, domain, routing, health check
For SQS: queue, message, FIFO, dead letter
For SNS: notification, topic, publish, subscribe, message

INDIAN-FRIENDLY APPROACH:
- Use simple analogies like: railway station, post office, security guard, warehouse
- Describe benefits in simple terms: "keeps safe", "works fast", "saves money"
- Use familiar concepts: "like a helpful assistant", "works like magic", "smart helper"
- Make it sound conversational and friendly
- End with curiosity but keep it approachable

GOOD EXAMPLES FOR INDIAN CONTEXT:
Instead of "stores files safely" → "Keeps your things safe like a trusted friend"
Instead of "scales automatically" → "Grows bigger or smaller as needed"
Instead of "processes events" → "Wakes up when you call it"
Instead of "global delivery" → "Sends things everywhere very fast"`
        },
        {
          role: 'user',
          content: this.getPromptForLanguage(language, service, difficulty)
        }
      ];

      const poemResponse = await this.llmService.generateResponse(poemMessages, {
        maxTokens: 200,
        temperature: 0.8
      });

      // Generate explanation
      const explanationMessages: LLMMessage[] = [
        {
          role: 'system',
          content: 'You are an AWS expert providing clear, concise explanations of AWS services.'
        },
        {
          role: 'user',
          content: this.getExplanationPrompt(language, service)
        }
      ];

      const explanationResponse = await this.llmService.generateResponse(explanationMessages, {
        maxTokens: 100,
        temperature: 0.3
      });

      const poem = poemResponse.content.trim();
      const explanation = explanationResponse.content.trim();

      // Generate 4 multiple choice options
      const options = this.generateMultipleChoiceOptions(service);
      
      // Generate a stable ID that won't cause hydration issues
      const stableId = `${service}-${difficulty}-${language}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const question: Question = {
        id: stableId,
        service,
        difficulty,
        language,
        poem,
        explanation,
        options,
        correctAnswer: service
      };

      // Cache the generated question
      const cacheKey = `${difficulty}-${language}`;
      if (!this.generatedQuestions.has(cacheKey)) {
        this.generatedQuestions.set(cacheKey, []);
      }
      this.generatedQuestions.get(cacheKey)!.push(question);

      return question;
    } catch (error) {
      console.error('❌ Failed to generate question with LLM:', error);
      throw new Error('LLM question generation failed. Please check your API configuration and try again.');
    }
  }

  async generateMultipleQuestions(
    count: number,
    difficulty: Difficulty,
    language: Language,
    llmConfig?: LLMConfig
  ): Promise<Question[]> {
    const questions: Question[] = [];
    const services = this.getRandomServices(count);

    const promises = services.map(service =>
      this.generateQuestion({ service, difficulty, language, llmConfig })
    );

    try {
      const results = await Promise.all(promises);
      questions.push(...results);
    } catch (error) {
      console.error('Error generating multiple questions:', error);
      // Return partial results if some failed
      const settledResults = await Promise.allSettled(promises);
      settledResults.forEach(result => {
        if (result.status === 'fulfilled') {
          questions.push(result.value);
        }
      });
    }

    return questions;
  }

  private getRandomService(): string {
    return AWS_SERVICES[Math.floor(Math.random() * AWS_SERVICES.length)];
  }

  private getRandomServices(count: number): string[] {
    const shuffled = [...AWS_SERVICES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, AWS_SERVICES.length));
  }

  getCachedQuestions(difficulty: Difficulty, language: Language): Question[] {
    const cacheKey = `${difficulty}-${language}`;
    return this.generatedQuestions.get(cacheKey) || [];
  }

  clearCache(): void {
    this.generatedQuestions.clear();
  }

  // Switch between LLM providers
  switchProvider(config: LLMConfig): void {
    this.llmService.updateConfig(config);
  }

  // Test LLM connection
  async testLLMConnection(): Promise<boolean> {
    return this.llmService.testConnection();
  }

  // Get current LLM config
  getLLMConfig(): LLMConfig {
    return this.llmService.getConfig();
  }

  // Get available AWS services
  getAvailableServices(): string[] {
    return [...AWS_SERVICES];
  }

  // Generate 4 multiple choice options including the correct answer
  private generateMultipleChoiceOptions(correctService: string): string[] {
    // Get 3 deterministic wrong answers based on service name
    const availableServices = AWS_SERVICES.filter(service => service !== correctService);
    const serviceHash = correctService.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Use hash to select consistent wrong answers
    const wrongAnswers: string[] = [];
    for (let i = 0; i < 3 && i < availableServices.length; i++) {
      const index = Math.abs(serviceHash + i) % availableServices.length;
      if (!wrongAnswers.includes(availableServices[index])) {
        wrongAnswers.push(availableServices[index]);
      }
    }
    
    // Ensure we have 3 wrong answers
    while (wrongAnswers.length < 3 && wrongAnswers.length < availableServices.length) {
      const remaining = availableServices.filter(s => !wrongAnswers.includes(s));
      if (remaining.length > 0) {
        wrongAnswers.push(remaining[0]);
      } else {
        break;
      }
    }
    
    // Create deterministic order: correct answer first, then wrong answers
    return [correctService, ...wrongAnswers];
  }

  // Generate a single question for a specific service
  async generateQuestionForService(
    service: string,
    difficulty: Difficulty,
    language: Language,
    llmConfig?: LLMConfig
  ): Promise<Question> {
    if (!AWS_SERVICES.includes(service)) {
      throw new Error(`Unknown AWS service: ${service}`);
    }
    return this.generateQuestion({ service, difficulty, language, llmConfig });
  }
}

export const questionGenerator = QuestionGenerator.getInstance();
