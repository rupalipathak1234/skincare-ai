# SkinCare AI

A modern full-stack web application that helps users understand their probable skin type and receive personalized skincare recommendations.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Service**: Python, FastAPI

## Project Structure
- `/frontend`: React UI
- `/backend`: Express API server
- `/ai-service`: FastAPI microservice

## Local Setup

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. AI Service
Requires Python 3.
```bash
cd ai-service
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Current Development Phase
Phase 1: Foundation & Setup (In Progress)
