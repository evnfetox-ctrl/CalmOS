# Database Schema (IndexedDB)

CalmOS is a "local-first" application. It does not store user data on any centralized server. All data is persisted in the user's browser using **IndexedDB**.

## Store Definitions

The database `calmOS_db` (Version 3) consists of the following object stores:

### 1. `anger_logs`
Stores the user's emotional reflections.
- **KeyPath**: `id`
- **Fields**:
  - `id`: string (UUID)
  - `timestamp`: number (ms)
  - `trigger`: string (e.g., "Delay", "Mistake")
  - `reacted`: boolean (Did the user react immediately?)

### 2. `chat_messages`
Stores the conversation history with the AI Counselor.
- **KeyPath**: `id`
- **Fields**:
  - `id`: string (UUID)
  - `text`: string
  - `sender`: 'user' | 'ai'
  - `timestamp`: number (ms)

### 3. `user_profile`
Stores user personalization data and application state.
- **Key**: `current_user`
- **Fields**:
  - `name`: string
  - `ageGroup`: string (e.g., "young-adult", "adult")
  - `goals`: string (User wellness objectives)
  - `triggers`: string (Known emotional triggers)
  - `copingMethods`: string (Existing helpful strategies)
  - `preferences`: string (Communication tone preference)
  - `hasSeenTour`: boolean (Flag for onboarding tour)

## Data Portability

Users can export their entire database as a single JSON file via the **Profile** page. This allows users to:
- Backup their data.
- Migrate their data between devices or browsers.
- Delete their data entirely using the "Clear All Data" function.
