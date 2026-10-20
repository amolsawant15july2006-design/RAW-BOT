import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, off, set, update, push, remove } from 'firebase/database';

// RAW BOT Industrial Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBW_4Hn3zivil0BQivqKC_B9XalyqQSvcw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "raw-bot-3caa5.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://raw-bot-3caa5-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "raw-bot-3caa5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "raw-bot-3caa5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "746804368414",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:746804368414:web:8bb871937e83d04589ca0f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MT9FG0W9VE"
};

// Check if valid configuration is active
const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  firebaseConfig.projectId &&
  firebaseConfig.databaseURL
);

let app = null;
let auth = null;
let database = null;
let analytics = null;

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);

    // Initialize Analytics if supported in this browser environment
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
          console.log('📊 Firebase Analytics initialized:', firebaseConfig.measurementId);
        }
      }).catch(() => {});
    }

    console.log('🔥 Firebase Realtime Database connected to:', firebaseConfig.databaseURL);
  } catch (err) {
    console.warn('⚠️ Firebase Client initialization failed:', err.message);
  }
} else {
  console.log('⚡ Running in Standalone Realtime Simulation Mode.');
}

export {
  app,
  analytics,
  auth,
  database,
  isConfigured as isFirebaseConfigured,
  firebaseConfig,
  ref,
  onValue,
  off,
  set,
  update,
  push,
  remove
};
export default app;
