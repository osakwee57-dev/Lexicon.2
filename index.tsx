import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * Initializes and mounts the application.
 */
function init() {
  console.log("Lexicon: Starting initialization...");
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("Lexicon Critical: Root element not found in the DOM.");
    return;
  }

  // Double check that ReactDOM and createRoot exist (handles import-map failures)
  if (!ReactDOM || typeof ReactDOM.createRoot !== 'function') {
    console.error("Lexicon Critical: ReactDOM.createRoot is not available. Check your imports or import-map resolution.");
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif; color: #1e293b;">
        <h2 style="font-size: 1.5rem; margin-bottom: 12px;">Module Resolution Failure</h2>
        <p style="color: #64748b;">The browser failed to resolve the React components correctly. This usually happens due to network issues or an outdated browser.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer;">Reload Application</button>
      </div>
    `;
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Lexicon: Application successfully mounted.");
  } catch (error) {
    console.error("Lexicon Critical: Failed to render the application.", error);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #1e293b; text-align: center; padding: 20px;">
        <div>
          <h1 style="font-size: 1.5rem; margin-bottom: 10px;">Lexicon Initialization Error</h1>
          <p style="color: #64748b; max-width: 400px;">The application failed to start due to a runtime error: ${error instanceof Error ? error.message : String(error)}</p>
          <button onclick="window.location.reload()" style="margin-top: 24px; padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Refresh Page</button>
        </div>
      </div>
    `;
  }
}

// Ensure execution happens when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // Small delay to ensure any parallel script tasks are cleared
  setTimeout(init, 0);
}
