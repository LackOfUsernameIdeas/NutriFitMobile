// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

const raw = process.env.EXPO_PUBLIC_FIREBASE_CONFIG;

if (!raw) {
  throw new Error("EXPO_PUBLIC_FIREBASE_CONFIG is not defined");
}

export const firebaseConfig = JSON.parse(raw);

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
