
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, username: 'PiMaster2024', score: 1250, avatar: '👑' },
    { rank: 2, username: 'SkyFlyer', score: 1100, avatar: '🥈' },
    { rank: 3, username: 'BirdLegend', score: 980, avatar: '🥉' },
    { rank: 4, username: 'PiPlayer', score: 850, avatar: '🐦' },
    { rank: 5, username: 'CloudChaser', score: 750, avatar: '☁️' },
    { rank: 6, username: 'WingMaster', score: 680, avatar: '🪶' },
    { rank: 7, username: 'PiExplorer', score: 620, avatar: '🔍' },
    { rank: 8, username: 'SkyDancer', score: 580, avatar: '💃' },
    { rank: 9, username: 'FlightPro', score: 520, avatar: '✈️' },
    { rank: 10, username: 'PiNinja', score: 480, avatar: '🥷' },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-blue-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-400/30';
      case 2:
        return 'from-gray-500/20 to-slate-500/20 border-gray-400/30';
      case 3:
        return 'from-amber-600/20 to-orange-500/20 border-amber-600/30';
      default:
        return 'from-blue-500/10 to-indigo-500/10 border-blue-400/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto border-violet-300/50 bg-gradient-to-br from-violet-600/95 to-purple-700/95 backdrop-blur-sm text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-white flex items-center justify-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <span>Pi Leaderboard</span>
          </DialogTitle>
          <p className="text-center text-white/80 text-sm">
            Top flyers this week
          </p>
        </DialogHeader>

        <div className="space-y-3">
          {leaderboardData.map((player) => (
            <Card 
              key={player.rank} 
              className={`p-4 bg-gradient-to-r ${getRankColor(player.rank)} border`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(player.rank)}
                    <span className="font-bold text-white text-lg">
                      #{player.rank}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{player.avatar}</span>
                    <div>
                      <div className="font-semibold text-white">
                        {player.username}
                      </div>
                      {player.rank <= 3 && (
                        <div className="text-xs text-white/80">
                          {player.rank === 1 ? 'Champion' : 
                           player.rank === 2 ? 'Runner-up' : 'Third Place'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white text-lg">
                    {player.score.toLocaleString()}
                  </div>
                  <div className="text-white/80 text-sm">points</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Card className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="font-bold text-white">Weekly Prize Pool</span>
            </div>
            <div className="text-white/90 text-sm">
              Top 3 players win Pi coins every week!
            </div>
            <div className="mt-2 space-x-4 text-xs text-white/80">
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
