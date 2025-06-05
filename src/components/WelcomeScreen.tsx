
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, ShoppingCart, Trophy, Coins, Volume2, VolumeX, Shield, FileText, HelpCircle, Mail } from 'lucide-react';

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
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600 flex flex-col relative overflow-hidden">
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
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <Card className="p-6 text-center animate-fade-in bg-white/90 backdrop-blur-sm">
            <div className="mb-4 flex justify-center">
              <img 
                src="/lovable-uploads/616a87a7-bd9c-414f-a05b-09c6f7a38ef9.png" 
                alt="Flappy Pi Character" 
                className="w-16 h-16 animate-bounce"
              />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-2">
              Flappy Pi
            </h1>
            <p className="text-gray-700">Ready for takeoff?</p>
          </Card>

          {/* User stats */}
          <Card className="p-4 animate-fade-in bg-white/90 backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-800 font-bold">{coins}</span>
                <span className="text-gray-600 text-sm">Pi Coins</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleMusic(!musicEnabled)}
                className="text-gray-700 hover:bg-gray-100"
              >
                {musicEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </Card>

          {/* Game modes */}
          <Card className="p-6 space-y-4 animate-fade-in bg-white/90 backdrop-blur-sm" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-gray-800 font-bold text-lg mb-4">Choose Your Adventure</h3>
            
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
              className="bg-white/80 border-white/50 text-gray-700 hover:bg-white/90 transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Shop
            </Button>
            
            <Button 
              onClick={onOpenLeaderboard}
              variant="outline"
              className="bg-white/80 border-white/50 text-gray-700 hover:bg-white/90 transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-white/50">
          <div className="grid grid-cols-4 gap-2 text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2"
            >
              <Shield className="h-4 w-4" />
              <span className="text-xs">Privacy</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2"
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs">Terms</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2"
            >
              <Mail className="h-4 w-4" />
              <span className="text-xs">Contact</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="text-xs">Help</span>
            </Button>
          </div>
          <div className="text-center mt-3 pt-3 border-t border-gray-200">
            <p className="text-gray-600 text-xs">
              Powered by Pi Network • mrwain organization
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeScreen;
