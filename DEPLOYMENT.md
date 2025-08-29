# 🚀 GuessOps Deployment Guide

## Quick Deployment (Single Command)

### Option 1: Using npm script
```bash
npm run deploy
```

### Option 2: Using shell script directly
```bash
./deploy.sh
```

### Option 3: With custom commit message
```bash
./deploy.sh "Added new AWS services and UI improvements"
```

## What the deployment script does:

1. ✅ **Checks dependencies** - Installs/updates if needed
2. ✅ **Runs linting** - Validates code quality
3. ✅ **Builds application** - Creates production build
4. ✅ **Commits changes** - Adds and commits all changes
5. ✅ **Pushes to git** - Uploads to remote repository
6. ✅ **Deploys to AWS** - Uses Amplify CLI if available

## AWS Amplify Setup (One-time)

### Prerequisites
1. Install AWS CLI:
   ```bash
   curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
   sudo installer -pkg AWSCLIV2.pkg -target /
   ```

2. Install Amplify CLI:
   ```bash
   npm install -g @aws-amplify/cli
   ```

3. Configure AWS credentials:
   ```bash
   aws configure
   ```

### First-time Amplify Setup
1. Initialize Amplify in your project:
   ```bash
   amplify init
   ```

2. Add hosting:
   ```bash
   amplify add hosting
   ```
   - Choose: **Hosting with Amplify Console**
   - Choose: **Manual deployment**

3. Publish your app:
   ```bash
   amplify publish
   ```

## Alternative: AWS Amplify Console (No CLI needed)

### Method 1: Git-based Deployment
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **New app** → **Host web app**
3. Connect your Git repository (GitHub, GitLab, etc.)
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Base directory**: `/`
   - **Artifact directory**: `.next`
5. Deploy!

### Method 2: Manual Deployment
1. Build locally: `npm run build`
2. Zip the `.next` folder
3. Go to Amplify Console → **Deploy** → **Drag and drop**
4. Upload your zip file

## Environment Variables

Set these in AWS Amplify Console → App Settings → Environment Variables:

```bash
# Authentication
MODERATOR_USERNAME=your_username
MODERATOR_PASSWORD=your_password

# AWS Services (Optional - uses IAM roles in production)
AWS_REGION=us-east-1

# OpenAI Fallback (Optional)
OPENAI_API_KEY=your_openai_key
```

## Troubleshooting

### Build Errors
- Run `npm run build` locally to test
- Check Node.js version (should be 18+)
- Verify all dependencies are installed

### Deployment Fails
- Check AWS credentials: `aws sts get-caller-identity`
- Verify Amplify CLI is installed: `amplify --version`
- Check git repository is clean: `git status`

### Environment Issues
- Ensure all required environment variables are set
- Check IAM permissions for AWS services
- Verify region settings

## Quick Commands Reference

```bash
# Development
npm run dev                    # Start development server

# Deployment
npm run deploy                 # Full deployment
npm run deploy:quick          # Quick deployment with default message
./deploy.sh "Custom message"  # Deployment with custom commit message

# Manual steps
npm run build                 # Build only
amplify publish              # Deploy to Amplify only
git push origin main         # Push to git only
```

## Production URLs

After deployment, your app will be available at:
- **Amplify URL**: `https://main.d1234567890.amplifyapp.com`
- **Custom Domain**: Configure in Amplify Console

## Security Notes

- Never commit sensitive keys to git
- Use AWS Systems Manager Parameter Store for secrets
- Enable HTTPS-only access
- Configure proper CORS settings
- Use IAM roles instead of access keys when possible

---

🎮 **Ready to deploy GuessOps? Just run `npm run deploy`!**
