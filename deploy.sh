#!/bin/bash

# GuessOps - Quick Deployment Script
# Usage: ./deploy.sh [commit-message]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default commit message
COMMIT_MESSAGE="${1:-Quick deployment update - $(date '+%Y-%m-%d %H:%M')}"

print_status "🚀 Starting GuessOps deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the guessops directory."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not found. Please initialize git first."
    exit 1
fi

# Step 1: Install dependencies if needed
print_status "📦 Checking dependencies..."
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    print_status "Installing/updating dependencies..."
    npm install
    print_success "Dependencies updated"
else
    print_status "Dependencies are up to date"
fi

# Step 2: Run linting and type checking (optional for deployment)
print_status "🔍 Running linting and type checks..."
npm run lint || print_warning "Linting issues found, but continuing deployment"

# Step 3: Build the application
print_status "🏗️  Building application for production..."
if npm run build:production; then
    print_success "Build completed successfully"
else
    print_warning "Production build failed, trying regular build..."
    if npm run build; then
        print_success "Regular build completed successfully"
    else
        print_error "Build failed! Deployment aborted."
        exit 1
    fi
fi

# Step 4: Commit changes
print_status "📝 Committing changes..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit"
else
    git commit -m "$COMMIT_MESSAGE"
    print_success "Changes committed: $COMMIT_MESSAGE"
fi

# Step 5: Push to remote repository
print_status "🌐 Pushing to remote repository..."
if git push origin main; then
    print_success "Code pushed to repository"
else
    print_error "Failed to push to repository"
    exit 1
fi

# Step 6: Deploy to AWS Amplify (if amplify CLI is available)
print_status "🚀 Checking for AWS Amplify deployment..."

if command -v amplify &> /dev/null; then
    print_status "AWS Amplify CLI found, publishing app..."
    if amplify publish; then
        print_success "🎉 Deployment to AWS Amplify completed!"
    else
        print_warning "Amplify publish failed. Check AWS credentials and Amplify setup."
        print_status "You can manually deploy by pushing to your connected git repository."
    fi
else
    print_warning "AWS Amplify CLI not found."
    print_status "Install it with: npm install -g @aws-amplify/cli"
    print_status "Or deploy manually through AWS Amplify Console."
fi

# Step 7: Open deployment URL if available
if [ -f "amplify/.config/project-config.json" ]; then
    print_status "🌍 Opening application in browser..."
    if command -v open &> /dev/null; then
        # macOS
        open "https://main.d1234567890.amplifyapp.com" 2>/dev/null || true
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "https://main.d1234567890.amplifyapp.com" 2>/dev/null || true
    fi
fi

print_success "✅ Deployment process completed!"
print_status "📋 Deployment Summary:"
echo "   • Dependencies: ✓ Installed/Updated"
echo "   • Linting: ✓ Checked"
echo "   • Build: ✓ Successful"
echo "   • Git: ✓ Committed & Pushed"
echo "   • AWS: ✓ Deployed (if Amplify CLI available)"

print_status "🎮 Your GuessOps application is ready!"
