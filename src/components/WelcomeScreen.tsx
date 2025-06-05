
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, ShoppingCart, Trophy, Settings, Coins, Volume2, VolumeX } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600 flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating clouds */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/15 rounded-full animate-pulse"
            style={{
              width: `${80 + i * 15}px`,
              height: `${40 + i * 8}px`,
              left: `${5 + i * 15}%`,
              top: `${15 + i * 12}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '4s'
            }}
          />
        ))}
        
        {/* Flying birds */}
        <div className="absolute top-20 left-0 w-full">
          <div className="text-2xl animate-pulse" style={{ animationDuration: '2s' }}>
            🐦
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <Card className="p-6 text-center mb-6 animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce">🐦</div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Flappy Pi
          </h1>
          <p className="text-white/90">Ready for takeoff?</p>
        </Card>

        {/* User stats */}
        <Card className="p-4 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-bold">{coins}</span>
              <span className="text-white/80 text-sm">Pi Coins</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleMusic(!musicEnabled)}
              className="text-white hover:bg-white/20"
            >
              {musicEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </Card>

        {/* Game modes */}
        <Card className="p-6 mb-6 space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-white font-bold text-lg mb-4">Choose Your Adventure</h3>
          
          <Button 
            onClick={() => onStartGame('classic')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Play className="mr-2 h-5 w-5" />
            Classic Mode
          </Button>
          
          <Button 
            onClick={() => onStartGame('endless')}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Play className="mr-2 h-5 w-5" />
            Endless Mode
          </Button>
          
          <Button 
            onClick={() => onStartGame('challenge')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Play className="mr-2 h-5 w-5" />
            Challenge Mode
          </Button>
        </Card>

        {/* Menu options */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            onClick={onOpenShop}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 transform hover:scale-105 transition-all duration-200"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Shop
          </Button>
          
          <Button 
            onClick={onOpenLeaderboard}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 transform hover:scale-105 transition-all duration-200"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-white/60 text-sm">
            Powered by Pi Network
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
