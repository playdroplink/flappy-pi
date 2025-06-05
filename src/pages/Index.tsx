
import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';
import GameCanvas from '../components/GameCanvas';
import ShopModal from '../components/ShopModal';
import LeaderboardModal from '../components/LeaderboardModal';
import GameUI from '../components/GameUI';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedBirdSkin, setSelectedBirdSkin] = useState('default');
  const [coins, setCoins] = useState(100); // Starting coins for demo

  useEffect(() => {
    // Load saved data from localStorage
    const savedHighScore = localStorage.getItem('flappypi-highscore');
    const savedCoins = localStorage.getItem('flappypi-coins');
    const savedSkin = localStorage.getItem('flappypi-skin');
    
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    if (savedCoins) setCoins(parseInt(savedCoins));
    if (savedSkin) setSelectedBirdSkin(savedSkin);

    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleGameOver = (finalScore: number) => {
    setGameState('gameOver');
    setScore(finalScore);
    
    // Add coins based on score
    const earnedCoins = Math.floor(finalScore / 5);
    const newCoins = coins + earnedCoins;
    setCoins(newCoins);
    localStorage.setItem('flappypi-coins', newCoins.toString());
    
    // Update high score
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('flappypi-highscore', finalScore.toString());
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 relative overflow-hidden">
      <GameCanvas 
        gameState={gameState}
        onGameOver={handleGameOver}
        onScoreUpdate={setScore}
        birdSkin={selectedBirdSkin}
      />
      
      <GameUI 
        gameState={gameState}
        score={score}
        highScore={highScore}
        coins={coins}
        onStartGame={startGame}
        onBackToMenu={backToMenu}
        onOpenShop={() => setShowShop(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
      />

      <ShopModal 
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        coins={coins}
        setCoins={setCoins}
        selectedBirdSkin={selectedBirdSkin}
        setSelectedBirdSkin={setSelectedBirdSkin}
      />

      <LeaderboardModal 
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  );
};

export default Index;
