import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Home, Trophy, ShoppingCart, Coins, Share2, PlayCircle } from 'lucide-react';
import { getDifficulty } from '../utils/gameDifficulty';

interface GameUIProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  score: number;
  level: number;
  lives: number;
  highScore: number;
  coins: number;
  gameMode?: 'classic' | 'endless' | 'challenge';
  onStartGame: () => void;
  onBackToMenu: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onShowAd: () => void;
  onShareScore?: () => void;
  isPausedForRevive?: boolean;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  score,
  level,
  highScore,
  coins,
  gameMode = 'classic',
  onStartGame,
  onBackToMenu,
  onOpenShop,
  onOpenLeaderboard,
  onShowAd,
  onShareScore,
  isPausedForRevive = false
}) => {
  if (gameState === 'playing') {
    const difficulty = getDifficulty(score, gameMode);
    const currentLevel = Math.floor(score / 5) + 1;
    
    return (
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {/* Reorganized Header Container with proper spacing */}
        <div className="flex justify-between items-start p-4 gap-4">
          {/* Left Side - Level Info with compact design */}
          <Card className="px-3 py-2 pointer-events-auto shadow-lg bg-gradient-to-r from-blue-500/95 to-cyan-500/95 backdrop-blur-sm border-0 rounded-xl min-w-[120px]">
            <div className="text-center">
              <div className="text-base font-bold text-white leading-tight">Level {currentLevel}</div>
              <div className="text-xs text-blue-100 capitalize leading-tight">{difficulty.timeOfDay}</div>
              <div className="text-xs text-white/90 uppercase font-medium tracking-wide bg-white/20 px-2 py-0.5 rounded-full mt-1 text-[10px]">
                {gameMode}
              </div>
            </div>
          </Card>

          {/* Right Side - Coins Display with better sizing */}
          <Card className="px-3 py-2 pointer-events-auto shadow-lg bg-gradient-to-r from-amber-400/95 to-yellow-500/95 backdrop-blur-sm border-0 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                <Coins className="h-3 w-3 text-white" />
              </div>
              <span className="text-base font-bold text-white">{coins}</span>
            </div>
          </Card>
        </div>

        {/* Center Score with better positioning */}
        <div className="flex justify-center mt-4">
          <div className="relative">
            <div className="text-6xl font-bold text-white drop-shadow-2xl pointer-events-auto animate-pulse" 
                 style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.8), -2px -2px 0px rgba(0,0,0,0.8), 2px -2px 0px rgba(0,0,0,0.8), -2px 2px 0px rgba(0,0,0,0.8)' }}>
              {score}
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur-xl -z-10"></div>
          </div>
        </div>

        {/* Bottom Indicators with better positioning */}
        {(difficulty.hasMovingPipes || difficulty.hasClouds || difficulty.hasWind) && (
          <div className="absolute bottom-6 left-4">
            <Card className="px-3 py-2 pointer-events-auto shadow-lg bg-gradient-to-r from-red-500/95 to-pink-500/95 backdrop-blur-sm border-0 rounded-xl">
              <div className="flex items-center space-x-2 text-white">
                <div className="text-xs font-bold">⚠️ OBSTACLES:</div>
                <div className="flex space-x-1 text-xs">
                  {difficulty.hasMovingPipes && <span className="bg-white/30 px-2 py-0.5 rounded-full text-[10px]">Moving Pipes</span>}
                  {difficulty.hasClouds && <span className="bg-white/30 px-2 py-0.5 rounded-full text-[10px]">Clouds</span>}
                  {difficulty.hasWind && <span className="bg-white/30 px-2 py-0.5 rounded-full text-[10px]">Wind</span>}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Show crash/continue prompt when paused for revive
  if (gameState === 'paused' && isPausedForRevive) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
        <Card className="p-8 max-w-sm w-full text-center shadow-2xl bg-white border-gray-200">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! You Crashed!
          </h2>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-200 mb-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">{score}</div>
            <div className="text-sm text-blue-500">Current Score</div>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={onShowAd}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Pi Ad to Continue
            </Button>

            <Button 
              onClick={onStartGame}
              variant="outline"
              className="w-full bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
            >
              <Play className="mr-2 h-4 w-4" />
              Start New Game
            </Button>
            
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

  if (gameState === 'gameOver') {
    const difficulty = getDifficulty(score, gameMode);
    const finalLevel = Math.floor(score / 5) + 1;
    
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
              <div className="text-xs text-gray-600 mt-1">
                Reached Level {finalLevel} ({difficulty.timeOfDay}) in {gameMode.toUpperCase()} mode
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                <div className="font-bold text-gray-700">Level Reached</div>
                <div className="text-2xl font-bold text-green-500">{finalLevel}</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                <div className="font-bold text-gray-700">Best Score</div>
                <div className="text-2xl font-bold text-yellow-500">{highScore}</div>
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
