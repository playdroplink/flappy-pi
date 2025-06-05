
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  // Mock leaderboard data - in production this would come from backend
  const leaderboard = [
    { rank: 1, username: 'PiMaster2024', score: 287, reward: '5 Pi' },
    { rank: 2, username: 'FlappyKing', score: 245, reward: '3 Pi' },
    { rank: 3, username: 'BirdWhisperer', score: 198, reward: '2 Pi' },
    { rank: 4, username: 'SkyDancer', score: 176, reward: '0.5 Pi' },
    { rank: 5, username: 'PipeNavigator', score: 154, reward: '0.5 Pi' },
    { rank: 6, username: 'CloudJumper', score: 132, reward: '0.5 Pi' },
    { rank: 7, username: 'WindRider', score: 109, reward: '0.5 Pi' },
    { rank: 8, username: 'FeatherFlight', score: 98, reward: '0.5 Pi' },
    { rank: 9, username: 'GoldWings', score: 87, reward: '0.5 Pi' },
    { rank: 10, username: 'FastFlapper', score: 76, reward: '0.5 Pi' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-600">
            🏆 Weekly Leaderboard
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Top players earn Pi rewards every week! Compete for the highest scores and climb the rankings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {leaderboard.map((player) => (
            <Card 
              key={player.rank} 
              className={`p-3 border-2 ${getRankColor(player.rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getRankIcon(player.rank)}
                  <div>
                    <p className="font-bold text-gray-800">{player.username}</p>
                    <p className="text-sm text-gray-600">Score: {player.score}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">🥧 {player.reward}</p>
                  <p className="text-xs text-gray-500">Weekly reward</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <Card className="p-4 bg-green-50 border-green-200 mt-4">
          <h4 className="font-bold text-green-700 mb-2">💰 Reward Distribution</h4>
          <div className="text-sm text-green-600 space-y-1">
            <p>🥇 1st Place: 5 Pi</p>
            <p>🥈 2nd Place: 3 Pi</p>
            <p>🥉 3rd Place: 2 Pi</p>
            <p>🏅 4th-10th Place: 0.5 Pi each</p>
          </div>
          <p className="text-xs text-green-500 mt-2">
            Rewards distributed every Sunday at midnight UTC
          </p>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
