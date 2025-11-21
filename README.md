# Corporate Card Platform MVP

A corporate expense management platform for virtual card creation and tracking.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Python FastAPI + MongoDB
- **Authentication**: JWT

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and update MONGODB_URL if needed

# Run the backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at: http://localhost:8000

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Frontend will run at: http://localhost:3000

### 3. Demo Login

Use these credentials to log in:
- **Email**: admin@company.com
- **Password**: admin123

## Features

- ✅ JWT Authentication
- ✅ Virtual card creation (admin only)
- ✅ Multiple expense limits (per transaction, daily, weekly, monthly)
- ✅ Expense category restrictions
- ✅ Instant card freeze/unfreeze
- ✅ Dashboard with stats
- ✅ Dark theme with lime green accents

## API Documentation

Once the backend is running, visit:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # State management
│   ├── types/          # TypeScript types
│   └── utils/          # Helper functions
└── package.json

backend/
├── app/
│   ├── api/            # API routes
│   ├── core/           # Config, database, security
│   ├── models/         # Database models
│   └── schemas/        # Pydantic schemas
└── requirements.txt
```
