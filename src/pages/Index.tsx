
import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';
import WelcomeScreen from '../components/WelcomeScreen';
import GameCanvas from '../components/GameCanvas';
import ShopModal from '../components/ShopModal';
import LeaderboardModal from '../components/LeaderboardModal';
import GameUI from '../components/GameUI';
import AdPopup from '../components/AdPopup';
import { useToast } from '@/hooks/use-toast';

type GameMode = 'classic' | 'endless' | 'challenge';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver' | 'paused'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [selectedBirdSkin, setSelectedBirdSkin] = useState('default');
  const [coins, setCoins] = useState(100);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved data from localStorage
    const savedHighScore = localStorage.getItem('flappypi-highscore');
    const savedCoins = localStorage.getItem('flappypi-coins');
    const savedSkin = localStorage.getItem('flappypi-skin');
    const savedMusic = localStorage.getItem('flappypi-music');
    
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    if (savedCoins) setCoins(parseInt(savedCoins));
    if (savedSkin) setSelectedBirdSkin(savedSkin);
    if (savedMusic) setMusicEnabled(savedMusic === 'true');

    // Hide splash screen after 3 seconds and show welcome
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowWelcome(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCollision = () => {
    // Game over immediately on collision (no multiple lives)
    setGameState('gameOver');
    handleGameOver(score);
  };

  const handleGameOver = (finalScore: number) => {
    setGameState('gameOver');
    setScore(finalScore);
    
    // Add coins based on score and level
    const earnedCoins = Math.floor(finalScore / 3) + (level * 2);
    const newCoins = coins + earnedCoins;
    setCoins(newCoins);
    localStorage.setItem('flappypi-coins', newCoins.toString());
    
    // Update high score
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('flappypi-highscore', finalScore.toString());
      toast({
        title: "🎉 New High Score!",
        description: `Amazing! You scored ${finalScore} points!`
      });
    }

    // Reset for next game
    setLives(1);
    setLevel(1);
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setLives(1);
    setShowWelcome(false);
  };

  const backToMenu = () => {
    setGameState('menu');
    setShowWelcome(true);
  };

  const handleAdWatch = (adType: 'continue' | 'coins' | 'life') => {
    // Simulate watching ad
    setTimeout(() => {
      switch (adType) {
        case 'continue':
          setLives(1);
          setGameState('playing');
          toast({
            title: "Continue!",
            description: "You got a second chance!"
          });
          break;
        case 'coins':
          const bonusCoins = 25;
          setCoins(coins + bonusCoins);
          localStorage.setItem('flappypi-coins', (coins + bonusCoins).toString());
          toast({
            title: "Bonus Coins!",
            description: `You earned ${bonusCoins} coins!`
          });
          break;
      }
      setShowAdPopup(false);
    }, 2000); // Reduced ad time to 2 seconds
  };

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    // Level up every 50 points
    const newLevel = Math.floor(newScore / 50) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onStartGame={startGame}
        onOpenShop={() => setShowShop(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        coins={coins}
        musicEnabled={musicEnabled}
        onToggleMusic={setMusicEnabled}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 relative overflow-hidden">
      <GameCanvas 
        gameState={gameState}
        gameMode={gameMode}
        level={level}
        onCollision={handleCollision}
        onGameOver={handleGameOver}
        onScoreUpdate={handleScoreUpdate}
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
        onStartGame={() => startGame(gameMode)}
        onBackToMenu={backToMenu}
        onOpenShop={() => setShowShop(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onShowAd={() => setShowAdPopup(true)}
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

      <AdPopup
        isOpen={showAdPopup}
        onClose={() => {
          setShowAdPopup(false);
          if (gameState === 'paused') {
            handleGameOver(score);
          }
        }}
        onWatchAd={handleAdWatch}
        adType="continue"
      />
    </div>
  );
};

export default Index;
