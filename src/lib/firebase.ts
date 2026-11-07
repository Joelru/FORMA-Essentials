import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
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

// Configuración oficial por defecto de FORMA Estudio (Firebase)
export const DEFAULT_FIREBASE_CONFIG: FirebaseCustomConfig & { measurementId?: string } = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB0w6V1ew8XILLiq55PVqtnIN4bzY-AETU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'forma-estudio.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'forma-estudio',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'forma-estudio.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '739266642946',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:739266642946:web:4762fd6e7568e2b250531b',
  measurementId: 'G-3XRWNKVQP2',
};

export function getSavedFirebaseConfig(): FirebaseCustomConfig {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FirebaseCustomConfig;
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch {
    // Fallback to default config
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseCustomConfig(config: FirebaseCustomConfig | null): void {
  if (!config) {
    localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
    return;
  }
  localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
}

let cachedDb: Firestore | null = null;
let analyticsInitialized = false;

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

    if (!analyticsInitialized && typeof window !== 'undefined') {
      analyticsInitialized = true;
      isSupported()
        .then((yes) => {
          if (yes) getAnalytics(app);
        })
        .catch(() => {});
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
