import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * Initializes and mounts the application.
 */
function init() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("Critical: Root element not found in the DOM.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Critical: Failed to render the application.", error);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #1e293b; text-align: center; padding: 20px;">
        <div>
          <h1 style="font-size: 1.5rem; margin-bottom: 10px;">Lexicon Initialization Error</h1>
          <p style="color: #64748b;">The application failed to start. Please refresh the page or contact support.</p>
        </div>
      </div>
    `;
  }
}

// Ensure execution happens when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
