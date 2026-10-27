# SheCare — AI-Powered Healthcare Companion 💗

A beautiful, fully functional healthcare website with an AI-powered assistant, built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🏠 **Dashboard** — Personalized health overview with stats and reminders
- 🤖 **AI Health Assistant** — Conversational AI supporting English, Hindi, and Hinglish
- 💬 **Floating AI Chat** — Quick-access chat widget on all pages
- 📄 **Medical Report Analyzer** — Upload and understand medical reports
- 🔒 **Medical Vault** — Secure health records storage
- 💊 **Prescriptions** — Medication management
- ⏰ **Pill O'Clock** — Medicine reminders and tracking
- 📅 **My Cycle** — Menstrual cycle tracking
- 👩‍⚕️ **Talk to Doctor** — Doctor search and appointment booking
- 🚨 **Emergency SOS** — Quick emergency access
- ⚙️ **Settings** — Profile, notifications, and privacy controls
- 🌙 **Light/Dark Mode** — Animated theme switching with system preference support

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS v4
- **Backend:** Express.js (secure API proxy)
- **AI:** NVIDIA API (minimaxai/minimax-m3.1-flash)
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- NVIDIA API key ([Get one here](https://build.nvidia.com/))

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your NVIDIA API key to .env
# NVIDIA_API_KEY=your_actual_key_here
```

### Development

**Frontend only (AI uses fallback responses):**
```bash
npm run dev
```

**Full stack (with real AI responses):**
```bash
# Terminal 1: Start backend
node server/index.js

# Terminal 2: Start frontend
npm run dev
```

### Production Build

```bash
# Build frontend
npm run build

# Start production server (serves both frontend + API)
NODE_ENV=production node server/index.js
```

## Security

### API Key Protection

The NVIDIA API key is **NEVER** exposed to the frontend:

1. ✅ Key is stored in `.env` (server-side only)
2. ✅ `.env` is in `.gitignore`
3. ✅ Frontend calls `/api/chat` on the backend
4. ✅ Backend proxies requests to NVIDIA API
5. ✅ No API key in frontend bundle, source code, or logs

### Setup Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Add your `NVIDIA_API_KEY` to `.env`
- [ ] Verify `.env` is in `.gitignore`
- [ ] Never commit `.env` to version control
- [ ] Use deployment secrets (e.g., Vercel env vars, AWS Secrets Manager) in production
- [ ] Set `NODE_ENV=production` in production
- [ ] Set `FRONTEND_URL` for CORS in production

## API Endpoints

### POST `/api/chat`

Secure proxy to NVIDIA AI API.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "I have a headache" }
  ],
  "mode": "simple",
  "language": "english",
  "stream": true
}
```

**Response (SSE stream):**
```
data: {"content": "I'm sorry to hear..."}
data: {"content": "Here are some tips..."}
data: [DONE]
```

### GET `/api/health`

Health check endpoint.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NVIDIA_API_KEY` | Yes | Your NVIDIA API key |
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | Environment (development/production) |
| `FRONTEND_URL` | No | Frontend URL for CORS (production) |

## AI Assistant Behavior

The AI assistant is designed to:
- ✅ Answer general health questions
- ✅ Explain medical reports in simple language
- ✅ Provide medicine reminder guidance
- ✅ Help navigate the app
- ✅ Support English, Hindi, and Hinglish
- ❌ NOT diagnose conditions
- ❌ NOT prescribe medicines
- ✅ Always encourage consulting healthcare professionals
- ✅ Direct to emergency services for urgent symptoms

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React Frontend │────▶│  Express Backend  │────▶│  NVIDIA AI API  │
│   (Vite + TS)    │     │  (server/index.js)│     │  (minimax-m3.1) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌──────────┐
                        │  .env    │
                        │ API Key  │
                        └──────────┘
```

## License

MIT
