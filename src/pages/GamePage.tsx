
import React, { useState } from 'react';
import GameCanvas from '@/components/GameCanvas';

const GamePage: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver' | 'paused'>('playing');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);

  const handleCollision = () => {
    setGameState('gameOver');
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameState('gameOver');
  };

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
  };

  const handleCoinEarned = (newCoins: number) => {
    setCoins(prev => prev + newCoins);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-cyan-300">
      <GameCanvas
        gameState={gameState}
        gameMode="classic"
        level={Math.floor(score / 5) + 1}
        onCollision={handleCollision}
        onGameOver={handleGameOver}
        onScoreUpdate={handleScoreUpdate}
        onCoinEarned={handleCoinEarned}
        birdSkin="default"
        musicEnabled={true}
        userDifficulty="medium"
      />
    </div>
  );
};

export default GamePage;
