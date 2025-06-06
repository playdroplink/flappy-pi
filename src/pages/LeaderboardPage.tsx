
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLeaderboard } from '@/hooks/useLeaderboard';

const LeaderboardPage = () => {
  const { leaderboard, loading, fetchLeaderboard } = useLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-500" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <Trophy className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 2: return 'from-gray-50 to-slate-50 border-gray-200';
      case 3: return 'from-amber-50 to-orange-50 border-amber-200';
      default: return 'from-blue-50 to-indigo-50 border-blue-100';
    }
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
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchLeaderboard}
          disabled={loading}
          className="text-white hover:text-white hover:bg-white/20"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Prize Pool Info */}
      <Card className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="text-center">
          <h3 className="font-bold text-gray-800 mb-2">🎯 Weekly Prize Pool</h3>
          <p className="text-gray-700 text-sm mb-3">Top players win Pi coins every week!</p>
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <span>🥇 100 Pi</span>
            <span>🥈 50 Pi</span>
            <span>🥉 25 Pi</span>
          </div>
        </div>
      </Card>

      {/* Leaderboard List */}
      <div className="space-y-3 pb-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-white">Loading leaderboard...</div>
          </div>
        ) : leaderboard.length === 0 ? (
          <Card className="p-6 text-center">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No scores yet!</p>
            <p className="text-sm text-gray-500">Be the first to set a high score!</p>
          </Card>
        ) : (
          leaderboard.map((player, index) => {
            const rank = index + 1;
            return (
              <Card 
                key={player.id} 
                className={`p-4 bg-gradient-to-r ${getRankColor(rank)} border`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(rank)}
                      <span className="font-bold text-gray-800">#{rank}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{player.username}</div>
                      <div className="text-sm text-gray-600">{player.total_games} games</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800 text-lg">
                      {player.highest_score.toLocaleString()}
                    </div>
                    <div className="text-gray-600 text-sm">points</div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
