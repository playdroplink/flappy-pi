
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, ShoppingCart, Play, Volume2, VolumeX, Zap, Target, Infinity } from 'lucide-react';

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
      title: 'Classic Mode',
      description: 'Traditional Flappy Bird with 3 lives',
      icon: <Play className="h-6 w-6" />,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'endless' as GameMode,
      title: 'Endless Mode',
      description: 'Unlimited lives, compete for high scores',
      icon: <Infinity className="h-6 w-6" />,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'challenge' as GameMode,
      title: 'Challenge Mode',
      description: 'Extra difficult with narrow pipes',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 flex flex-col items-center justify-center text-white p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-8xl mb-4 animate-bounce">🐦</div>
        <h1 className="text-6xl font-bold mb-2 animate-fade-in">Flappy Pi</h1>
        <p className="text-xl opacity-90">Choose your adventure!</p>
      </div>

      {/* Stats Bar */}
      <Card className="bg-white/20 backdrop-blur-sm p-4 mb-8 w-full max-w-md">
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center space-x-2">
            <span>🪙 {coins}</span>
          </div>
          <Button
            onClick={() => onToggleMusic(!musicEnabled)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            {musicEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      {/* Game Modes */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-md mb-8">
        {gameModes.map((mode) => (
          <Card key={mode.id} className="bg-white/10 backdrop-blur-sm border-white/20">
            <Button
              onClick={() => onStartGame(mode.id)}
              className={`w-full h-auto p-6 ${mode.color} text-white flex flex-col items-center space-y-3`}
            >
              {mode.icon}
              <div className="text-center">
                <h3 className="text-lg font-bold">{mode.title}</h3>
                <p className="text-sm opacity-90">{mode.description}</p>
              </div>
            </Button>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-8">
        <Button
          onClick={onOpenShop}
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-green-600"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Pi Shop
        </Button>
        
        <Button
          onClick={onOpenLeaderboard}
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-green-600"
        >
          <Trophy className="mr-2 h-4 w-4" />
          Leaderboard
        </Button>
      </div>

      {/* Pi Ad Network Banner */}
      <Card className="bg-yellow-500/20 border-yellow-400 p-4 max-w-md w-full mb-4">
        <div className="text-center">
          <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-300" />
          <p className="text-sm text-yellow-100">
            Watch Pi Ads to earn extra lives and coins!
          </p>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm opacity-75">
        <p>© 2025 mrwain organization. All rights reserved.</p>
        <p className="mt-1">Powered by Pi Network</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
