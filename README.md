# Interview Sarthi AI

Practice Smarter. Interview Better.

A production-quality, hackathon-winning AI Interview Preparation Platform powered by Gemini 2.5 Flash. It supports 23+ Indian languages, real-time voice interviews, and detailed STAR method evaluations.

## Features
- **23+ Indian Languages**: Interview naturally in Hindi, Bengali, Tamil, Telugu, and more.
- **Adaptive AI Engine**: Powered by Gemini 2.5 Flash, it doesn't just ask static questions. It listens, evaluates, and generates dynamic follow-ups.
- **Voice Mode**: Real-time Web Speech API integration for a face-to-face feel.
- **Resume Tailoring**: Upload your resume and get grilled on exactly what you claimed to know.
- **Actionable Feedback**: Exhaustive PDF-ready reports with Radar charts showing strengths, missing concepts, and a personalized learning roadmap.
- **Premium SaaS UI**: Built with React 19, TailwindCSS, ShadCN UI, and Framer Motion for a stunning "WOW" factor.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, ShadCN UI, Framer Motion, Zustand, React Query, Recharts.
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose.
- **AI**: Google Gemini 2.5 Flash API.
- **Auth**: JWT & Firebase Auth structure.

## Setup Instructions

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your details:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
4. Run the server: `npm run dev` (Starts on http://localhost:5000)

### 2. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Run the development server: `npm run dev` (Starts on http://localhost:5173)

## Deployment
- **Frontend**: Ready for Vercel (`vercel.json` included) or Netlify (`netlify.toml` included).
- **Backend**: Ready for Render or Heroku.
