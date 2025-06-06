
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
        {/* Flappy Bird Style Header - Centered Score */}
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <div className="bg-white/95 rounded-xl px-6 py-3 shadow-xl border-2 border-gray-300">
            <div className="text-4xl font-black text-gray-800 text-center tracking-tight">
              {score}
            </div>
          </div>
        </div>

        {/* Top Left - Flappy Pi Branding */}
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-3 py-2 text-white font-bold shadow-lg backdrop-blur-sm">
            <div className="text-sm">🐦 Flappy Pi</div>
            <div className="text-xs opacity-80">Level {level}</div>
            <div className="text-xs uppercase tracking-wide">{gameMode}</div>
          </div>
        </div>

        {/* Top Right - Quick Actions */}
        <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto">
          <Button
            onClick={onOpenShop}
            size="sm"
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg w-10 h-10 p-0"
          >
            🛒
          </Button>
          <Button
            onClick={onOpenLeaderboard}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg w-10 h-10 p-0"
          >
            🏆
          </Button>
        </div>
        
        {/* Bottom Left - Lives and Flappy Coins */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-red-500/90 rounded-lg px-3 py-2 backdrop-blur-sm shadow-lg">
            <Heart className="w-4 h-4 text-red-100" />
            <span className="text-white font-bold text-sm">{lives}</span>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg px-3 py-2 text-white font-bold shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-100" />
              <span className="text-sm font-bold">{coins}</span>
            </div>
            <div className="text-xs opacity-80">Flappy Coins</div>
          </div>
        </div>

        {/* Bottom Right - Copyright */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/50 rounded-lg px-3 py-2 text-white text-xs opacity-70">
            © 2025 mrwain organization
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
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={onShowAd}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                🔄 Revive with Ad
              </Button>
              <Button 
                onClick={onShareScore}
                variant="outline"
                className="flex-1"
              >
                <Star className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={onOpenLeaderboard}
                variant="outline"
                className="flex-1 text-white bg-purple-500 hover:bg-purple-600 border-purple-500"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
              <Button 
                onClick={onOpenShop}
                className="flex-1 text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                <Menu className="w-4 h-4 mr-2" />
                Shop
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
