
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Coins, Trophy, Settings, LogOut, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccountPage = () => {
  const [musicEnabled, setMusicEnabled] = React.useState(true);

  const userStats = {
    username: 'FlappyPlayer',
    totalCoins: 1250,
    highScore: 42,
    totalGames: 156,
    averageScore: 8.5
  };

  return (
    <div className="min-h-screen p-4 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/home">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Account</h1>
        <div className="w-16" />
      </div>

      {/* Profile Card */}
      <Card className="mb-6 p-4 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-800 text-lg">{userStats.username}</h2>
            <p className="text-sm text-gray-600">Flappy Pi Player</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-semibold">{userStats.totalCoins}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold">{userStats.highScore}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card className="mb-6 p-4 bg-white/95 backdrop-blur-sm">
        <h3 className="font-bold text-gray-800 mb-4">Game Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.totalGames}</div>
            <div className="text-sm text-gray-600">Total Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.averageScore}</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card className="mb-6 p-4 bg-white/95 backdrop-blur-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {musicEnabled ? <Volume2 className="h-5 w-5 text-gray-600" /> : <VolumeX className="h-5 w-5 text-gray-600" />}
              <span className="text-gray-700">Background Music</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMusicEnabled(!musicEnabled)}
            >
              {musicEnabled ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Sound Effects</span>
            <Button variant="outline" size="sm">On</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Notifications</span>
            <Button variant="outline" size="sm">On</Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3 mb-8">
        <Link to="/privacy">
          <Card className="p-3 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Privacy Policy</span>
              <span className="text-gray-400">→</span>
            </div>
          </Card>
        </Link>
        
        <Link to="/terms">
          <Card className="p-3 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Terms of Service</span>
              <span className="text-gray-400">→</span>
            </div>
          </Card>
        </Link>
        
        <Link to="/contact">
          <Card className="p-3 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Contact Support</span>
              <span className="text-gray-400">→</span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Logout */}
      <Button 
        variant="destructive" 
        className="w-full mb-8"
        onClick={() => {
          // Handle logout
          console.log('Logging out...');
        }}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default AccountPage;
