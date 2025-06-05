import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Home, Trophy, ShoppingCart, Coins, Share2, PlayCircle } from 'lucide-react';

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
  onShareScore?: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  score,
  level,
  highScore,
  coins,
  onStartGame,
  onBackToMenu,
  onOpenShop,
  onOpenLeaderboard,
  onShowAd,
  onShareScore
}) => {
  if (gameState === 'playing') {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {/* Score at top center like Flappy Bird */}
        <div className="flex justify-center pt-8">
          <div className="text-6xl font-bold text-white drop-shadow-2xl pointer-events-auto" 
               style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8)' }}>
            {score}
          </div>
        </div>

        {/* Coins display - top right */}
        <div className="absolute top-4 right-4">
          <Card className="px-4 py-3 pointer-events-auto shadow-2xl bg-white/90 backdrop-blur-sm border-yellow-200">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-bold text-gray-800">{coins}</span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
        <Card className="p-8 max-w-sm w-full text-center shadow-2xl bg-white border-gray-200">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Game Over!
          </h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-1">{score}</div>
              <div className="text-sm text-blue-500">Final Score</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                <div className="font-bold text-gray-700">Level Reached</div>
                <div className="text-2xl font-bold text-green-500">{level}</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                <div className="font-bold text-gray-700">Best Score</div>
                <div className="text-2xl font-bold text-yellow-500">{highScore}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Continue with Ad button */}
            <Button 
              onClick={onShowAd}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Continue (Watch Pi Ad)
            </Button>

            <Button 
              onClick={onStartGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Play className="mr-2 h-5 w-5" />
              Try Again
            </Button>
            
            {/* Share Score button */}
            {onShareScore && (
              <Button 
                onClick={onShareScore}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share Your Score
              </Button>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onOpenShop}
                variant="outline"
                className="bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
              >
                <ShoppingCart className="mr-1 h-4 w-4" />
                Shop
              </Button>
              <Button 
                onClick={onOpenLeaderboard}
                variant="outline"
                className="bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
              >
                <Trophy className="mr-1 h-4 w-4" />
                Leaders
              </Button>
            </div>
            
            <Button 
              onClick={onBackToMenu}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="p-8 max-w-sm w-full text-center shadow-2xl bg-white border-gray-200">
          <div className="text-4xl mb-4">⏸️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Game Paused</h2>
          
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
              className="w-full bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
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
