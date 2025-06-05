
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Home, Trophy, ShoppingCart, Heart, Coins, Zap } from 'lucide-react';

interface GameUIProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  score: number;
  level: number;
  lives: number;
  highScore: number;
  coins: number;
  onStartGame: () => void;
  onBackToMenu: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onShowAd: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  score,
  level,
  lives,
  highScore,
  coins,
  onStartGame,
  onBackToMenu,
  onOpenShop,
  onOpenLeaderboard,
  onShowAd
}) => {
  if (gameState === 'playing') {
    return (
      <div className="absolute top-4 left-4 right-4 z-50 pointer-events-none">
        <div className="flex justify-between items-start">
          {/* Score and level */}
          <Card className="px-4 py-2 pointer-events-auto shadow-2xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-xs text-white/80">Level {level}</div>
            </div>
          </Card>

          {/* Lives and coins */}
          <div className="space-y-2">
            <Card className="px-3 py-2 pointer-events-auto shadow-2xl">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-400" />
                <span className="text-sm font-bold text-white">{lives}</span>
              </div>
            </Card>
            <Card className="px-3 py-2 pointer-events-auto shadow-2xl">
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-bold text-white">{coins}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="p-8 max-w-sm w-full text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
          <div className="space-y-4 mb-6">
            <div>
              <div className="text-4xl font-bold text-white">{score}</div>
              <div className="text-sm text-white/80">Final Score</div>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <div className="font-bold text-white">Level Reached</div>
                <div className="text-white/80">{level}</div>
              </div>
              <div>
                <div className="font-bold text-white">Best Score</div>
                <div className="text-white/80">{highScore}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={onStartGame}
              className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={onOpenShop}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <ShoppingCart className="mr-1 h-4 w-4" />
                Shop
              </Button>
              <Button 
                onClick={onOpenLeaderboard}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Trophy className="mr-1 h-4 w-4" />
                Leaders
              </Button>
            </div>
            
            <Button 
              onClick={onShowAd}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
            >
              <Zap className="mr-2 h-4 w-4" />
              Watch Ad for Bonus
            </Button>
            
            <Button 
              onClick={onBackToMenu}
              variant="ghost"
              className="w-full text-white/80 hover:text-white hover:bg-white/10"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (gameState === 'paused') {
    return (
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="p-8 max-w-sm w-full text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Game Paused</h2>
          
          <div className="space-y-3">
            <Button 
              onClick={onStartGame}
              className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
            
            <Button 
              onClick={onBackToMenu}
              variant="outline"
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Home className="mr-2 h-4 w-4" />
              Main Menu
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default GameUI;
