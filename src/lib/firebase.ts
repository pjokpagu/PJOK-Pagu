import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  Firestore 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

/**
 * Real-time listener for a specific KKG document in Firestore.
 * Automatically receives real-time updates across all devices (laptop, HP, tablet).
 */
export const subscribeToCloudDoc = (
  docName: string, 
  onData: (data: any) => void
): (() => void) => {
  try {
    const docRef = doc(db, 'kkg_data', docName);
    return onSnapshot(
      docRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data());
        }
      },
      (error) => {
        console.warn(`[Firestore Realtime] Listener warning for ${docName}:`, error.message);
      }
    );
  } catch (err) {
    console.warn(`[Firestore Realtime] Failed to subscribe to ${docName}:`, err);
    return () => {};
  }
};

/**
 * Saves or updates a document in Firestore.
 * Triggers instant real-time sync to all other connected clients and devices.
 */
export const saveToCloudDoc = async (docName: string, payload: any): Promise<void> => {
  try {
    const docRef = doc(db, 'kkg_data', docName);
    await setDoc(docRef, {
      ...payload,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (err: any) {
    console.warn(`[Firestore Cloud] Warning while saving ${docName}:`, err?.message || err);
  }
};

/**
 * Retrieves a one-time document snapshot from Firestore.
 */
export const fetchCloudDoc = async (docName: string): Promise<any | null> => {
  try {
    const docRef = doc(db, 'kkg_data', docName);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn(`[Firestore Cloud] Fetch error for ${docName}:`, err);
  }
  return null;
};
