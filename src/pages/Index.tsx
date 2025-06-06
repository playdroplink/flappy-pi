
import React, { useState, useRef } from 'react';
import { usePiAuth } from '@/hooks/usePiAuth';
import { useGameState } from '@/hooks/useGameState';
import { useGameEvents } from '@/hooks/useGameEvents';
import { useModals } from '@/hooks/useModals';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { useDailyRewards } from '@/hooks/useDailyRewards';

import SplashScreen from '@/components/SplashScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import GameCanvas from '@/components/GameCanvas';
import GameUI from '@/components/GameUI';
import GameModals from '@/components/GameModals';
import GameContinueOverlay from '@/components/GameContinueOverlay';
import PiAuthModal from '@/components/PiAuthModal';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading, signOut } = usePiAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [adType, setAdType] = useState<'continue' | 'coins' | 'life'>('continue');
  const continueGameRef = useRef<() => void>();
  
  const {
    showSplash,
    showWelcome,
    gameState,
    gameMode,
    score,
    level,
    lives,
    highScore,
    selectedBirdSkin,
    coins,
    musicEnabled,
    profile,
    setGameState,
    setScore,
    setLevel,
    setLives,
    setHighScore,
    setSelectedBirdSkin,
    setCoins,
    setMusicEnabled,
    startGame,
    backToMenu,
    handleScoreUpdate,
    toast
  } = useGameState();

  const {
    handleCollision,
    handleGameOver,
    handleCoinEarned,
    handleAdWatch,
    showContinueButton,
    handleContinueClick,
    isPausedForRevive,
    reviveUsed,
    showMandatoryAd,
    showAdFreeModal,
    adSystem,
    handleMandatoryAdWatch,
    setShowAdFreeModal,
    resetGameEventStates
  } = useGameEvents({
    score,
    coins,
    highScore,
    level,
    setGameState,
    setScore,
    setLives,
    setLevel,
    setHighScore,
    setCoins,
    continueGame: () => continueGameRef.current?.()
  });

  const {
    showLeaderboard,
    showShop,
    showHelp,
    showPrivacy,
    showTerms,
    showContact,
    showShareScore,
    showDailyRewards,
    setShowLeaderboard,
    setShowShop,
    setShowHelp,
    setShowPrivacy,
    setShowTerms,
    setShowContact,
    setShowShareScore,
    setShowDailyRewards
  } = useModals();

  useBackgroundMusic(musicEnabled);
  
  const { canClaim: canClaimDaily, claimReward: claimDailyReward } = useDailyRewards();

  const handleWatchAd = async (adType: 'continue' | 'coins' | 'life') => {
    setAdType(adType);
    setShowAdPopup(true);
    await handleAdWatch(adType);
  };

  const handleStartNewGame = (mode: 'classic' | 'endless' | 'challenge' = 'classic') => {
    console.log('Starting new game - resetting all states');
    resetGameEventStates();
    startGame(mode);
  };

  const handleBackToMenu = () => {
    console.log('Back to menu - resetting all states');
    resetGameEventStates();
    backToMenu();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
        <div className="text-white text-xl">Loading Pi Network...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-2">
            🐦 Flappy Pi 🐦
          </h1>
          <p className="text-white/90 text-lg">
            The ultimate Flappy Bird experience with Pi Network integration!
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="w-full text-lg py-3 bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              🥧 Connect with Pi Network
            </Button>
            <p className="text-white/80 text-sm">
              Connect your Pi Network account to save progress, compete on leaderboards, and earn Pi rewards!
            </p>
          </div>
        </div>
        
        <PiAuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 relative overflow-hidden">
      {/* User menu */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="text-sm">
            {user.username || 'Pi User'}
          </span>
        </div>
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Welcome Screen */}
      {showWelcome && (
        <WelcomeScreen
          onStartGame={handleStartNewGame}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenShop={() => setShowShop(true)}
          onOpenHelp={() => setShowHelp(true)}
          onOpenPrivacy={() => setShowPrivacy(true)}
          onOpenTerms={() => setShowTerms(true)}
          onOpenContact={() => setShowContact(true)}
          coins={coins}
          musicEnabled={musicEnabled}
          onToggleMusic={() => setMusicEnabled(!musicEnabled)}
        />
      )}

      {/* Game Canvas */}
      {gameState === 'playing' && (
        <GameCanvas
          level={level}
          gameMode={gameMode}
          birdSkin={selectedBirdSkin}
          onScoreUpdate={handleScoreUpdate}
          onCollision={handleCollision}
          onCoinEarned={handleCoinEarned}
          gameState={gameState}
          musicEnabled={musicEnabled}
          onGameOver={handleGameOver}
          onContinueGameRef={(fn) => {
            continueGameRef.current = fn;
          }}
        />
      )}

      {/* Game UI Overlay */}
      {(gameState === 'playing' || gameState === 'paused' || isPausedForRevive) && (
        <GameUI
          score={score}
          level={level}
          lives={lives}
          coins={coins}
          highScore={highScore}
          gameState={isPausedForRevive ? 'paused' : gameState}
          gameMode={gameMode}
          isPausedForRevive={isPausedForRevive}
          onStartGame={() => setGameState('playing')}
          onBackToMenu={handleBackToMenu}
          onOpenShop={() => setShowShop(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onShowAd={() => handleWatchAd('continue')}
          onShareScore={() => setShowShareScore(true)}
        />
      )}

      {/* Game Continue Overlay */}
      <GameContinueOverlay
        showContinueButton={showContinueButton}
        onContinue={handleContinueClick}
      />

      {/* All Game Modals */}
      <GameModals
        gameState={gameState}
        score={score}
        highScore={highScore}
        coins={coins}
        level={level}
        showLeaderboard={showLeaderboard}
        showShop={showShop}
        showAdPopup={showAdPopup}
        showHelp={showHelp}
        showPrivacy={showPrivacy}
        showTerms={showTerms}
        showContact={showContact}
        showShareScore={showShareScore}
        showDailyRewards={showDailyRewards}
        showMandatoryAd={showMandatoryAd}
        showAdFreeModal={showAdFreeModal}
        selectedBirdSkin={selectedBirdSkin}
        adType={adType}
        setShowShop={setShowShop}
        setShowLeaderboard={setShowLeaderboard}
        setShowAdPopup={setShowAdPopup}
        setShowShareScore={setShowShareScore}
        setShowPrivacy={setShowPrivacy}
        setShowTerms={setShowTerms}
        setShowContact={setShowContact}
        setShowHelp={setShowHelp}
        setShowDailyRewards={setShowDailyRewards}
        setCoins={setCoins}
        setSelectedBirdSkin={setSelectedBirdSkin}
        onNewGame={() => handleStartNewGame('classic')}
        onBackToMenu={handleBackToMenu}
        onCloseLeaderboard={() => setShowLeaderboard(false)}
        onCloseShop={() => setShowShop(false)}
        onCloseHelp={() => setShowHelp(false)}
        onClosePrivacy={() => setShowPrivacy(false)}
        onCloseTerms={() => setShowTerms(false)}
        onCloseContact={() => setShowContact(false)}
        onCloseShareScore={() => setShowShareScore(false)}
        onCloseDailyRewards={() => setShowDailyRewards(false)}
        onSkinSelect={setSelectedBirdSkin}
        onPurchase={() => {}}
        onWatchAd={handleWatchAd}
        onWatchMandatoryAd={handleMandatoryAdWatch}
        onCloseAdFreeModal={() => setShowAdFreeModal(false)}
        onClaimDailyReward={claimDailyReward}
        adSystem={adSystem}
      />
    </div>
  );
};

export default Index;
