import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

// Local BroadcastChannel for instant zero-latency cross-tab synchronization
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('kkg_pjok_realtime_sync')
  : null;

/**
 * Saves a document to the cloud database (Firestore + Supabase if configured)
 * and immediately broadcasts to all active tabs/devices.
 */
export const saveToCloudDoc = async (docName: string, payload: any): Promise<void> => {
  const enrichedPayload = {
    ...payload,
    lastUpdated: new Date().toISOString()
  };

  // 1. Broadcast to other open tabs on the same device immediately
  try {
    broadcastChannel?.postMessage({ docName, payload: enrichedPayload });
  } catch (e) {
    // ignore
  }

  // 2. Primary: Save to Firebase Firestore (AI Studio provisioned project)
  try {
    const docRef = doc(db, 'kkg_data', docName);
    await setDoc(docRef, enrichedPayload, { merge: true });
    console.log(`[CloudSync] ✓ Saved "${docName}" to Firebase Firestore successfully.`);
  } catch (err: any) {
    console.warn(`[CloudSync] Warning saving "${docName}" to Firestore:`, err?.message || err);
  }

  // 3. Secondary: If user has configured Supabase, save to Supabase as well
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase
          .from('kkg_data')
          .upsert({
            id: docName,
            ...payload,
            last_updated: enrichedPayload.lastUpdated
          }, { onConflict: 'id' });
        console.log(`[CloudSync] ✓ Saved "${docName}" to Supabase successfully.`);
      }
    } catch (err: any) {
      console.warn(`[CloudSync] Warning saving "${docName}" to Supabase:`, err?.message || err);
    }
  }
};

/**
 * Subscribes to real-time changes for a specific document.
 * Listens to Firestore onSnapshot + Supabase Realtime (if configured) + local BroadcastChannel.
 */
export const subscribeToCloudDoc = (
  docName: string,
  onData: (data: any) => void
): (() => void) => {
  let isCancelled = false;
  const unsubs: Array<() => void> = [];

  // 1. Listen to BroadcastChannel for immediate local tab updates
  if (broadcastChannel) {
    const handleBroadcast = (event: MessageEvent) => {
      if (!isCancelled && event.data?.docName === docName && event.data?.payload) {
        onData(event.data.payload);
      }
    };
    broadcastChannel.addEventListener('message', handleBroadcast);
    unsubs.push(() => broadcastChannel.removeEventListener('message', handleBroadcast));
  }

  // 2. Realtime listener on Firebase Firestore
  try {
    const docRef = doc(db, 'kkg_data', docName);
    const unsubFirestore = onSnapshot(
      docRef,
      (snapshot) => {
        if (!isCancelled && snapshot.exists()) {
          const cloudData = snapshot.data();
          onData(cloudData);
        }
      },
      (error) => {
        console.warn(`[CloudSync Realtime] Firestore listener warning for ${docName}:`, error.message);
      }
    );
    unsubs.push(unsubFirestore);
  } catch (err) {
    console.warn(`[CloudSync Realtime] Failed to attach Firestore listener for ${docName}:`, err);
  }

  // 3. Realtime listener on Supabase (if configured)
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const channel = supabase
          .channel(`kkg-sync-${docName}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'kkg_data',
              filter: `id=eq.${docName}`
            },
            (payload: any) => {
              if (!isCancelled && payload?.new) {
                onData(payload.new);
              }
            }
          )
          .subscribe();

        unsubs.push(() => {
          try {
            supabase.removeChannel(channel);
          } catch (e) {}
        });
      }
    } catch (err) {
      console.warn(`[CloudSync Realtime] Supabase listener error for ${docName}:`, err);
    }
  }

  return () => {
    isCancelled = true;
    unsubs.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {}
    });
  };
};

/**
 * One-time fetch of document from cloud
 */
export const fetchCloudDoc = async (docName: string): Promise<any | null> => {
  // Try Firestore first
  try {
    const docRef = doc(db, 'kkg_data', docName);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn(`[CloudSync] Fetch error from Firestore for ${docName}:`, err);
  }

  // Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data } = await supabase.from('kkg_data').select('*').eq('id', docName).maybeSingle();
        if (data) return data;
      }
    } catch (e) {}
  }

  return null;
};
