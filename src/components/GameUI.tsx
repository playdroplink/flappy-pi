
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, ShoppingCart, Play, Home, Zap, Heart, Star, Award, Coins } from 'lucide-react';

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
      {/* Enhanced Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center space-x-2">
          <Card className="px-4 py-2 bg-gradient-to-r from-violet-500/90 to-purple-600/90 backdrop-blur-sm border-violet-300/50 shadow-lg">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-300" />
              <p className="text-sm font-bold text-white">{score}</p>
            </div>
          </Card>
          <Card className="px-4 py-2 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-sm border-blue-300/50 shadow-lg">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-blue-200" />
              <p className="text-sm font-bold text-white">L{level}</p>
            </div>
          </Card>
          <Card className="px-4 py-2 bg-gradient-to-r from-red-500/90 to-pink-600/90 backdrop-blur-sm border-red-300/50 shadow-lg">
            <div className="flex items-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`h-4 w-4 ${i < lives ? 'text-red-300 fill-red-300' : 'text-gray-400'}`} 
                />
              ))}
            </div>
          </Card>
        </div>
        
        <div className="flex items-center space-x-2">
          <Card className="px-4 py-2 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm border-yellow-300/50 shadow-lg">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-yellow-200" />
              <p className="text-sm font-bold text-white">{coins}</p>
            </div>
          </Card>
          <Button
            onClick={onShowAd}
            size="sm"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg rounded-full h-10 w-10 p-0"
          >
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Game Over Screen */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <Card className="relative p-8 max-w-md w-full mx-4 bg-gradient-to-br from-violet-600/95 to-purple-700/95 backdrop-blur-sm border-violet-300/50 shadow-2xl rounded-2xl">
            <div className="text-center space-y-6 text-white">
              <div>
                <div className="text-6xl mb-4">😵</div>
                <h2 className="text-3xl font-bold text-yellow-300 mb-3 animate-pulse">Game Over!</h2>
                
                <div className="bg-white/10 rounded-xl p-4 mb-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Final Score:</span>
                    <span className="text-2xl font-bold text-yellow-300">{score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Level Reached:</span>
                    <span className="text-xl font-bold text-blue-300">{level}</span>
                  </div>
                  {score === highScore && score > 0 && (
                    <div className="bg-yellow-500/20 rounded-lg p-2 animate-pulse">
                      <p className="text-yellow-300 font-bold">🎉 NEW HIGH SCORE! 🎉</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-green-500/20 rounded-lg p-3 border border-green-400/30">
                  <p className="text-green-300 font-bold">
                    💰 +{Math.floor(score / 3) + (level * 2)} Pi Coins Earned!
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={onStartGame}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 text-lg font-bold border-0 shadow-lg rounded-xl transform hover:scale-105 transition-all duration-200"
                  size="lg"
                >
                  <Play className="mr-2 h-6 w-6" />
                  🚀 Fly Again!
                </Button>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={onOpenShop}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg rounded-xl py-3"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Pi Shop
                  </Button>
                  
                  <Button
                    onClick={onShowAd}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg rounded-xl py-3"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Watch Ad
                  </Button>
                </div>
                
                <Button
                  onClick={onBackToMenu}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/20 rounded-xl py-3"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Menu
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Enhanced Playing State Instructions */}
      {gameState === 'playing' && score === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Card className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full border-violet-300/50 shadow-lg animate-bounce">
            <p className="text-lg font-bold text-violet-600 animate-pulse">
              👆 TAP TO FLY! 🐦
            </p>
          </Card>
        </div>
      )}

      {/* Score milestone celebrations */}
      {gameState === 'playing' && score > 0 && score % 10 === 0 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="text-4xl font-bold text-yellow-300 animate-bounce">
            🌟 AMAZING! 🌟
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
