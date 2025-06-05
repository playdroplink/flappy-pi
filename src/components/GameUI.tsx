
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
          {/* Enhanced score display */}
          <Card className="px-6 py-3 pointer-events-auto shadow-2xl bg-gradient-to-r from-blue-600/90 to-purple-600/90 border-blue-400/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{score}</div>
              <div className="text-xs text-blue-200 mb-1">SCORE</div>
              <div className="text-sm text-white/90">Level {level}</div>
            </div>
          </Card>

          {/* Enhanced stats display */}
          <div className="space-y-3">
            <Card className="px-4 py-3 pointer-events-auto shadow-2xl bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400/50">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-200" />
                <span className="text-lg font-bold text-white">{lives}</span>
              </div>
            </Card>
            <Card className="px-4 py-3 pointer-events-auto shadow-2xl bg-gradient-to-r from-yellow-500/90 to-orange-500/90 border-yellow-400/50">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-yellow-200" />
                <span className="text-lg font-bold text-white">{coins}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
        <Card className="p-8 max-w-sm w-full text-center shadow-2xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-slate-600/50">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Game Over!
          </h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-400/30">
              <div className="text-4xl font-bold text-white mb-1">{score}</div>
              <div className="text-sm text-blue-200">Final Score</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="font-bold text-white">Level Reached</div>
                <div className="text-2xl font-bold text-green-400">{level}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="font-bold text-white">Best Score</div>
                <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={onStartGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Play className="mr-2 h-5 w-5" />
              Try Again
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onOpenShop}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 transform hover:scale-105 transition-all duration-200"
              >
                <ShoppingCart className="mr-1 h-4 w-4" />
                Shop
              </Button>
              <Button 
                onClick={onOpenLeaderboard}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 transform hover:scale-105 transition-all duration-200"
              >
                <Trophy className="mr-1 h-4 w-4" />
                Leaders
              </Button>
            </div>
            
            <Button 
              onClick={onShowAd}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Zap className="mr-2 h-5 w-5" />
              Watch Ad for Bonus
            </Button>
            
            <Button 
              onClick={onBackToMenu}
              variant="ghost"
              className="w-full text-white/80 hover:text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
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
        <Card className="p-8 max-w-sm w-full text-center shadow-2xl bg-gradient-to-br from-slate-700/95 to-slate-800/95 border-slate-500/50">
          <div className="text-4xl mb-4">⏸️</div>
          <h2 className="text-2xl font-bold text-white mb-6">Game Paused</h2>
          
          <div className="space-y-4">
            <Button 
              onClick={onStartGame}
              className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Play className="mr-2 h-5 w-5" />
              Resume
            </Button>
            
            <Button 
              onClick={onBackToMenu}
              variant="outline"
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 transform hover:scale-105 transition-all duration-200"
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
