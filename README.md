# NutriFit Mobile

> **Mobile version of the NutriFit web platform**, built with **React Native (Expo) and the Galio Framework**, mirroring core web features for **AI-driven meal planning** with **GPT-5.2 and Gemini 3.5 Flash**. Tracks body metrics (BMI, body fat %, lean mass, ideal weight, daily calorie requirements, macronutrients) and lets users compare AI-generated meal plans against their personal limits, all synced through **Firebase Authentication and Firestore**

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Gitignored Configuration Files](#gitignored-configuration-files)
- [Local Development](#local-development)
- [Building for Distribution](#building-for-distribution)
- [Environment Variables](#environment-variables)

---

## Architecture

```
NutriFitMobile/
├── screens/       # Onboarding, login/register, meal planner, user measurements
├── components/    # Shared, theme-aware UI building blocks (buttons, inputs, cards, tabs, widgets...)
├── navigation/    # Auth-aware stack/drawer/tab navigators, gated by Firebase auth state
├── database/      # Firebase connection and Firestore get/set/delete helpers
├── constants/     # Theme, images, and shared utilities
└── assets/        # Fonts, icons, and images
```

> The mobile app shares the same backend API as the NutriFit web project (not included in this repository).

---

## Tech Stack

**Mobile App**

React Native, Expo, Galio Framework, JavaScript, TypeScript, Firebase (Auth + Firestore), OpenAI API

**Shared Backend (external, not included in this repository)**

Node.js, Vertex AI (Gemini), Google Custom Search API

**Tooling**

Android Studio (Android emulator/build), EAS CLI (cloud builds)

---

## Gitignored Configuration Files

These files are excluded from version control and must exist locally before running the project. Templates below show the expected structure - fill in real values yourself.

### `.env`

Used for local development only. Not used in EAS cloud builds - secrets are managed via `eas env:create` instead (see [Environment Variables](#environment-variables)).

```env
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

### `database/connection.js`

Firebase client SDK configuration. This file is gitignored and must be created locally before running the project.

**Local development** — use the fallback version, filling in your real values from the Firebase Console:

```js
const raw = process.env.EXPO_PUBLIC_FIREBASE_CONFIG;

export const firebaseConfig = raw
  ? JSON.parse(raw)
  : {
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

**EAS builds (production)** — the committed version throws if the secret is missing, ensuring the build fails loudly rather than silently using wrong credentials:

```js
const raw = process.env.EXPO_PUBLIC_FIREBASE_CONFIG;

if (!raw) {
  throw new Error("EXPO_PUBLIC_FIREBASE_CONFIG is not defined");
}

export const firebaseConfig = JSON.parse(raw);
```

Before triggering an EAS build, swap to the throw version. Before local development, swap back to the fallback version. Neither version should ever be committed with real credential values hardcoded.

---

## Local Development

### 1. Install dependencies

```bash
cd `NutriFitMobile main directory`
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

---

## Building for Distribution

Builds are handled via **EAS Build** (Expo Application Services), which compiles the app in the cloud without requiring a local Android Studio or Xcode setup.

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Log in to your Expo account

```bash
eas login
```

### 3. Configure EAS for the project (first time only)

```bash
eas build:configure
```

This generates an `eas.json` at the project root with build profiles (`development`, `preview`, `production`).

### 4. Set up EAS environment variables (first time only)

EAS cloud builds do not have access to your local `.env` file or gitignored files. All secrets must be added to EAS manually. See [Environment Variables](#environment-variables) for the full list of required variables and the commands to add them.

### 5. Build an installable APK (Android)

```bash
eas build -p android --profile preview
```

The `preview` profile produces a standalone `.apk` that can be sideloaded directly onto any Android device - no Play Store required. Once the build completes, EAS prints a download link. You can also find all builds at:

```
https://expo.dev/accounts/<your-account>/projects/<your-project>/builds
```

### Build profiles

| Profile      | Output | Use case                                           |
| ------------ | ------ | -------------------------------------------------- |
| `preview`    | `.apk` | Sideload directly onto Android devices for testing |
| `production` | `.aab` | Upload to Google Play Store                        |

> iOS builds require an Apple Developer account and produce an `.ipa` for beta testing or App Store distribution. Run `eas build -p ios --profile preview` on a machine with Xcode available.

---

## Environment Variables

There are two separate environments for variables: **local development** and **EAS cloud builds**. They are managed differently.

### Local development

Create a `.env` file in the project root (gitignored):

```env
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

Firebase config for local development lives in `database/connection.js` (also gitignored) as a hardcoded fallback - no `.env` entry needed locally for Firebase.

### EAS cloud builds

EAS builds run on Expo's servers and have no access to your local `.env` or gitignored files. Secrets must be added via the EAS CLI once per environment. The `preview` profile uses the `preview` environment.

To view currently set variables:

```bash
eas env:list --environment preview --include-sensitive
```

To add a variable:

```bash
eas env:create preview --name VARIABLE_NAME --visibility sensitive
```

#### Required EAS variables

| Variable                      | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| `EXPO_PUBLIC_OPENAI_API_KEY`  | OpenAI API key for AI meal plan generation          |
| `EXPO_PUBLIC_FIREBASE_CONFIG` | Firebase client config as a JSON string (see below) |

#### Setting `EXPO_PUBLIC_FIREBASE_CONFIG`

Run the command and paste the JSON when prompted:

```bash
eas env:create preview --name EXPO_PUBLIC_FIREBASE_CONFIG --visibility sensitive
```

The expected JSON shape:

```json
{
  "apiKey": "your_firebase_api_key",
  "authDomain": "your_project.firebaseapp.com",
  "databaseURL": "https://your_project-default-rtdb.firebaseio.com",
  "projectId": "your_project_id",
  "storageBucket": "your_project.appspot.com",
  "messagingSenderId": "your_messaging_sender_id",
  "appId": "your_app_id",
  "measurementId": "your_measurement_id"
}
```
