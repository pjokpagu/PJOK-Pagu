import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration keys for local storage overrides
const STORAGE_SUPABASE_URL = 'kkg_supabase_url';
const STORAGE_SUPABASE_KEY = 'kkg_supabase_anon_key';

/**
 * Retrieve current active Supabase URL and Anon Key.
 * Checks environment variables first (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY),
 * then falls back to any user-saved credentials in localStorage.
 */
export const getSupabaseConfig = (): { url: string; key: string } => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
  
  const localUrl = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_SUPABASE_URL) || '') : '';
  const localKey = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_SUPABASE_KEY) || '') : '';

  const url = (envUrl.trim() || localUrl.trim()).replace(/\/+$/, '');
  const key = envKey.trim() || localKey.trim();

  return { url, key };
};

/**
 * Check if valid Supabase credentials have been configured.
 */
export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key && url.startsWith('http') && !url.includes('YOUR_SUPABASE_URL'));
};

let clientInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

/**
 * Get or initialize the Supabase client.
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseConfig();

  if (!url || !key || !url.startsWith('http') || url.includes('YOUR_SUPABASE_URL')) {
    clientInstance = null;
    return null;
  }

  if (clientInstance && lastUrl === url && lastKey === key) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    lastUrl = url;
    lastKey = key;
    return clientInstance;
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client:', err);
    clientInstance = null;
    return null;
  }
};

/**
 * Save custom Supabase credentials from the Admin UI.
 */
export const setSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    if (url.trim()) {
      localStorage.setItem(STORAGE_SUPABASE_URL, url.trim());
    } else {
      localStorage.removeItem(STORAGE_SUPABASE_URL);
    }

    if (key.trim()) {
      localStorage.setItem(STORAGE_SUPABASE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_SUPABASE_KEY);
    }
    clientInstance = null;
    lastUrl = '';
    lastKey = '';
  }
};

/**
 * Real-time listener for a document / entity in the Supabase 'kkg_data' table.
 * Automatically synchronizes changes across all devices in real-time.
 */
export const subscribeToCloudDoc = (
  docName: string,
  onData: (data: any) => void
): (() => void) => {
  const client = getSupabaseClient();
  if (!client) {
    return () => {};
  }

  let isCancelled = false;

  // 1. Initial fetch from Supabase
  (async () => {
    try {
      const { data, error } = await client
        .from('kkg_data')
        .select('*')
        .eq('id', docName)
        .maybeSingle();

      if (!isCancelled && !error && data) {
        onData(data);
      }
    } catch (err: any) {
      console.warn(`[Supabase Realtime] Fetch error for ${docName}:`, err?.message || err);
    }
  })();

  // 2. Real-time PostgreSQL subscription
  try {
    const channel = client
      .channel(`realtime-kkg-${docName}`)
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

    return () => {
      isCancelled = true;
      try {
        client.removeChannel(channel);
      } catch (e) {
        // Safe channel cleanup
      }
    };
  } catch (err: any) {
    console.warn(`[Supabase Realtime] Subscription error for ${docName}:`, err?.message || err);
    return () => {
      isCancelled = true;
    };
  }
};

/**
 * Saves or updates a document in Supabase ('kkg_data' table).
 * Triggers instant real-time sync across all connected clients and devices.
 */
export const saveToCloudDoc = async (docName: string, payload: any): Promise<void> => {
  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  try {
    const row = {
      id: docName,
      ...payload,
      last_updated: new Date().toISOString()
    };

    const { error } = await client
      .from('kkg_data')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn(`[Supabase Cloud] Upsert warning for ${docName}:`, error.message);
    }
  } catch (err: any) {
    console.warn(`[Supabase Cloud] Error while saving ${docName}:`, err?.message || err);
  }
};

/**
 * Retrieves a one-time document snapshot from Supabase.
 */
export const fetchCloudDoc = async (docName: string): Promise<any | null> => {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from('kkg_data')
      .select('*')
      .eq('id', docName)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn(`[Supabase Cloud] Fetch error for ${docName}:`, err);
  }
  return null;
};
