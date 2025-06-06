
import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';
import WelcomeScreen from '../components/WelcomeScreen';
import GameCanvas from '../components/GameCanvas';
import GameUI from '../components/GameUI';
import GameModals from '../components/GameModals';
import GameContinueOverlay from '../components/GameContinueOverlay';
import MandatoryAdModal from '../components/MandatoryAdModal';
import AdFreeSubscriptionModal from '../components/AdFreeSubscriptionModal';
import TutorialModal from '../components/TutorialModal';
import RevivePrompt from '../components/RevivePrompt';
import { useGameState } from '../hooks/useGameState';
import { useGameEvents } from '../hooks/useGameEvents';
import { useModals } from '../hooks/useModals';
import { useAnalytics } from '../hooks/useAnalytics';
import { Analytics } from '@/services/analyticsService';

const Index = () => {
  const gameState = useGameState();
  const modals = useModals();
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Initialize analytics tracking
  useAnalytics();
  
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

  // Track game events
  useEffect(() => {
    if (gameState.gameState === 'playing') {
      Analytics.gameStarted(gameState.gameMode);
    }
  }, [gameState.gameState, gameState.gameMode]);

  // Track game completion - fix the function signature
  const handleGameOver = (finalScore: number) => {
    // Calculate session duration (you might want to track this more precisely)
    const sessionDuration = 60; // Default to 60 seconds for now
    Analytics.gameCompleted(finalScore, gameState.level, gameState.gameMode, sessionDuration);
    gameEvents.handleGameOver(finalScore);
  };

  if (gameState.showSplash) {
    return <SplashScreen />;
  }

  if (gameState.showWelcome) {
    return (
      <>
        <WelcomeScreen 
          onStartGame={(mode) => {
            // Store difficulty choice before starting game
            gameState.startGame(mode);
          }}
          onOpenShop={() => {
            Analytics.track('shop_button_clicked');
            modals.setShowShop(true);
          }}
          onOpenLeaderboard={() => {
            Analytics.track('leaderboard_button_clicked');
            modals.setShowLeaderboard(true);
          }}
          onOpenPrivacy={() => modals.setShowPrivacy(true)}
          onOpenTerms={() => modals.setShowTerms(true)}
          onOpenContact={() => modals.setShowContact(true)}
          onOpenHelp={() => modals.setShowHelp(true)}
          onOpenTutorial={() => {
            Analytics.track('tutorial_opened');
            setShowTutorial(true);
          }}
          coins={gameState.coins}
          musicEnabled={gameState.musicEnabled}
          onToggleMusic={gameState.setMusicEnabled}
        />

        <TutorialModal
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
          onStartGame={() => gameState.startGame('classic')}
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
          showMandatoryAd={gameEvents.showMandatoryAd}
          adType={modals.adType}
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
          setShowMandatoryAd={gameEvents.setShowMandatoryAd}
          setCoins={gameState.setCoins}
          setSelectedBirdSkin={gameState.setSelectedBirdSkin}
          onWatchAd={gameEvents.handleAdWatch}
          onMandatoryAdWatch={gameEvents.handleMandatoryAdWatch}
        />
      </>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-sky-400 to-sky-600 overflow-hidden">
      <GameCanvas 
        gameState={gameState.gameState}
        gameMode={gameState.gameMode}
        level={gameState.level}
        onCollision={gameEvents.handleCollision}
        onGameOver={handleGameOver}
        onScoreUpdate={gameState.handleScoreUpdate}
        onCoinEarned={gameEvents.handleCoinEarned}
        birdSkin={gameState.selectedBirdSkin}
        musicEnabled={gameState.musicEnabled}
        onContinueGameRef={(fn) => {
          continueGameRef.current = fn;
        }}
        userDifficulty="medium"
      />
      
      <GameUI 
        gameState={gameState.gameState}
        score={gameState.score}
        level={gameState.level}
        lives={gameState.lives}
        highScore={gameState.highScore}
        coins={gameState.coins}
        gameMode={gameState.gameMode}
        onStartGame={() => {
          // When restarting the game, ensure we properly reset through gameState
          gameState.setGameState('menu'); // First set to menu to trigger proper reset
          setTimeout(() => {
            gameState.startGame(gameState.gameMode); // Then start game with current mode
          }, 100); // Short delay to ensure reset is processed
        }}
        onBackToMenu={gameState.backToMenu}
        onOpenShop={() => modals.setShowShop(true)}
        onOpenLeaderboard={() => modals.setShowLeaderboard(true)}
        onShowAd={() => modals.handleShowAd('continue')}
        onShareScore={modals.handleShareScore}
        isPausedForRevive={gameEvents.isPausedForRevive}
      />

      <RevivePrompt
        isVisible={gameEvents.showRevivePrompt}
        onWatchAd={gameEvents.handleReviveAdWatch}
        onDecline={gameEvents.handleReviveDecline}
        score={gameState.score}
      />

      <GameContinueOverlay
        showContinueButton={gameEvents.showContinueButton}
        onContinue={gameEvents.handleContinueClick}
      />

      <MandatoryAdModal
        isOpen={gameEvents.showMandatoryAd}
        onWatchAd={gameEvents.handleMandatoryAdWatch}
        onUpgradeToPremium={() => gameEvents.setShowAdFreeModal(true)}
        canUpgrade={true}
      />

      <AdFreeSubscriptionModal
        isOpen={gameEvents.showAdFreeModal}
        onClose={() => gameEvents.setShowAdFreeModal(false)}
        onPurchase={gameEvents.adSystem.purchaseAdFree}
        isAdFree={gameEvents.adSystem.isAdFree}
        adFreeTimeRemaining={gameEvents.adSystem.adFreeTimeRemaining}
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
        showMandatoryAd={gameEvents.showMandatoryAd}
        adType={modals.adType}
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
        setShowMandatoryAd={gameEvents.setShowMandatoryAd}
        setCoins={gameState.setCoins}
        setSelectedBirdSkin={gameState.setSelectedBirdSkin}
        onWatchAd={gameEvents.handleAdWatch}
        onMandatoryAdWatch={gameEvents.handleMandatoryAdWatch}
      />
    </div>
  );
};

export default Index;
