#!/bin/bash

echo "🚀 Setting up Corporate Card Platform..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can use: mongod --dbpath /path/to/data"
    echo "   Or install MongoDB Atlas and update MONGODB_URL in backend/.env"
fi

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file (update if needed)"
fi

# Install Python dependencies
pip install -r requirements.txt

# Seed database
echo ""
echo "🌱 Seeding database..."
python seed_data.py

cd ..

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  uvicorn app.main:app --reload --port 8000"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo "Login with: admin@company.com / admin123"
