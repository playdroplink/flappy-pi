
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, ShoppingCart, Play, Home } from 'lucide-react';

interface GameUIProps {
  gameState: 'menu' | 'playing' | 'gameOver';
  score: number;
  highScore: number;
  coins: number;
  onStartGame: () => void;
  onBackToMenu: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  score,
  highScore,
  coins,
  onStartGame,
  onBackToMenu,
  onOpenShop,
  onOpenLeaderboard
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center space-x-4">
          <Card className="px-3 py-2 bg-white/90 backdrop-blur-sm">
            <p className="text-sm font-bold text-gray-800">Score: {score}</p>
          </Card>
          <Card className="px-3 py-2 bg-white/90 backdrop-blur-sm">
            <p className="text-sm font-bold text-gray-800">Best: {highScore}</p>
          </Card>
        </div>
        
        <Card className="px-3 py-2 bg-yellow-100/90 backdrop-blur-sm border-yellow-300">
          <p className="text-sm font-bold text-yellow-800">🪙 {coins}</p>
        </Card>
      </div>

      {/* Menu Screen */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <Card className="p-8 max-w-md w-full mx-4 bg-white/95 backdrop-blur-sm">
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-green-600 mb-2">🐦 Flappy Pi</h1>
                <p className="text-gray-600">Tap to flap and avoid the pipes!</p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={onStartGame}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg"
                  size="lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Game
                </Button>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={onOpenShop}
                    variant="outline"
                    className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Shop
                  </Button>
                  
                  <Button
                    onClick={onOpenLeaderboard}
                    variant="outline"
                    className="flex-1 border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 space-y-1">
                <p>🖱️ Click or tap to flap</p>
                <p>⌨️ Press spacebar to flap</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <Card className="p-8 max-w-md w-full mx-4 bg-white/95 backdrop-blur-sm">
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-red-500 mb-2">Game Over!</h2>
                <p className="text-2xl font-bold text-gray-800">Score: {score}</p>
                {score === highScore && score > 0 && (
                  <p className="text-yellow-600 font-bold animate-pulse">🎉 New High Score!</p>
                )}
                <p className="text-green-600 mt-2">+{Math.floor(score / 5)} coins earned!</p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={onStartGame}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg"
                  size="lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Play Again
                </Button>
                
                <Button
                  onClick={onBackToMenu}
                  variant="outline"
                  className="w-full"
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Card className="px-4 py-2 bg-white/80 backdrop-blur-sm">
            <p className="text-sm text-gray-700 animate-pulse">Tap to flap!</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GameUI;
