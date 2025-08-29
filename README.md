# 🎮 GuessOps - AWS Community Gaming Arena

A modern, interactive AWS service guessing game designed for **AWS User Groups** and community events. Features dynamic question generation, voice narration, and professional gaming UI.

## ✨ Features

- 🤖 **AI-Powered Questions**: AWS Bedrock & OpenAI generate unique riddles
- 🗣️ **Voice Narration**: AWS Polly with Indian English voices  
- 🎯 **Smart Difficulty**: Automatic Easy/Medium/Hard selection
- 🎨 **Gaming UI**: Professional TV-friendly design with neon themes
- ⏰ **Interactive Timer**: Configurable countdown with sound effects
- 🔐 **Moderator Panel**: Secure authentication and game controls
- 📱 **Responsive**: Works on all devices and screen sizes
- 🏢 **AWS UG Branding**: Customized for AWS User Groups Vadodara

## 🚀 **Single-Command Deployment**

```bash
# Deploy to AWS (after setup)
npm run deploy

# Or with custom commit message
./deploy.sh "Updated game with new features"
```

## ⚡ Quick Start

### 1. **Local Development**
```bash
git clone <repository-url>
cd guessops
npm install
npm run dev
```

### 2. **Production Deployment**
```bash
# Test locally first
./test-local.sh

# Deploy to AWS
npm run deploy
```

### 3. **Environment Setup**
Copy `env.template` to `.env.local`:
```bash
MODERATOR_USERNAME=admin
MODERATOR_PASSWORD=SecurePassword123
AWS_REGION=us-east-1
OPENAI_API_KEY=sk-optional-fallback-key
```

## 🛠️ **Development Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (strict) |
| `npm run build:production` | Build for production (deploy-ready) |
| `npm run deploy` | Full deployment pipeline |
| `npm run deploy:quick` | Quick deployment |
| `./test-local.sh` | Test application locally |
| `npm run lint` | Run code linting |

## 🏗️ **Architecture**

```
GuessOps Application
├── 🎮 Frontend (Next.js 15 + React 19)
│   ├── Gaming UI Components
│   ├── Timer & Sound Effects  
│   └── Responsive Design
├── 🔧 Backend API (Next.js API Routes)
│   ├── Question Generation
│   ├── Text-to-Speech
│   └── Authentication
├── 🤖 AI Services
│   ├── AWS Bedrock (Claude)
│   └── OpenAI (Fallback)
├── 🗣️ Voice Services
│   ├── AWS Polly (Primary)
│   └── Web Speech API (Fallback)
└── ☁️ AWS Deployment
    ├── Amplify Hosting
    ├── Systems Manager (Secrets)
    └── IAM Roles
```

## 🎯 **Game Features**

### **Question System**
- 🎲 **151+ AWS Services** in database
- 🧠 **AI-Generated Riddles** in simple English
- 🇮🇳 **Indian-Friendly Content** with local analogies
- 🎚️ **Auto-Difficulty Selection** (40% Easy, 35% Medium, 25% Hard)

### **Interactive Elements**
- 🔊 **Voice Narration** of questions
- ⏱️ **Configurable Timer** (default: 30 seconds)  
- 🎵 **Sound Effects** for timeout
- 🎨 **Multiple Choice Options** (A, B, C, D)
- ✨ **Smooth Animations** and transitions

### **Gaming UI**
- 🌟 **Neon Color Scheme** (Orange/Blue AWS theme)
- 💻 **TV-Optimized** for large displays
- 📱 **Mobile-Responsive** for all devices
- 🏷️ **Difficulty Badges** with color coding
- 🎮 **Professional Gaming Aesthetics**

## 📦 **Tech Stack**

### **Frontend**
- ⚛️ **Next.js 15** (App Router)
- ⚛️ **React 19** (Latest features)
- 📘 **TypeScript** (Type safety)
- 🎨 **Tailwind CSS** (Styling)
- 🎬 **Framer Motion** (Animations)

### **Backend & AI**
- 🔗 **Next.js API Routes**
- 🤖 **AWS Bedrock** (Claude LLM)
- 🧠 **OpenAI GPT** (Fallback)
- 🗣️ **AWS Polly** (Text-to-Speech)
- ☁️ **AWS SDK v3**

### **Deployment**
- 🚀 **AWS Amplify** (Hosting)
- 🔐 **AWS Systems Manager** (Secrets)
- 👤 **IAM Roles** (Security)
- 📈 **CloudWatch** (Monitoring)

## 🎪 **Perfect for AWS Events**

- **AWS Community Days**
- **User Group Meetups** 
- **Developer Conferences**
- **Training Sessions**
- **Team Building Events**

## 🔧 **AWS Services Used**

| Service | Purpose |
|---------|---------|
| **AWS Amplify** | Web hosting and CI/CD |
| **AWS Bedrock** | AI question generation |
| **AWS Polly** | Text-to-speech |
| **Systems Manager** | Parameter store for secrets |
| **IAM** | Authentication and permissions |
| **CloudWatch** | Logging and monitoring |

## 📚 **Documentation**

- 📖 [**Quick Deploy Guide**](./QUICK_DEPLOY.md) - Single command deployment
- 🚀 [**Deployment Guide**](./DEPLOYMENT.md) - Detailed AWS setup  
- 🔧 [**Environment Setup**](./env.template) - Configuration template

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push to branch: `git push origin feature/amazing-feature`  
5. Submit pull request

## 📄 **License**

MIT License - Built for the AWS Community with ❤️

---

## 🎯 **Ready to Deploy?**

1. **Setup Git**: Connect to your repository
2. **Configure AWS**: Set up Amplify hosting
3. **Deploy**: Run `npm run deploy`

🚀 **Your AWS Community Gaming Arena awaits!** (Deployment Fixed)