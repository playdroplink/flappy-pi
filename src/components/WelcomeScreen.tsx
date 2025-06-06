
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Settings, Trophy, ShoppingBag, HelpCircle, Star } from 'lucide-react';
import { useCompleteAudioSystem } from '@/hooks/useCompleteAudioSystem';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import PiAuthLoginModal from './PiAuthLoginModal';
import AudioControlPanel from './AudioControlPanel';
import WelcomeHeader from './welcome/WelcomeHeader';
import UserStatsCard from './welcome/UserStatsCard';
import GameModeButtons from './welcome/GameModeButtons';
import QuickActionButtons from './welcome/QuickActionButtons';
import WelcomeFooter from './welcome/WelcomeFooter';
import BackgroundElements from './welcome/BackgroundElements';

interface WelcomeScreenProps {
  onStartGame: (mode: 'classic' | 'endless' | 'challenge') => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenHelp: () => void;
  onOpenTutorial: () => void;
  coins: number;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartGame,
  onOpenShop,
  onOpenLeaderboard,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenHelp,
  onOpenTutorial,
  coins,
  musicEnabled,
  onToggleMusic
}) => {
  const [showPiAuth, setShowPiAuth] = useState(false);
  const [showAudioPanel, setShowAudioPanel] = useState(false);
  const { isAuthenticated, user } = useSupabaseAuth();
  const { playSwoosh, unlockAudio, isAudioUnlocked } = useCompleteAudioSystem();

  // Auto-unlock audio and show Pi auth for new users
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('flappypi-welcome-seen');
    const isGuest = localStorage.getItem('flappypi-guest-mode');
    
    if (!hasSeenWelcome && !isAuthenticated && !isGuest) {
      setShowPiAuth(true);
      localStorage.setItem('flappypi-welcome-seen', 'true');
    }

    // Auto-unlock audio on load
    const timer = setTimeout(() => {
      if (!isAudioUnlocked) {
        unlockAudio();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, unlockAudio, isAudioUnlocked]);

  const handleStartGame = (mode: 'classic' | 'endless' | 'challenge') => {
    playSwoosh();
    onStartGame(mode);
  };

  const handleActionClick = (action: () => void) => {
    playSwoosh();
    action();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600 relative overflow-hidden">
      <BackgroundElements />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <WelcomeHeader 
          onOpenSettings={() => setShowAudioPanel(true)}
          onOpenAuth={() => setShowPiAuth(true)}
          isAuthenticated={isAuthenticated}
          username={user?.user_metadata?.username}
        />

        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="text-8xl animate-bounce">🐦</div>
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              Flappy Pi
            </h1>
            <p className="text-xl text-white/90 drop-shadow">
              Fly, Earn, and Have Fun on Pi Network!
            </p>
          </div>

          <UserStatsCard 
            coins={coins}
            isAuthenticated={isAuthenticated}
            onOpenAuth={() => setShowPiAuth(true)}
          />

          <GameModeButtons onStartGame={handleStartGame} />

          <QuickActionButtons
            onOpenShop={() => handleActionClick(onOpenShop)}
            onOpenLeaderboard={() => handleActionClick(onOpenLeaderboard)}
            onOpenTutorial={() => handleActionClick(onOpenTutorial)}
            onOpenHelp={() => handleActionClick(onOpenHelp)}
          />
        </div>

        <WelcomeFooter
          onOpenPrivacy={() => handleActionClick(onOpenPrivacy)}
          onOpenTerms={() => handleActionClick(onOpenTerms)}
          onOpenContact={() => handleActionClick(onOpenContact)}
        />
      </div>

      {/* Modals */}
      <PiAuthLoginModal
        isOpen={showPiAuth}
        onClose={() => setShowPiAuth(false)}
        onSuccess={() => setShowPiAuth(false)}
      />

      {showAudioPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-white rounded-full z-10"
              onClick={() => setShowAudioPanel(false)}
            >
              ✕
            </Button>
            <AudioControlPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
