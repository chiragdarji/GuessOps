#!/bin/bash

# GuessOps - Local Testing Script
# Usage: ./test-local.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_status "🧪 Testing GuessOps locally..."

# Check dependencies
print_status "📦 Installing dependencies..."
npm install

# Build test
print_status "🏗️  Testing production build..."
npm run build:production

# Start server
print_status "🚀 Starting local server..."
print_success "✅ Build successful! Starting development server..."

print_warning "🌐 Opening http://localhost:3000"
print_status "🎮 Test your GuessOps application!"
print_status "📋 Test checklist:"
echo "   • Login with moderator credentials"
echo "   • Generate a question"
echo "   • Test voice playback"  
echo "   • Test multiple choice options"
echo "   • Test timer functionality"
echo "   • Test answer reveal"

# Start dev server
npm run dev
