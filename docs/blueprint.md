# **App Name**: CalmOS

## Core Features:

- Emotion Check-in: Allows users to select their current emotional state (Angry, Neutral, Calm) to initiate tailored support.
- AI-Powered Real-time Calming Response: Provides instant, empathetic AI-generated guidance and a simple calming action based on the user's reported anger trigger, integrated with a breathing exercise animation.
- Emotional Reflection Logging: Enables users to record triggers and reactions for past emotional events, storing data locally in IndexedDB.
- Personalized Insight Generation: Analyzes local IndexedDB data using an AI tool to summarize emotional patterns and offer two short insights with one simple improvement suggestion.
- Interactive AI Chat Counselor: Offers a continuous, supportive chat interface where users can interact with an AI counselor for emotional support and guidance in an iMessage-style interface.
- Robust AI Provider Routing & Fallback: Manages dynamic switching between OpenRouter and Groq AI APIs with automatic fallback for enhanced reliability and performance.
- Local IndexedDB Data Management: Securely stores user-specific emotional logs and patterns directly within the browser for privacy and personalized insights, using 'idb' library.

## Style Guidelines:

- Primary color: A vibrant, clear blue (#007AFF) representing clarity, modern functionality, and Apple's iconic digital interface. (HSL: 213, 100%, 50%)
- Background color: A very light, desaturated grey-blue (#F5F5F7) providing an expansive and calm canvas, aligned with minimalist aesthetics and heavy white space design. (HSL: 210, 17%, 97%)
- Accent color: A soft, desaturated blue-green (#9ECBCD) for gentle highlights and secondary interactive elements, contributing to a calm and inviting user experience. (HSL: 183, 30%, 70%)
- Font selection: System font family `'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'` for a native, clean, and highly legible user experience. Note: currently only Google Fonts are supported.
- Mobile-first design with a fixed bottom navigation bar (Home, Reflect, Insights, Chat) for intuitive access and smooth transitions between core app sections.
- Consistent use of generous white space and prominent rounded corners (16-24px radius) on all interactive elements, cards, and bubbles to create an inviting, clutter-free, and premium Apple-inspired aesthetic.
- Smooth fade transitions for seamless page navigation and a gentle, looping scale animation for the breathing exercise (scale from 1 to 1.2 and back over 4 seconds) to promote tranquility and focus.
- Large, touch-friendly buttons for core interactions (e.g., emotion check-in) incorporating emotionally relevant emojis/icons (😡, 😐, 🙂) to enhance clarity and user engagement.