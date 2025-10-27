#!/bin/bash

# WiFi Portal - Frontend Startup Script

echo "🚀 Starting WiFi Portal Frontend..."
echo "==================================="

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  WARNING: Node.js version $NODE_VERSION detected"
    echo "   Vite 7 requires Node.js 20.19+ or 22.12+"
    echo ""
    echo "   Please upgrade Node.js:"
    echo "   - Using nvm: nvm install 20 && nvm use 20"
    echo "   - Or download from: https://nodejs.org/"
    echo ""
    exit 1
fi

# Navigate to client directory
cd client

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start Vite dev server
echo "✅ Starting Vite dev server..."
echo "==================================="
npm run dev

