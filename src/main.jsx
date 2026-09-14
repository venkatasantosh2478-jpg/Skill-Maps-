import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress benign Vite WebSocket HMR dev notices in container environment
if (typeof window !== 'undefined') {
  const isWsError = (val) => {
    if (!val) return false;
    const str = typeof val === 'string' ? val : (val.message || String(val));
    return str.includes('WebSocket') || str.includes('vite:ws') || str.includes('HMR');
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isWsError(event.reason) || isWsError(event.reason?.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('error', (event) => {
    if (isWsError(event.message) || isWsError(event.error)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
