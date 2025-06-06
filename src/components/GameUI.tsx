
import React from 'react';
import { Coins, Trophy, Heart, Star, Play, Home, Menu } from 'lucide-react';
import { Button } from './ui/button';

interface GameUIProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  score: number;
  level: number;
  lives: number;
  highScore: number;
  coins: number;
  gameMode: 'classic' | 'endless' | 'challenge';
  onStartGame: () => void;
  onBackToMenu: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onShowAd: () => void;
  onShareScore: () => void;
  isPausedForRevive: boolean;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  score,
  level,
  lives,
  highScore,
  coins,
  gameMode,
  onStartGame,
  onBackToMenu,
  onOpenShop,
  onOpenLeaderboard,
  onShowAd,
  onShareScore,
  isPausedForRevive
}) => {
  if (gameState === 'playing' && !isPausedForRevive) {
    return (
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Top Header with Score */}
        <div className="absolute top-4 left-4 right-4 flex justify-center">
          <div className="bg-black/70 rounded-xl px-6 py-3 text-white font-bold text-2xl shadow-lg backdrop-blur-sm">
            Score: {score}
          </div>
        </div>
        
        {/* Top Side Info */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-black/50 rounded-lg px-3 py-2 text-white font-bold text-sm">
            Level: {level}
          </div>
          <div className="bg-black/50 rounded-lg px-3 py-2 text-white font-bold text-sm">
            Mode: {gameMode}
          </div>
        </div>
        
        {/* Bottom HUD */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="flex items-center gap-2 bg-black/50 rounded-lg px-3 py-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">{coins}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/50 rounded-lg px-3 py-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-white font-bold">{lives}</span>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-20">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md mx-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Final Score:</span>
              <span className="font-bold text-xl">{score}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Level Reached:</span>
              <span className="font-bold">{level}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">High Score:</span>
              <span className="font-bold text-yellow-600">{highScore}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Coins Earned:</span>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="font-bold">{Math.floor(score / 3) + level * 2}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onStartGame}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={onShareScore}
                variant="outline"
                className="flex-1"
              >
                <Star className="w-4 h-4 mr-2" />
                Share Score
              </Button>
              <Button 
                onClick={onOpenLeaderboard}
                variant="outline"
                className="flex-1"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </div>
            
            <Button 
              onClick={onBackToMenu}
              variant="ghost"
              className="w-full"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // For menu, paused, or other states, don't show game UI
  return null;
};

export default GameUI;
