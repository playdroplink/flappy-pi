
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, ShoppingCart, Play, Home, Zap, Heart, Star, Award, Coins, Pause, RotateCcw } from 'lucide-react';

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
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Modern Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto z-10">
        <div className="flex flex-col space-y-2">
          {/* Score Display */}
          <Card className="px-4 py-2 bg-white/10 backdrop-blur-md border-white/20 shadow-lg rounded-xl">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <div className="text-white">
                <p className="text-xs opacity-80">Score</p>
                <p className="text-lg font-bold leading-none">{score}</p>
              </div>
            </div>
          </Card>
          
          {/* Level Display */}
          <Card className="px-4 py-2 bg-white/10 backdrop-blur-md border-white/20 shadow-lg rounded-xl">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-sky-400" />
              <div className="text-white">
                <p className="text-xs opacity-80">Level</p>
                <p className="text-lg font-bold leading-none">{level}</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          {/* Lives Display */}
          <Card className="px-4 py-2 bg-white/10 backdrop-blur-md border-white/20 shadow-lg rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <Heart 
                    key={i} 
                    className={`h-4 w-4 ${i < lives ? 'text-red-400 fill-red-400' : 'text-gray-500'}`} 
                  />
                ))}
              </div>
              <div className="text-white">
                <p className="text-xs opacity-80">Lives</p>
                <p className="text-lg font-bold leading-none">{lives}</p>
              </div>
            </div>
          </Card>
          
          {/* Coins Display */}
          <Card className="px-4 py-2 bg-white/10 backdrop-blur-md border-white/20 shadow-lg rounded-xl">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-yellow-400" />
              <div className="text-white">
                <p className="text-xs opacity-80">Coins</p>
                <p className="text-lg font-bold leading-none">{coins}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <Card className="relative p-8 max-w-sm w-full mx-4 bg-white/95 backdrop-blur-md border-white/30 shadow-2xl rounded-3xl">
            <div className="text-center space-y-6">
              {/* Game Over Header */}
              <div>
                <div className="text-6xl mb-4 animate-bounce">💥</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
                <p className="text-gray-600">Better luck next time, pilot!</p>
              </div>
              
              {/* Stats Display */}
              <div className="bg-gradient-to-r from-sky-50 to-sky-100 rounded-2xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Final Score</p>
                    <p className="text-2xl font-bold text-sky-600">{score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Level Reached</p>
                    <p className="text-2xl font-bold text-sky-600">{level}</p>
                  </div>
                </div>
                
                {score === highScore && score > 0 && (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-3 animate-pulse">
                    <p className="text-yellow-800 font-bold text-sm">🎉 NEW HIGH SCORE! 🎉</p>
                  </div>
                )}
                
                <div className="bg-green-100 border border-green-300 rounded-xl p-3">
                  <p className="text-green-800 font-bold text-sm">
                    💰 +{Math.floor(score / 3) + (level * 2)} Pi Coins Earned!
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={onStartGame}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white py-4 text-lg font-bold border-0 shadow-lg rounded-2xl transform hover:scale-105 transition-all duration-200"
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Try Again
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={onOpenShop}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg rounded-xl py-3"
                  >
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Shop
                  </Button>
                  
                  <Button
                    onClick={onShowAd}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg rounded-xl py-3"
                  >
                    <Zap className="mr-1 h-4 w-4" />
                    Ad
                  </Button>
                </div>
                
                <Button
                  onClick={onBackToMenu}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Menu
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Playing State Instructions */}
      {gameState === 'playing' && score === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Card className="px-6 py-4 bg-white/90 backdrop-blur-md rounded-2xl border-white/50 shadow-lg animate-bounce">
            <div className="text-center">
              <p className="text-lg font-bold text-sky-600 mb-1">👆 TAP TO FLY</p>
              <p className="text-sm text-gray-600">Avoid the pipes!</p>
            </div>
          </Card>
        </div>
      )}

      {/* Score milestone celebrations */}
      {gameState === 'playing' && score > 0 && score % 10 === 0 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
          <div className="text-center animate-bounce">
            <div className="text-4xl font-bold text-white mb-2">🌟</div>
            <p className="text-xl font-bold text-white">AMAZING!</p>
            <p className="text-sm text-sky-200">Keep going!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
