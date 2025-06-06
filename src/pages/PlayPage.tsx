import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import SplashScreen from '@/components/SplashScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import GameCanvas from '@/components/GameCanvas';
import GameUI from '@/components/GameUI';
import GameModals from '@/components/GameModals';

const PlayPage = () => {
  const {
    showSplash,
    showWelcome,
    gameState,
    gameMode,
    profile,
    setGameState,
    startGame,
    backToMenu,
    toast,
    score,
    level,
    lives,
    highScore,
    coins,
    setScore,
    setLevel,
    setLives,
    setCoins,
    showShop,
    showLeaderboard,
    showAdPopup,
    showShareScore,
    showPrivacy,
    showTerms,
    showContact,
    showHelp,
    showMandatoryAd,
    setShowShop,
    setShowLeaderboard,
    setShowAdPopup,
    setShowShareScore,
    setShowPrivacy,
    setShowTerms,
    setShowContact,
    setShowHelp,
    setShowMandatoryAd,
    selectedBirdSkin,
    setSelectedBirdSkin,
    musicEnabled,
    toggleMusic
  } = useGameState();

  // If user tries to access /play directly, redirect to home
  if (gameState.showSplash || gameState.showWelcome) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <GameCanvas
        gameState={gameState}
        gameMode={gameMode}
        level={level}
        onCollision={() => setGameState('gameOver')}
        onGameOver={(score) => {
          setScore(score);
          setGameState('gameOver');
        }}
        onScoreUpdate={setScore}
        onCoinEarned={(coins) => setCoins(prev => prev + coins)}
        birdSkin={selectedBirdSkin}
        musicEnabled={musicEnabled}
      />

      <GameUI
        gameState={gameState}
        score={score}
        level={level}
        lives={lives}
        highScore={highScore}
        coins={coins}
        gameMode={gameMode}
        onStartGame={() => setGameState('playing')}
        onBackToMenu={backToMenu}
        onOpenShop={() => setShowShop(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onShowAd={() => setShowAdPopup(true)}
        onShareScore={() => setShowShareScore(true)}
        isPausedForRevive={false}
      />

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
        adType="continue"
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
        onWatchAd={() => {}}
        onMandatoryAdWatch={() => {}}
      />
    </div>
  );
};

export default PlayPage;
