import React from 'react';
import SplashScreen from '../components/SplashScreen';
import WelcomeScreen from '../components/WelcomeScreen';
import GameCanvas from '../components/GameCanvas';
import GameUI from '../components/GameUI';
import GameModals from '../components/GameModals';
import GameContinueOverlay from '../components/GameContinueOverlay';
import { useGameState } from '../hooks/useGameState';
import { useGameEvents } from '../hooks/useGameEvents';
import { useModals } from '../hooks/useModals';

const Index = () => {
  const gameState = useGameState();
  const modals = useModals();
  
  // Create a ref to store the continue game function
  const continueGameRef = React.useRef<(() => void) | null>(null);
  
  const gameEvents = useGameEvents({
    score: gameState.score,
    coins: gameState.coins,
    highScore: gameState.highScore,
    level: gameState.level,
    setGameState: gameState.setGameState,
    setScore: gameState.setScore,
    setLives: gameState.setLives,
    setLevel: gameState.setLevel,
    setHighScore: gameState.setHighScore,
    setCoins: gameState.setCoins,
    continueGame: () => {
      if (continueGameRef.current) {
        continueGameRef.current();
      }
    }
  });

  if (gameState.showSplash) {
    return <SplashScreen />;
  }

  if (gameState.showWelcome) {
    return (
      <>
        <WelcomeScreen 
          onStartGame={gameState.startGame}
          onOpenShop={() => modals.setShowShop(true)}
          onOpenLeaderboard={() => modals.setShowLeaderboard(true)}
          onOpenPrivacy={() => modals.setShowPrivacy(true)}
          onOpenTerms={() => modals.setShowTerms(true)}
          onOpenContact={() => modals.setShowContact(true)}
          onOpenHelp={() => modals.setShowHelp(true)}
          coins={gameState.coins}
          musicEnabled={gameState.musicEnabled}
          onToggleMusic={gameState.setMusicEnabled}
        />
        
        <GameModals
          showShop={modals.showShop}
          showLeaderboard={modals.showLeaderboard}
          showAdPopup={modals.showAdPopup}
          showShareScore={modals.showShareScore}
          showPrivacy={modals.showPrivacy}
          showTerms={modals.showTerms}
          showContact={modals.showContact}
          showHelp={modals.showHelp}
          coins={gameState.coins}
          score={gameState.score}
          level={gameState.level}
          highScore={gameState.highScore}
          selectedBirdSkin={gameState.selectedBirdSkin}
          gameState={gameState.gameState}
          setShowShop={modals.setShowShop}
          setShowLeaderboard={modals.setShowLeaderboard}
          setShowAdPopup={modals.setShowAdPopup}
          setShowShareScore={modals.setShowShareScore}
          setShowPrivacy={modals.setShowPrivacy}
          setShowTerms={modals.setShowTerms}
          setShowContact={modals.setShowContact}
          setShowHelp={modals.setShowHelp}
          setCoins={gameState.setCoins}
          setSelectedBirdSkin={gameState.setSelectedBirdSkin}
          onWatchAd={gameEvents.handleAdWatch}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 relative overflow-hidden">
      <GameCanvas 
        gameState={gameState.gameState}
        gameMode={gameState.gameMode}
        level={gameState.level}
        onCollision={gameEvents.handleCollision}
        onGameOver={gameEvents.handleGameOver}
        onScoreUpdate={gameState.handleScoreUpdate}
        onCoinEarned={gameEvents.handleCoinEarned}
        birdSkin={gameState.selectedBirdSkin}
        musicEnabled={gameState.musicEnabled}
        onContinueGameRef={(fn) => {
          continueGameRef.current = fn;
        }}
      />
      
      <GameUI 
        gameState={gameState.gameState}
        score={gameState.score}
        level={gameState.level}
        lives={gameState.lives}
        highScore={gameState.highScore}
        coins={gameState.coins}
        gameMode={gameState.gameMode}
        onStartGame={() => gameState.startGame(gameState.gameMode)}
        onBackToMenu={gameState.backToMenu}
        onOpenShop={() => modals.setShowShop(true)}
        onOpenLeaderboard={() => modals.setShowLeaderboard(true)}
        onShowAd={() => modals.setShowAdPopup(true)}
        onShareScore={modals.handleShareScore}
        isPausedForRevive={gameEvents.isPausedForRevive}
      />

      <GameContinueOverlay
        isVisible={gameEvents.showContinueOverlay}
        countdown={gameEvents.countdown}
        showContinueButton={gameEvents.showContinueButton}
        onContinue={gameEvents.handleContinueClick}
      />

      <GameModals
        showShop={modals.showShop}
        showLeaderboard={modals.showLeaderboard}
        showAdPopup={modals.showAdPopup}
        showShareScore={modals.showShareScore}
        showPrivacy={modals.showPrivacy}
        showTerms={modals.showTerms}
        showContact={modals.showContact}
        showHelp={modals.showHelp}
        coins={gameState.coins}
        score={gameState.score}
        level={gameState.level}
        highScore={gameState.highScore}
        selectedBirdSkin={gameState.selectedBirdSkin}
        gameState={gameState.gameState}
        setShowShop={modals.setShowShop}
        setShowLeaderboard={modals.setShowLeaderboard}
        setShowAdPopup={modals.setShowAdPopup}
        setShowShareScore={modals.setShowShareScore}
        setShowPrivacy={modals.setShowPrivacy}
        setShowTerms={modals.setShowTerms}
        setShowContact={modals.setShowContact}
        setShowHelp={modals.setShowHelp}
        setCoins={gameState.setCoins}
        setSelectedBirdSkin={gameState.setSelectedBirdSkin}
        onWatchAd={gameEvents.handleAdWatch}
      />
    </div>
  );
};

export default Index;
