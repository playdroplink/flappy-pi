
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy, Crown, Medal, Star, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useSoundEffects } from '../hooks/useSoundEffects';

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const gameState = useGameState();
  const { playSwoosh } = useSoundEffects();

  const handleBack = () => {
    playSwoosh();
    navigate('/');
  };

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, username: 'PiFlyerPro', score: 2847, coins: 1250, avatar: '👑' },
    { rank: 2, username: 'SkyMaster99', score: 2103, coins: 980, avatar: '🥈' },
    { rank: 3, username: 'FlappyKing', score: 1876, coins: 750, avatar: '🥉' },
    { rank: 4, username: 'CloudRider', score: 1654, coins: 600, avatar: '⭐' },
    { rank: 5, username: 'BirdWhisperer', score: 1432, coins: 500, avatar: '🚀' },
    { rank: 6, username: 'PiPilot', score: 1298, coins: 450, avatar: '🎯' },
    { rank: 7, username: 'WingCommander', score: 1156, coins: 400, avatar: '🎮' },
    { rank: 8, username: 'FeatherFlyer', score: 987, coins: 350, avatar: '💫' },
    { rank: 9, username: 'SoarHigh', score: 876, coins: 300, avatar: '🌟' },
    { rank: 10, username: 'PiGamer2024', score: 743, coins: 250, avatar: '🎊' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Trophy className="w-6 h-6 text-blue-500" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 3: return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      default: return 'bg-white';
    }
  };

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
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
          <h1 className="text-4xl font-black text-white drop-shadow-lg">
            Leaderboard
          </h1>
          <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
        </div>
        <p className="text-xl text-white/90 drop-shadow-md">
          Top Flappy Pi Champions! 🏆
        </p>
      </div>

      {/* Your Rank Card */}
      <Card className="max-w-2xl mx-auto mb-6 p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl rounded-xl border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🎮</div>
            <div>
              <p className="text-sm opacity-90">Your Best Score</p>
              <p className="text-2xl font-bold">{gameState.highScore}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Your Rank</p>
            <p className="text-2xl font-bold">#42</p>
          </div>
        </div>
      </Card>

      {/* Leaderboard List */}
      <div className="max-w-2xl mx-auto space-y-3">
        {leaderboardData.map((player) => (
          <Card 
            key={player.rank} 
            className={`p-4 shadow-lg rounded-xl border-0 ${getRankStyle(player.rank)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(player.rank)}
                  <span className="text-2xl font-bold">#{player.rank}</span>
                </div>
                <div className="text-2xl">{player.avatar}</div>
                <div>
                  <p className="font-bold text-lg">{player.username}</p>
                  <div className="flex items-center gap-3 text-sm opacity-80">
                    <span>🎯 {player.score} pts</span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {player.coins}
                    </span>
                  </div>
                </div>
              </div>
              
              {player.rank <= 3 && (
                <div className="text-right">
                  <Star className="w-8 h-8 text-yellow-300 mx-auto" />
                  <p className="text-xs font-bold">Champion</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Prize Info */}
      <Card className="max-w-2xl mx-auto mt-8 p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border-0">
        <div className="text-center">
          <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Weekly Prize Pool</h3>
          <p className="text-gray-600 mb-4">Top 10 players win Pi coins every week!</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg p-3 text-white">
              <p className="text-2xl font-bold">1st</p>
              <p className="text-sm">100 π</p>
            </div>
            <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg p-3 text-gray-800">
              <p className="text-2xl font-bold">2nd</p>
              <p className="text-sm">50 π</p>
            </div>
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-3 text-white">
              <p className="text-2xl font-bold">3rd</p>
              <p className="text-sm">25 π</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
