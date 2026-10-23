# Daftar

Daftar is a personal finance app built with Expo and React Native. It lets users
track income and expenses, manage recurring transactions, review transaction
history, and view statistics in English or Arabic.

## Requirements

- Node.js and npm versions supported by Expo SDK 54
- An API server reachable from the device or emulator
- iOS Simulator or Android Emulator for native development (optional)

## Setup

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Create `.env.local` in the project root and configure the API URL:

   ```dotenv
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```

   Use an API URL reachable from your device or emulator. For Google sign-in,
   configure `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` and, for Android,
   `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`.

3. Start the Expo development server:

   ```sh
   npm start
   ```

## Useful commands

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run ios` | Build and run on the iOS simulator |
| `npm run android` | Build and run on an Android emulator |
| `npm run web` | Run the web version |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript type check |

## Project layout

- `app/` - Expo Router routes and navigation layouts
- `components/` - Shared UI components
- `features/` - Feature-specific screens, components, hooks, and data logic
- `hooks/`, `lib/`, `theme/` - Shared hooks, utilities, and styling
- `locals/` - English and Arabic translations
