#!/bin/bash

# WiFi Portal - Backend Startup Script

echo "🚀 Starting WiFi Portal Backend..."
echo "=================================="

# Navigate to server directory
cd server

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt
pip install flask-bcrypt

# Check if database exists
if [ ! -f "wifi_portal.db" ]; then
    echo "🗄️  Database not found. It will be created automatically."
fi

# Start Flask server
echo "✅ Starting Flask server on http://127.0.0.1:5000"
echo "=================================="
python3 app.py

