
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award, Crown, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLeaderboard } from '@/hooks/useLeaderboard';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { leaderboard, loading, fetchLeaderboard } = useLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-500" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-100 to-amber-100 border-yellow-300';
      case 2:
        return 'from-gray-100 to-slate-100 border-gray-300';
      case 3:
        return 'from-amber-100 to-orange-100 border-amber-300';
      default:
        return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  const getPlayerAvatar = (rank: number) => {
    const avatars = ['👑', '🥈', '🥉', '🐦', '☁️', '🪶', '🔍', '💃', '✈️', '🥷'];
    return avatars[rank - 1] || '🎮';
  };

  const getRankLabel = (rank: number) => {
    if (rank === 1) return 'Champion';
    if (rank === 2) return 'Runner-up';
    if (rank === 3) return 'Third Place';
    return '';
  };

  // Refresh leaderboard when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-white border-gray-300">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-center text-2xl text-gray-800 flex items-center justify-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span>Pi Leaderboard</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchLeaderboard}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-center text-gray-600 text-sm">
            Top flyers worldwide
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading leaderboard...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <Card className="p-6 text-center">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                          <span className="font-bold text-gray-800 text-lg">
                            #{rank}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getPlayerAvatar(rank)}</span>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {player.username}
                            </div>
                            {rank <= 3 && (
                              <div className="text-xs text-gray-600">
                                {getRankLabel(rank)}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              {player.total_games} games played
                            </div>
                          </div>
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
        )}

        <div className="mt-6 text-center">
          <Card className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="font-bold text-gray-800">Weekly Prize Pool</span>
            </div>
            <div className="text-gray-700 text-sm">
              Top 3 players win Pi coins every week!
            </div>
            <div className="mt-2 space-x-4 text-xs text-gray-600">
              <span>🥇 100 Pi</span>
              <span>🥈 50 Pi</span>
              <span>🥉 25 Pi</span>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
