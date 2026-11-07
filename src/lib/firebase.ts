import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  onSnapshot,
  getDoc
} from 'firebase/firestore';
import { FirebaseCustomConfig } from '../types';

const FIREBASE_CONFIG_STORAGE_KEY = 'forma_firebase_custom_config_v1';

export function getSavedFirebaseConfig(): FirebaseCustomConfig | null {
  // 1. Check .env variables first
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
  }

  // 2. Check custom config saved via Admin Dashboard
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FirebaseCustomConfig;
    if (parsed && parsed.apiKey && parsed.projectId) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function saveFirebaseCustomConfig(config: FirebaseCustomConfig | null): void {
  if (!config) {
    localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
    return;
  }
  localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
}

let cachedDb: Firestore | null = null;

export function getFirebaseDb(): { db: Firestore | null; isConnected: boolean; projectId?: string } {
  const config = getSavedFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { db: null, isConnected: false };
  }

  try {
    let app: FirebaseApp;
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      app = initializeApp(config);
    }
    if (!cachedDb) {
      cachedDb = getFirestore(app);
    }
    return { db: cachedDb, isConnected: true, projectId: config.projectId };
  } catch (err) {
    console.warn('Error inicializando Firebase:', err);
    return { db: null, isConnected: false };
  }
}

export { doc, setDoc, onSnapshot, getDoc };
