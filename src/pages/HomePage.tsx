
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, ShoppingCart, Trophy, Coins, Volume2, VolumeX, Shield, FileText, HelpCircle, Mail, BookOpen, Settings } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const gameState = useGameState();
  const { playSwoosh } = useSoundEffects();
  const navigate = useNavigate();

  // Add background music
  useBackgroundMusic({ musicEnabled: gameState.musicEnabled, gameState: 'menu' });

  const handleNavigation = (path: string) => {
    playSwoosh();
    navigate(path);
  };

  const handleGameModeSelect = (mode: 'classic' | 'endless' | 'challenge') => {
    playSwoosh();
    gameState.startGame(mode);
    navigate('/play');
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 flex flex-col overflow-hidden">
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
        <div className="absolute top-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-8 w-12 h-12 bg-white/10 rotate-45 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-white/10 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
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
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
            Flappy Pi
          </h1>
          <p className="text-xl text-white/90 font-medium drop-shadow-md">
            Soar with Pi Network! 🚀
          </p>
        </div>

        {/* User Stats Card - Simplified without difficulty selection */}
        <Card className="w-full p-4 mb-6 bg-white/95 backdrop-blur-sm shadow-xl animate-fade-in rounded-xl border-0" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{gameState.coins}</div>
                <div className="text-sm text-gray-600">Flappy Coins</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => gameState.setMusicEnabled(!gameState.musicEnabled)}
              className="text-gray-700 hover:bg-gray-100 w-10 h-10 rounded-full"
            >
              {gameState.musicEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>
        </Card>

        {/* New Player Tutorial Button */}
        <div className="w-full mb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button 
            onClick={() => handleNavigation('/help')}
            className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 border-0 rounded-xl"
          >
            <BookOpen className="mr-3 h-6 w-6" />
            How to Play Tutorial
          </Button>
        </div>

        {/* Game Modes */}
        <div className="w-full space-y-3 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-white font-bold text-xl text-center mb-4 drop-shadow-md">
            Choose Your Adventure
          </h3>
          
          <Button 
            onClick={() => handleGameModeSelect('classic')}
            className="w-full h-14 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 border-0 rounded-xl"
          >
            <Play className="mr-3 h-6 w-6" />
            Classic Mode
          </Button>
          
          <Button 
            onClick={() => handleGameModeSelect('endless')}
            className="w-full h-14 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 border-0 rounded-xl"
          >
            <Play className="mr-3 h-6 w-6" />
            Endless Mode
          </Button>
          
          <Button 
            onClick={() => handleGameModeSelect('challenge')}
            className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 border-0 rounded-xl"
          >
            <Play className="mr-3 h-6 w-6" />
            Challenge Mode
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            onClick={() => handleNavigation('/shop')}
            className="h-12 bg-white/90 hover:bg-white text-gray-800 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 border-0 rounded-xl"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Shop
          </Button>
          
          <Button 
            onClick={() => handleNavigation('/leaderboard')}
            className="h-12 bg-white/90 hover:bg-white text-gray-800 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 border-0 rounded-xl"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <Card className="p-3 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border-0">
          <div className="grid grid-cols-4 gap-1 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavigation('/privacy')}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2 px-1 rounded-lg"
            >
              <Shield className="h-4 w-4" />
              <span className="text-xs">Privacy</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavigation('/terms')}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2 px-1 rounded-lg"
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs">Terms</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavigation('/contact')}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2 px-1 rounded-lg"
            >
              <Mail className="h-4 w-4" />
              <span className="text-xs">Contact</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavigation('/settings')}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-2 px-1 rounded-lg"
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs">Account</span>
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

export default HomePage;
