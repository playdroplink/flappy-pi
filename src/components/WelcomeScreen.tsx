
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, ShoppingCart, Trophy, Coins, Volume2, VolumeX, Shield, FileText, HelpCircle, Mail } from 'lucide-react';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

type GameMode = 'classic' | 'endless' | 'challenge';

interface WelcomeScreenProps {
  onStartGame: (mode: GameMode) => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenHelp: () => void;
  coins: number;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartGame,
  onOpenShop,
  onOpenLeaderboard,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenHelp,
  coins,
  musicEnabled,
  onToggleMusic
}) => {
  // Add background music
  useBackgroundMusic({ musicEnabled, gameState: 'menu' });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating clouds */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-pulse"
            style={{
              width: `${40 + i * 10}px`,
              height: `${20 + i * 5}px`,
              left: `${10 + i * 20}%`,
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: '4s'
            }}
          />
        ))}
        
        {/* Geometric shapes */}
        <div className="absolute top-20 right-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-8 w-12 h-12 bg-purple-300/20 rotate-45 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-green-300/20 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
      </div>

      {/* Header Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-6 relative">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <img 
                src="/lovable-uploads/8d2aed26-e6ed-4f65-9613-6ec708c96c50.png" 
                alt="Flappy Pi Character" 
                className="w-full h-full object-contain animate-bounce drop-shadow-2xl"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
            Flappy Pi
          </h1>
          <p className="text-xl text-white/90 font-medium drop-shadow-md">
            Soar with Pi Network! 🚀
          </p>
        </div>

        {/* User Stats Card */}
        <Card className="w-full p-4 mb-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{coins}</div>
                <div className="text-sm text-gray-600">Pi Coins</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleMusic(!musicEnabled)}
              className="text-gray-700 hover:bg-gray-100 w-10 h-10 rounded-full"
            >
              {musicEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>
        </Card>

        {/* Game Modes */}
        <div className="w-full space-y-3 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-white font-bold text-xl text-center mb-4 drop-shadow-md">
            Choose Your Adventure
          </h3>
          
          <Button 
            onClick={() => onStartGame('classic')}
            className="w-full h-14 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
          >
            <Play className="mr-3 h-6 w-6" />
            Classic Mode
          </Button>
          
          <Button 
            onClick={() => onStartGame('endless')}
            className="w-full h-14 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
          >
            <Play className="mr-3 h-6 w-6" />
            Endless Mode
          </Button>
          
          <Button 
            onClick={() => onStartGame('challenge')}
            className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
          >
            <Play className="mr-3 h-6 w-6" />
            Challenge Mode
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            onClick={onOpenShop}
            className="h-12 bg-white/90 hover:bg-white text-gray-800 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 border-0"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Shop
          </Button>
          
          <Button 
            onClick={onOpenLeaderboard}
            className="h-12 bg-white/90 hover:bg-white text-gray-800 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 border-0"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <Card className="p-3 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="grid grid-cols-4 gap-1 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenPrivacy}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2 px-1"
            >
              <Shield className="h-4 w-4" />
              <span className="text-xs">Privacy</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenTerms}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2 px-1"
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs">Terms</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenContact}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2 px-1"
            >
              <Mail className="h-4 w-4" />
              <span className="text-xs">Contact</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenHelp}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2 px-1"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="text-xs">Help</span>
            </Button>
          </div>
          <div className="text-center pt-2 border-t border-gray-200">
            <p className="text-gray-800 text-sm font-bold">
              Powered by Pi Network • MRWAIN ORGANIZATION
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeScreen;
