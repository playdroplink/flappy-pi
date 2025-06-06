
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ShopPage from './pages/ShopPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import { loadPiSdk } from './services/piSdkLoader';
import { piNetworkService } from './services/piNetworkService';

function App() {
  // Initialize Pi SDK when app loads
  useEffect(() => {
    const initPiSdk = async () => {
      try {
        await loadPiSdk();
        await piNetworkService.initialize();
        console.log('Pi SDK initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Pi SDK:', error);
      }
    };
    
    initPiSdk();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<GamePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
