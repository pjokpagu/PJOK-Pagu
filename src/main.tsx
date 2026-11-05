import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure any stale service workers from prior sessions are unregistered so the latest build loads immediately
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  }).catch(() => {});
}

createRoot(document.getElementById('root')!).render(<App />);
