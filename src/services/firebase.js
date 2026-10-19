import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Config fra Firebase-konsollen. API-nøglen ligger i .env
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "kea-geo-guesser.firebaseapp.com",
  projectId: "kea-geo-guesser",
  storageBucket: "kea-geo-guesser.firebasestorage.app",
  messagingSenderId: "418822179377",
  appId: "1:418822179377:web:a88f17af4da5ea06522310",
  measurementId: "G-XCFBJMLHM1"
};

// Firebase må kun initialiseres én gang, så genbrug appen hvis den allerede findes
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// AsyncStorage gør, at brugeren stadig er logget ind efter en app-genstart.
let auth;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch (error) {
  // Under Fast Refresh er Auth ofte allerede initialiseret.
  auth = getAuth(app);
}

// auth = login, db = Firestore (data om runderne), storage = billedfiler
export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
