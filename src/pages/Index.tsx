
import React, { useRef } from 'react';
import SplashScreen from '@/components/SplashScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import GameCanvas from '@/components/GameCanvas';
import GameUI from '@/components/GameUI';
import GameContinueOverlay from '@/components/GameContinueOverlay';
import GameModals from '@/components/GameModals';
import TutorialModal from '@/components/TutorialModal';
import { useGameState } from '@/hooks/useGameState';
import { useGameEvents } from '@/hooks/useGameEvents';
import { useModals } from '@/hooks/useModals';

const Index = () => {
  const continueGameRef = useRef<(() => void) | null>(null);
  
  const {
    showSplash,
    showWelcome,
    gameState,
    gameMode,
    setGameState,
    startGame,
    backToMenu,
    score,
    level,
    lives,
    highScore,
    coins,
    selectedBirdSkin,
    musicEnabled,
    handleScoreUpdate,
    setScore,
    setLives,
    setLevel,
    setHighScore,
    setCoins,
    setSelectedBirdSkin,
    setMusicEnabled
  } = useGameState();

  const {
    handleCollision,
    handleGameOver,
    handleCoinEarned,
    handleAdWatch,
    handleMandatoryAdWatch,
    handleShareScore,
    showContinueButton,
    handleContinueClick,
    isPausedForRevive,
    reviveUsed,
    showMandatoryAd,
    setShowMandatoryAd
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
    showShop,
    showLeaderboard,
    showAdPopup,
    showShareScore,
    showPrivacy,
    showTerms,
    showContact,
    showHelp,
    showTutorial,
    adType,
    setShowShop,
    setShowLeaderboard,
    setShowAdPopup,
    setShowShareScore,
    setShowPrivacy,
    setShowTerms,
    setShowContact,
    setShowHelp,
    setShowTutorial
  } = useModals();

  const handleStartGameWithMode = (mode: 'classic' | 'endless' | 'challenge') => {
    startGame(mode);
  };

  const handleOpenTutorial = () => {
    setShowTutorial(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    startGame('classic'); // Start with classic mode after tutorial
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Game Canvas - Always present but only active during gameplay */}
      <GameCanvas
        gameState={gameState}
        gameMode={gameMode}
        level={level}
        onCollision={handleCollision}
        onGameOver={handleGameOver}
        onScoreUpdate={handleScoreUpdate}
        onCoinEarned={handleCoinEarned}
        birdSkin={selectedBirdSkin}
        musicEnabled={musicEnabled}
        onContinueGameRef={(fn) => { continueGameRef.current = fn; }}
      />

      {/* Welcome Screen */}
      {showWelcome && (
        <WelcomeScreen
          onStartGame={handleStartGameWithMode}
          onOpenShop={() => setShowShop(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenPrivacy={() => setShowPrivacy(true)}
          onOpenTerms={() => setShowTerms(true)}
          onOpenContact={() => setShowContact(true)}
          onOpenHelp={() => setShowHelp(true)}
          onOpenTutorial={handleOpenTutorial}
          coins={coins}
          musicEnabled={musicEnabled}
          onToggleMusic={setMusicEnabled}
        />
      )}

      {/* Game UI Overlay */}
      <GameUI
        gameState={gameState}
        score={score}
        level={level}
        lives={lives}
        highScore={highScore}
        coins={coins}
        gameMode={gameMode}
        onStartGame={() => startGame(gameMode)}
        onBackToMenu={backToMenu}
        onOpenShop={() => setShowShop(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onShowAd={() => setShowAdPopup(true)}
        onShareScore={handleShareScore}
        isPausedForRevive={isPausedForRevive}
      />

      {/* Continue Game Overlay */}
      <GameContinueOverlay
        showContinueButton={showContinueButton}
        onContinue={handleContinueClick}
      />

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onStartGame={handleTutorialComplete}
      />

      {/* All Game Modals */}
      <GameModals
        showShop={showShop}
        showLeaderboard={showLeaderboard}
        showAdPopup={showAdPopup}
        showShareScore={showShareScore}
        showPrivacy={showPrivacy}
        showTerms={showTerms}
        showContact={showContact}
        showHelp={showHelp}
        showMandatoryAd={showMandatoryAd}
        adType={adType}
        coins={coins}
        score={score}
        level={level}
        highScore={highScore}
        selectedBirdSkin={selectedBirdSkin}
        gameState={gameState}
        setShowShop={setShowShop}
        setShowLeaderboard={setShowLeaderboard}
        setShowAdPopup={setShowAdPopup}
        setShowShareScore={setShowShareScore}
        setShowPrivacy={setShowPrivacy}
        setShowTerms={setShowTerms}
        setShowContact={setShowContact}
        setShowHelp={setShowHelp}
        setShowMandatoryAd={setShowMandatoryAd}
        setCoins={setCoins}
        setSelectedBirdSkin={setSelectedBirdSkin}
        onWatchAd={handleAdWatch}
        onMandatoryAdWatch={handleMandatoryAdWatch}
      />
    </div>
  );
};

export default Index;
