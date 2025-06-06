
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
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
    setCoins
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

  // Show loading screen while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show authentication screen if not logged in
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
              className="w-full text-lg py-3"
              size="lg"
            >
              Play Now - Sign In/Up
            </Button>
            <p className="text-white/80 text-sm">
              Sign up to save your progress, compete on leaderboards, and earn rewards!
            </p>
          </div>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  // Show splash screen first
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
            {profile?.username || user.email?.split('@')[0] || 'Player'}
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
          onStartGame={startGame}
          onShowShop={() => setShowShop(true)}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowHelp={() => setShowHelp(true)}
          onShowDailyRewards={() => setShowDailyRewards(true)}
          canClaimDaily={canClaimDaily}
          coins={coins}
          highScore={highScore}
          selectedBirdSkin={selectedBirdSkin}
          musicEnabled={musicEnabled}
          onToggleMusic={() => setMusicEnabled(!musicEnabled)}
        />
      )}

      {/* Game Canvas */}
      {gameState === 'playing' && (
        <GameCanvas
          score={score}
          level={level}
          lives={lives}
          gameMode={gameMode}
          selectedBirdSkin={selectedBirdSkin}
          onScoreUpdate={handleScoreUpdate}
          onCollision={handleCollision}
          onCoinEarned={handleCoinEarned}
          gameState={gameState}
          resetGameEventStates={resetGameEventStates}
        />
      )}

      {/* Game UI Overlay */}
      {(gameState === 'playing' || gameState === 'paused' || isPausedForRevive) && (
        <GameUI
          score={score}
          level={level}
          lives={lives}
          coins={coins}
          gameState={gameState}
          isPausedForRevive={isPausedForRevive}
          showContinueButton={showContinueButton}
          onPause={() => setGameState('paused')}
          onResume={() => setGameState('playing')}
          onBackToMenu={backToMenu}
          onWatchAd={handleAdWatch}
          onContinue={handleContinueClick}
        />
      )}

      {/* All Game Modals */}
      <GameModals
        gameState={gameState}
        score={score}
        highScore={highScore}
        coins={coins}
        level={level}
        showLeaderboard={showLeaderboard}
        showShop={showShop}
        showHelp={showHelp}
        showPrivacy={showPrivacy}
        showTerms={showTerms}
        showContact={showContact}
        showShareScore={showShareScore}
        showDailyRewards={showDailyRewards}
        showMandatoryAd={showMandatoryAd}
        showAdFreeModal={showAdFreeModal}
        selectedBirdSkin={selectedBirdSkin}
        onNewGame={() => startGame('classic')}
        onBackToMenu={backToMenu}
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
        onWatchMandatoryAd={handleMandatoryAdWatch}
        onCloseAdFreeModal={() => setShowAdFreeModal(false)}
        onClaimDailyReward={claimDailyReward}
        adSystem={adSystem}
        setCoins={setCoins}
      />
    </div>
  );
};

export default Index;
