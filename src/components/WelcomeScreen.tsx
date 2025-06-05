
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, ShoppingCart, Play, Volume2, VolumeX, Zap, Target, Infinity, Star, Coins, Calendar } from 'lucide-react';

type GameMode = 'classic' | 'endless' | 'challenge';

interface WelcomeScreenProps {
  onStartGame: (mode: GameMode) => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  coins: number;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartGame,
  onOpenShop,
  onOpenLeaderboard,
  coins,
  musicEnabled,
  onToggleMusic
}) => {
  const gameModes = [
    {
      id: 'classic' as GameMode,
      title: 'Classic Flight',
      description: '3 lives to reach the sky!',
      icon: <Play className="h-8 w-8" />,
      color: 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700',
      reward: '🏆 Best for beginners'
    },
    {
      id: 'endless' as GameMode,
      title: 'Sky Marathon',
      description: 'Unlimited flight adventure',
      icon: <Infinity className="h-8 w-8" />,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      reward: '💰 More coins per pipe'
    },
    {
      id: 'challenge' as GameMode,
      title: 'Storm Mode',
      description: 'Narrow pipes, high rewards',
      icon: <Target className="h-8 w-8" />,
      color: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700',
      reward: '⚡ 2x XP & Coins'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating pipes in background */}
        <div className="absolute top-10 left-5 w-8 h-32 bg-green-500/20 rounded-lg animate-pulse"></div>
        <div className="absolute top-40 right-8 w-8 h-28 bg-green-500/20 rounded-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-20 left-1/4 w-6 h-24 bg-green-500/20 rounded-lg animate-pulse delay-1000"></div>
        
        {/* Floating coins */}
        <div className="absolute top-32 right-1/4 text-2xl animate-bounce">🪙</div>
        <div className="absolute bottom-40 right-12 text-xl animate-bounce delay-300">💎</div>
        <div className="absolute top-1/2 left-8 text-lg animate-bounce delay-700">⭐</div>
      </div>

      {/* Header with your character */}
      <div className="text-center mb-8 relative z-10">
        <div className="relative">
          <div className="text-7xl mb-4 animate-bounce">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-sky-300 rounded-full blur-lg opacity-60 animate-pulse"></div>
              <img 
                src="/lovable-uploads/5a55528e-3d0c-4cd3-91d9-6b8cff953b06.png" 
                alt="Flappy Pi Bird" 
                className="relative w-24 h-24 object-contain"
              />
            </div>
          </div>
          {/* Tap indicators */}
          <div className="absolute -top-4 -right-8 text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 animate-pulse">
            TAP!
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-2 animate-fade-in bg-gradient-to-r from-sky-100 via-sky-200 to-sky-100 bg-clip-text text-transparent">
          Flappy Pi
        </h1>
        <p className="text-xl opacity-90 font-semibold">🚀 Choose your sky adventure!</p>
      </div>

      {/* Daily stats */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 mb-6 w-full max-w-md">
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-yellow-500/20 rounded-full px-3 py-1">
              <Coins className="h-4 w-4 text-yellow-400" />
              <span className="font-bold">{coins}</span>
            </div>
            <div className="flex items-center space-x-1 bg-sky-500/20 rounded-full px-3 py-1">
              <Star className="h-4 w-4 text-sky-300" />
              <span className="font-bold">Level 1</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onToggleMusic(!musicEnabled)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
            >
              {musicEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* Game Modes */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-md mb-8">
        {gameModes.map((mode) => (
          <Card key={mode.id} className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
            <Button
              onClick={() => onStartGame(mode.id)}
              className={`w-full h-auto p-6 ${mode.color} text-white flex flex-col items-center space-y-3 border-0 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200`}
            >
              <div className="flex items-center space-x-3">
                {mode.icon}
                <div className="text-left">
                  <h3 className="text-lg font-bold">{mode.title}</h3>
                  <p className="text-sm opacity-90">{mode.description}</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                {mode.reward}
              </div>
            </Button>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <Button
          onClick={onOpenShop}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg px-6 py-3 rounded-full transform hover:scale-105 transition-all duration-200"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Pi Shop
        </Button>
        
        <Button
          onClick={onOpenLeaderboard}
          className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white border-0 shadow-lg px-6 py-3 rounded-full transform hover:scale-105 transition-all duration-200"
        >
          <Trophy className="mr-2 h-5 w-5" />
          Champions
        </Button>
      </div>

      {/* Daily bonus banner */}
      <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 p-4 max-w-md w-full mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-green-300" />
            <span className="text-sm font-semibold text-green-200">Daily Bonus Available!</span>
          </div>
          <p className="text-xs text-green-100">
            🎁 Login daily for free Pi coins & exclusive skins!
          </p>
        </div>
      </Card>

      {/* Pi Ad Network Banner */}
      <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30 p-4 max-w-md w-full mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="h-6 w-6 text-yellow-300 animate-pulse" />
            <span className="text-sm font-semibold text-yellow-100">Pi Ad Network</span>
          </div>
          <p className="text-xs text-yellow-100">
            ⚡ Watch ads for extra lives, coins & power-ups!
          </p>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm opacity-75 relative z-10">
        <p className="font-medium">© 2025 mrwain organization. All rights reserved.</p>
        <p className="mt-1 text-xs">🌟 Powered by Pi Network • Made with ❤️</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
