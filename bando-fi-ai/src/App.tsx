import { useState, useEffect } from 'react';
import './App.css';
import ImageGenerator from './components/ImageGenerator';
import ErrorBoundary from './components/ErrorBoundary';
import Logger from './utils/Logger';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize the app
    Logger.info('BandoFi-Ai application initialized');
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <h1 className="neon-text">BandoFi-Ai</h1>
          <div className="loading-indicator">Initializing...</div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
        <header className="app-header">
          <h1 className="neon-text glow-green">BandoFi-Ai</h1>
          <p className="subtitle glow-pink">Advanced Image Generation Platform</p>
        </header>
        
        <main className="app-main">
          <ImageGenerator />
        </main>
        
        <footer className="app-footer">
          <p className="glow-pink">BandoFi-Ai v1.0.0 | Production-Grade Image Generation</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
