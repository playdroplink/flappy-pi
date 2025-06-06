
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
        {/* Enhanced Top Header Layout */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {/* Left Side - Mode and Level Info */}
          <div className="flex flex-col gap-2">
            <div className="bg-blue-600/90 rounded-xl px-4 py-2 text-white font-bold text-sm shadow-lg backdrop-blur-sm">
              <div className="text-xs opacity-80">Level {level}</div>
              <div className="text-sm">{gameMode === 'classic' ? 'Morning' : gameMode === 'endless' ? 'Day' : 'Night'}</div>
              <div className="text-xs uppercase tracking-wide">{gameMode}</div>
            </div>
          </div>

          {/* Center - Score (Large and Prominent) */}
          <div className="flex justify-center">
            <div className="bg-white/95 rounded-2xl px-8 py-4 shadow-2xl">
              <div className="text-6xl font-black text-gray-800 text-center tracking-tight">
                {score}
              </div>
            </div>
          </div>

          {/* Right Side - Coins */}
          <div className="flex flex-col gap-2">
            <div className="bg-yellow-500/90 rounded-xl px-4 py-3 text-white font-bold shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-100" />
                <span className="text-lg font-bold">{coins}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom HUD - Lives Only */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 bg-red-500/90 rounded-lg px-4 py-3 backdrop-blur-sm">
            <Heart className="w-5 h-5 text-red-100" />
            <span className="text-white font-bold text-lg">{lives}</span>
          </div>
        </div>

        {/* Bottom Right - Game Mode Indicator */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/50 rounded-lg px-3 py-2 text-white font-bold text-xs uppercase tracking-wider opacity-70">
            {gameMode} MODE
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
              <span className="text-gray-600">Flappy Coins Earned:</span>
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
                className="flex-1 text-white bg-purple-500 hover:bg-purple-600 border-purple-500"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </div>
            
            <Button 
              onClick={onOpenShop}
              className="w-full text-white bg-cyan-500 hover:bg-cyan-600"
            >
              <Menu className="w-5 h-5 mr-2" />
              Shop
            </Button>
            
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
