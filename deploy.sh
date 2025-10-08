#!/bin/bash

# Smart Claims Platform Deployment Script

echo "🚀 Deploying Smart Claims Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Generate synthetic data
echo "📊 Generating synthetic test data..."
python generate_synthetic_data.py

# Build frontend
echo "🔨 Building frontend..."
cd ..
npm run build

echo "✅ Deployment preparation complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && python app.py"
echo "2. Frontend: npm start"
echo ""
echo "Make sure to:"
echo "- Configure Firebase in src/firebase/config.js"
echo "- Add Firebase service account key as backend/firebase-service-account.json"
echo "- Set up Firestore database in Firebase console"
