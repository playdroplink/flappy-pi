
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, ShoppingBag, Trophy, Shield, FileText, Mail, HelpCircle, Volume2, VolumeX, User } from 'lucide-react';

interface WelcomeScreenProps {
  onStartGame: (mode: 'classic' | 'endless' | 'challenge') => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenHelp: () => void;
  onOpenProfile: () => void;
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
  onOpenProfile,
  coins,
  musicEnabled,
  onToggleMusic
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 flex flex-col items-center justify-center p-4">
      {/* Background clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-12 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-10 bg-white rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-16 w-24 h-14 bg-white rounded-full opacity-50 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-12 w-18 h-11 bg-white rounded-full opacity-45 animate-pulse delay-500"></div>
      </div>

      {/* Top Bar with Music Toggle and Profile */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Button
          onClick={() => onToggleMusic(!musicEnabled)}
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white"
        >
          {musicEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        
        <Button
          onClick={onOpenProfile}
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white"
        >
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
      </div>

      {/* Main Content */}
      <div className="text-center space-y-8 z-10">
        {/* Game Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            🐦 Flappy Pi
          </h1>
          <p className="text-xl text-sky-100 max-w-md mx-auto">
            Fly through pipes, earn Pi coins, and compete with friends!
          </p>
        </div>

        {/* Coins Display */}
        <div className="bg-white/90 rounded-lg px-6 py-3 inline-flex items-center space-x-2">
          <span className="text-yellow-500 text-xl">🪙</span>
          <span className="font-bold text-gray-800">{coins.toLocaleString()} Pi Coins</span>
        </div>

        {/* Game Mode Buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Choose Your Challenge</h2>
          <div className="grid gap-4 max-w-sm mx-auto">
            <Button
              onClick={() => onStartGame('classic')}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white text-lg py-6"
            >
              <Play className="mr-3 h-6 w-6" />
              Classic Mode
            </Button>
            
            <Button
              onClick={() => onStartGame('endless')}
              size="lg"
              variant="outline"
              className="bg-white/90 hover:bg-white text-sky-700 text-lg py-6"
            >
              <Play className="mr-3 h-6 w-6" />
              Endless Mode
            </Button>
            
            <Button
              onClick={() => onStartGame('challenge')}
              size="lg"
              variant="outline"
              className="bg-white/90 hover:bg-white text-orange-600 text-lg py-6"
            >
              <Play className="mr-3 h-6 w-6" />
              Challenge Mode
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={onOpenShop}
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white text-purple-600"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Pi Shop
          </Button>
          
          <Button
            onClick={onOpenLeaderboard}
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white text-orange-600"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>
        </div>

        {/* Footer Links */}
        <div className="pt-8">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={onOpenPrivacy}
              className="text-sky-100 hover:text-white underline"
            >
              <Shield className="inline mr-1 h-3 w-3" />
              Privacy
            </button>
            <button
              onClick={onOpenTerms}
              className="text-sky-100 hover:text-white underline"
            >
              <FileText className="inline mr-1 h-3 w-3" />
              Terms
            </button>
            <button
              onClick={onOpenContact}
              className="text-sky-100 hover:text-white underline"
            >
              <Mail className="inline mr-1 h-3 w-3" />
              Contact
            </button>
            <button
              onClick={onOpenHelp}
              className="text-sky-100 hover:text-white underline"
            >
              <HelpCircle className="inline mr-1 h-3 w-3" />
              Help
            </button>
          </div>
          
          <p className="text-sky-200 text-xs mt-4">
            © 2025 mrwain organization. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
