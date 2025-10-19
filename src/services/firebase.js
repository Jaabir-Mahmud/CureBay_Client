// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase with offline capabilities
const app = initializeApp({
  ...firebaseConfig,
  // Enable offline persistence where possible
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

const auth = getAuth(app);

// Set persistent auth state
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Add network status listeners
let isOnline = navigator.onLine;

window.addEventListener('online', () => {
  isOnline = true;
  console.log('Application is online');
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.warn('Application is offline');
});

// Only connect to auth emulator if explicitly enabled in environment
if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
  console.warn('Firebase Auth Emulator is enabled. Do not use in production.');
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
}

// Export network status checker
export const checkConnection = () => isOnline;

export { app, auth }; 