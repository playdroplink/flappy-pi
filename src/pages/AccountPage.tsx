
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, User, Coins, Trophy, Settings, Volume2, VolumeX, Crown, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useSoundEffects } from '../hooks/useSoundEffects';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const gameState = useGameState();
  const { playSwoosh } = useSoundEffects();

  const handleBack = () => {
    playSwoosh();
    navigate('/');
  };

  const achievements = [
    { id: 1, title: 'First Flight', description: 'Score your first point', icon: '🎯', earned: true },
    { id: 2, title: 'High Flyer', description: 'Reach score of 50', icon: '🚀', earned: true },
    { id: 3, title: 'Coin Collector', description: 'Earn 100 Flappy Coins', icon: '💰', earned: gameState.coins >= 100 },
    { id: 4, title: 'Sky Master', description: 'Reach score of 100', icon: '👑', earned: false },
    { id: 5, title: 'Legendary Bird', description: 'Reach score of 500', icon: '⭐', earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="lg"
          className="text-white hover:bg-white/20 rounded-xl"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-3 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
          <Coins className="w-6 h-6 text-yellow-500" />
          <span className="text-xl font-bold text-gray-800">{gameState.coins}</span>
          <span className="text-sm text-gray-600">Flappy Coins</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
          My Account
        </h1>
        <p className="text-xl text-white/90 drop-shadow-md">
          Your Flappy Pi profile and stats 📊
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Pi Player</h2>
              <p className="text-gray-600">Connected to Pi Network</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{gameState.highScore}</p>
              <p className="text-sm text-green-600">High Score</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg">
              <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-800">{gameState.coins}</p>
              <p className="text-sm text-yellow-600">Flappy Coins</p>
            </div>
          </div>
        </Card>

        {/* Settings Card */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border-0">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Game Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Background Music</p>
                <p className="text-sm text-gray-600">Toggle game soundtrack</p>
              </div>
              <Button
                onClick={() => gameState.setMusicEnabled(!gameState.musicEnabled)}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                {gameState.musicEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    On
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 mr-2" />
                    Off
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Selected Bird Skin</p>
                <p className="text-sm text-gray-600">Current: {gameState.selectedBirdSkin}</p>
              </div>
              <Button
                onClick={() => navigate('/skins')}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                Change Skin
              </Button>
            </div>
          </div>
        </Card>

        {/* Achievements Card */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border-0">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-6 h-6" />
            Achievements
          </h3>
          
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className={`font-bold ${
                      achievement.earned ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </p>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="text-green-600">
                      <Crown className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/shop')}
            className="h-16 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl"
          >
            <Zap className="w-6 h-6 mr-2" />
            Visit Shop
          </Button>
          <Button
            onClick={() => navigate('/leaderboard')}
            className="h-16 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl"
          >
            <Trophy className="w-6 h-6 mr-2" />
            Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
