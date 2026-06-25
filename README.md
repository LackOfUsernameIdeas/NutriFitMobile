# NutriFit Mobile

> **Mobile version of the NutriFit web platform**, built with **React Native (Expo) and the Galio Framework**, mirroring core web features for **AI-driven meal planning** with **GPT-5.2 and Gemini 3.5 Flash**. Tracks body metrics (BMI, body fat %, lean mass, ideal weight, daily calorie requirements, macronutrients) and lets users compare AI-generated meal plans against their personal limits, all synced through **Firebase Authentication and Firestore**

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Gitignored Configuration Files](#gitignored-configuration-files)
- [Local Development](#local-development)

---

## Architecture

````
NutriFitMobile/

├── screens/       # Onboarding, login/register, meal planner, user measurements,
│                  # daily calorie requirements, macronutrients, AI deviation screens
├── components/    # Shared, theme-aware UI building blocks (buttons, inputs, cards, tabs, widgets...)
├── navigation/    # Auth-aware stack/drawer/tab navigators, gated by Firebase auth state
├── database/      # Firebase connection and Firestore get/set/delete helpers
├── constants/     # Theme, images, and shared utilities
└── assets/        # Fonts, icons, and images

> The mobile app shares the same backend API as the NutriFit web project (not included in this repository).

---

## Tech Stack

**Mobile App**

React Native, Expo, Galio Framework, JavaScript, TypeScript, Firebase (Auth + Firestore), OpenAI API

**Shared Backend (external, not included in this repository)**

Node.js, Vertex AI (Gemini), Google Custom Search API

**Tooling**

Android Studio (Android emulator/build), Xcode (iOS, optional)

---

## Gitignored Configuration Files

These files are excluded from version control and must exist locally before running the project. Templates below show the expected structure — fill in real values yourself.

### `.env`

```env
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
````

### `database/connection.js`

Firebase client SDK configuration. Obtain it from the Firebase Console and fill in the `firebaseConfig` object:

```js
export const firebaseConfig = {
  apiKey: "your_firebase_api_key",
  authDomain: "your_project.firebaseapp.com",
  databaseURL: "https://your_project-default-rtdb.firebaseio.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id",
  measurementId: "your_measurement_id"
};
```

---

## Local Development

### 1. Install dependencies

```bash
cd NutriFitMobile
npm i
```

### 2. Start the Expo dev server

```bash
npm start
```

This runs `expo start --tunnel`, opening the Expo Dev Tools in your browser.

### 3. Run on a device or emulator

```bash
# Android (requires Android Studio + emulator, or a connected device)
npm run android

# iOS (requires Xcode, macOS only)
npm run ios
```

Alternatively, scan the QR code shown in Expo Dev Tools using the **Expo Go** app on your physical device.
