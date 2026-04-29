# CalmOS - AI Emotional Wellness Assistant

CalmOS is a private, empathetic emotional wellness companion built with Next.js 15, Genkit, and ShadCN UI. It helps users manage intense emotions through breathing exercises, reflections, and AI-powered counseling.

## Key Features

- **Breathing Guide**: Interactive visual breathing exercises to regain center.
- **Dynamic Reflections**: Log emotional triggers and reactions privately.
- **AI Insights**: Personalized analysis of emotional patterns using a unified AI router.
- **Local-First Privacy**: All logs, chats, and profile data are stored exclusively in your browser's IndexedDB.
- **AI Fallback System**: Reliable AI responses with automatic fallback between OpenRouter and Groq.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **AI Engine**: Genkit 1.x
- **Database**: IndexedDB (Local-first)
- **Icons**: Lucide React
- **Charts**: Recharts

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root and add your API keys:
   ```env
   AI_PROVIDER=openrouter
   OPENROUTER_API_KEY=your_openrouter_key
   GROQ_API_KEY=your_groq_key
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Documentation

For more detailed information, see the `docs/` folder:
- [AI Routing & Fallback](./docs/ai-routing.md)
- [Database Schema](./docs/database-schema.md)
- [Getting Started](./docs/getting-started.md)
