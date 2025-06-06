
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Volume2, VolumeX } from 'lucide-react';

interface UserStatsCardProps {
  coins: number;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({
  coins,
  musicEnabled,
  onToggleMusic
}) => {
  return (
    <Card className="w-full p-4 mb-6 bg-white/95 backdrop-blur-sm shadow-xl animate-fade-in rounded-xl border-0" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{coins}</div>
            <div className="text-sm text-gray-600">Flappy Coins</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleMusic(!musicEnabled)}
          className="text-gray-700 hover:bg-gray-100 w-10 h-10 rounded-full"
        >
          {musicEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>
    </Card>
  );
};

export default UserStatsCard;
