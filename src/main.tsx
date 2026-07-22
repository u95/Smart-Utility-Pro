import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdMob } from '@capacitor-community/admob';
import App from './App.tsx';
import './index.css';

async function initializeApp() {
  try {
    await AdMob.initialize();
    console.log("AdMob Initialized");
  } catch (e) {
    console.error("AdMob Init Error:", e);
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

initializeApp();
