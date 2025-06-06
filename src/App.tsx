
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import PiBrowserDetector from '@/components/PiBrowserDetector';
import WelcomeScreen from '@/components/WelcomeScreen';
import SettingsPage from '@/pages/SettingsPage';
import GamePage from '@/pages/GamePage';
import NotFound from '@/pages/NotFound';
import { useGameState } from '@/hooks/useGameState';
import { useCompleteAudioSystem } from '@/hooks/useCompleteAudioSystem';

const App: React.FC = () => {
  const {
    gameMode,
    coins,
    musicEnabled,
    onToggleMusic,
    onStartGame,
    onOpenShop,
    onOpenLeaderboard,
    onOpenPrivacy,
    onOpenTerms,
    onOpenContact,
    onOpenHelp,
    onOpenTutorial
  } = useGameState();

  const { initializeGameSounds } = useCompleteAudioSystem();

  // Initialize audio system on app load
  React.useEffect(() => {
    initializeGameSounds();
  }, [initializeGameSounds]);

  return (
    <ErrorBoundary>
      <PiBrowserDetector>
        <Router>
          <div className="App">
            <Routes>
              <Route 
                path="/" 
                element={
                  gameMode === 'menu' ? (
                    <WelcomeScreen
                      onStartGame={onStartGame}
                      onOpenShop={onOpenShop}
                      onOpenLeaderboard={onOpenLeaderboard}
                      onOpenPrivacy={onOpenPrivacy}
                      onOpenTerms={onOpenTerms}
                      onOpenContact={onOpenContact}
                      onOpenHelp={onOpenHelp}
                      onOpenTutorial={onOpenTutorial}
                      coins={coins}
                      musicEnabled={musicEnabled}
                      onToggleMusic={onToggleMusic}
                    />
                  ) : (
                    <GamePage />
                  )
                } 
              />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </PiBrowserDetector>
    </ErrorBoundary>
  );
};

export default App;
