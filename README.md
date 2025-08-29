# 🎯 GuessOps - AWS Cloud Game Booth

An interactive, poem-based guessing game for AWS Community Day events, powered by AI-generated riddles using OpenAI and AWS Bedrock.

## 🚀 Features

- **AI-Powered Question Generation**: Generate AWS service riddles using OpenAI or AWS Bedrock
- **Multi-Language Support**: English, Hindi, and Gujarati
- **Multiple Difficulty Levels**: Easy, Medium, and Hard
- **Flexible LLM Integration**: Switch between OpenAI and AWS Bedrock models
- **TV-Friendly UI**: Designed for large screens and booth presentations
- **Offline Fallback**: Static question bank for when APIs are unavailable

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **LLM Integration**: OpenAI API, AWS Bedrock
- **Deployment**: AWS Amplify (planned)
- **Authentication**: AWS Cognito (planned)
- **Database**: DynamoDB (planned)

## 📋 Prerequisites

- Node.js 18+ and npm
- Either:
  - OpenAI API key, OR
  - AWS credentials with Bedrock access

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd guessops
npm install
```

### 2. Secure Configuration Setup

GuessOps uses AWS Systems Manager Parameter Store for secure key storage.

**Option A: Automated Setup (Recommended)**
```bash
node setup-secrets.js
```
This interactive script will guide you through storing your API keys securely in AWS Parameter Store.

**Option B: Manual Parameter Store Setup**
```bash
# For OpenAI
aws ssm put-parameter \
  --name "/guessops/openai-api-key" \
  --value "your-openai-api-key" \
  --type "SecureString" \
  --description "OpenAI API key for GuessOps"

aws ssm put-parameter \
  --name "/guessops/llm-provider" \
  --value "openai" \
  --type "String"

# For AWS Bedrock
aws ssm put-parameter \
  --name "/guessops/llm-provider" \
  --value "bedrock" \
  --type "String"

aws ssm put-parameter \
  --name "/guessops/bedrock-region" \
  --value "us-west-2" \
  --type "String"
```

**Option C: Environment Variables (Development Only)**
```env
# Create .env.local for development
OPENAI_API_KEY=your_openai_api_key_here
AWS_REGION=us-west-2
NEXT_PUBLIC_LLM_PROVIDER=bedrock
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎮 Usage

### Testing LLM Integration

1. Visit the homepage to see the LLM Test Panel
2. Select your preferred LLM provider (Bedrock or OpenAI)
3. Choose model, difficulty, and language
4. Click "Generate Question" to test the integration

### API Endpoints

- `POST /api/generate-question` - Generate a single question
- `POST /api/generate-questions` - Generate multiple questions
- `GET /api/llm-status` - Check LLM connection status

### Example API Usage

```javascript
// Generate a single question
const response = await fetch('/api/generate-question', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    difficulty: 'easy',
    language: 'en',
    llmConfig: {
      provider: 'bedrock',
      model: 'anthropic.claude-3-haiku-20240307-v1:0'
    }
  })
});

const { question } = await response.json();
```

## 🌟 Available LLM Models

### AWS Bedrock Models
- `anthropic.claude-3-haiku-20240307-v1:0` - Claude 3 Haiku (Fast & Cost-effective)
- `anthropic.claude-3-sonnet-20240229-v1:0` - Claude 3 Sonnet (Balanced)
- `anthropic.claude-3-opus-20240229-v1:0` - Claude 3 Opus (Most Capable)
- `amazon.titan-text-express-v1` - Amazon Titan Text Express

### OpenAI Models
- `gpt-4o-mini` - GPT-4o Mini (Fast & Cost-effective)
- `gpt-4o` - GPT-4o (Most Capable)
- `gpt-3.5-turbo` - GPT-3.5 Turbo

## 🏗️ Project Structure

```
guessops/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── generate-question/
│   │   │   ├── generate-questions/
│   │   │   └── llm-status/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── LLMTestPanel.tsx     # Test interface
│   ├── data/
│   │   └── questions.json       # Static question bank
│   ├── hooks/
│   │   └── useQuestionGenerator.ts
│   ├── services/
│   │   ├── llmService.ts        # LLM abstraction layer
│   │   └── questionGenerator.ts # Question generation logic
│   └── types/
│       └── index.ts             # TypeScript definitions
├── env.template                 # Environment variables template
└── README.md
```

## 🚀 Deployment to AWS

### Using AWS Amplify

1. **Initialize Amplify:**
```bash
npm install -g @aws-amplify/cli
amplify configure
amplify init
```

2. **Add Hosting:**
```bash
amplify add hosting
amplify publish
```

3. **Environment Variables:**
Set environment variables in the Amplify Console:
- AWS credentials for Bedrock access
- OpenAI API key (if using OpenAI)

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred hosting platform
3. Configure environment variables in your hosting provider

## 🎯 Game Features (Coming Soon)

- **TV-Friendly Game Interface**: Large fonts, high contrast, simple controls
- **Timer System**: Configurable countdown for each question
- **Text-to-Speech**: Auto-narration of poems in multiple languages
- **Fuzzy Answer Detection**: Smart guess matching system
- **Moderator Controls**: Next, Reveal, Skip, difficulty/language toggles
- **Offline Mode**: Fallback to static questions when APIs are unavailable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **LLM API Errors**: Check your API keys and credentials
2. **AWS Bedrock Access**: Ensure your AWS account has Bedrock access enabled
3. **CORS Issues**: Make sure API routes are properly configured
4. **Environment Variables**: Verify all required environment variables are set

### Getting Help

- Check the browser console for error messages
- Use the LLM Test Panel to verify API connectivity
- Review the API endpoint responses for debugging information

## 🎪 Event Usage

This application is designed for AWS Community Day events where:
- Visitors approach the booth
- A moderator runs the game on a large TV/screen
- Questions are generated dynamically or from the static bank
- The game creates engagement and teaches AWS services through fun riddles

Perfect for booth activities, workshops, and community events! 🎉