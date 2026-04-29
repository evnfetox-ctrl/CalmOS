# Getting Started with CalmOS Development

Follow these steps to set up the development environment for CalmOS.

## Prerequisites

- Node.js 18.x or higher
- An API key from [OpenRouter](https://openrouter.ai/) or [Groq](https://groq.com/)

## Initial Setup

1. **Clone the project** to your local environment.
2. **Install the dependencies**:
   ```bash
   npm install
   ```
3. **Set up your environment variables**:
   Create a file named `.env` and fill in your keys:
   ```env
   AI_PROVIDER=openrouter
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   GROQ_API_KEY=gsk_your-key-here
   ```

## Development Workflow

### Next.js App
Run the main application:
```bash
npm run dev
```
The app will be available at `http://localhost:9002`.

### Genkit Developer UI
To inspect and test Genkit flows in isolation:
```bash
npm run genkit:dev
```
This opens the Genkit UI where you can trigger flows manually with custom inputs.

## Key Directories

- `src/app`: Next.js pages and layouts.
- `src/ai/flows`: Genkit logic for AI processing.
- `src/lib`: Core utilities including the Database (IndexedDB) and AI Router.
- `src/components/ui`: Reusable UI components powered by ShadCN.
