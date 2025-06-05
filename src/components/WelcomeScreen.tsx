
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, ShoppingCart, Play, Volume2, VolumeX, Zap, Target, Infinity, Star, Coins, Settings, Award } from 'lucide-react';

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
      description: 'Original Flappy Bird experience',
      icon: <Play className="h-6 w-6" />,
      gradient: 'from-sky-500 to-sky-600',
      hoverGradient: 'hover:from-sky-600 hover:to-sky-700',
      reward: '🏆 Perfect for beginners',
      difficulty: 'Easy'
    },
    {
      id: 'endless' as GameMode,
      title: 'Endless Journey',
      description: 'Infinite adventure with rewards',
      icon: <Infinity className="h-6 w-6" />,
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'hover:from-blue-600 hover:to-indigo-700',
      reward: '💰 Double coin rewards',
      difficulty: 'Medium'
    },
    {
      id: 'challenge' as GameMode,
      title: 'Storm Challenge',
      description: 'Extreme difficulty for pros',
      icon: <Target className="h-6 w-6" />,
      gradient: 'from-red-500 to-pink-600',
      hoverGradient: 'hover:from-red-600 hover:to-pink-700',
      reward: '⚡ 3x XP & Coins',
      difficulty: 'Hard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Modern background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20">
              <div className="relative">
                <img 
                  src="/lovable-uploads/5a55528e-3d0c-4cd3-91d9-6b8cff953b06.png" 
                  alt="Flappy Pi Bird" 
                  className="w-8 h-8 object-contain animate-float"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent">
                Flappy Pi
              </h1>
              <p className="text-xs text-sky-200">Ready to fly?</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onToggleMusic(!musicEnabled)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0 border border-white/20"
            >
              {musicEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0 border border-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Player stats */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 mb-8 rounded-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-500/20 rounded-full px-3 py-2">
                <Coins className="h-5 w-5 text-yellow-400" />
                <span className="font-bold text-white">{coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2 bg-sky-500/20 rounded-full px-3 py-2">
                <Award className="h-5 w-5 text-sky-300" />
                <span className="font-bold text-white">Level 1</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-sky-200">Today's Best</p>
              <p className="text-lg font-bold text-white">0</p>
            </div>
          </div>
        </Card>

        {/* Game Modes */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold text-center mb-4 text-white">Choose Your Adventure</h2>
          {gameModes.map((mode, index) => (
            <Card key={mode.id} className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden rounded-2xl">
              <Button
                onClick={() => onStartGame(mode.id)}
                className={`w-full h-auto p-0 bg-gradient-to-r ${mode.gradient} ${mode.hoverGradient} text-white border-0 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="p-6 w-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 rounded-full p-2">
                        {mode.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold">{mode.title}</h3>
                        <p className="text-sm opacity-90">{mode.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        mode.difficulty === 'Easy' ? 'bg-green-500/30 text-green-100' :
                        mode.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-100' :
                        'bg-red-500/30 text-red-100'
                      }`}>
                        {mode.difficulty}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium">{mode.reward}</p>
                  </div>
                </div>
              </Button>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={onOpenShop}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg rounded-xl py-4 transform hover:scale-105 transition-all duration-200"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Pi Shop
          </Button>
          
          <Button
            onClick={onOpenLeaderboard}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg rounded-xl py-4 transform hover:scale-105 transition-all duration-200"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        </div>

        {/* Daily bonus */}
        <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 p-4 mb-6 rounded-2xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-green-300 animate-pulse" />
              <span className="text-sm font-semibold text-green-200">Daily Bonus Ready!</span>
            </div>
            <p className="text-xs text-green-100">
              🎁 Collect your daily Pi coins & unlock exclusive rewards
            </p>
          </div>
        </Card>

        {/* Ad network banner */}
        <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/30 p-3 mb-4 rounded-xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Zap className="h-4 w-4 text-indigo-300 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-200">Pi Ad Network</span>
            </div>
            <p className="text-xs text-indigo-100">
              ⚡ Watch ads for bonus lives & power-ups
            </p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-xs opacity-75 mt-4">
        <p className="font-medium text-sky-100">© 2025 mrwain organization</p>
        <p className="mt-1 text-sky-200">🌟 Powered by Pi Network • Made with ❤️</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
