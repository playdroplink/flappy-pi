
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Coins, Music, MusicOff, Crown, ShoppingBag, Calendar } from 'lucide-react';

interface UserStatsCardProps {
  coins: number;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
  onOpenPurchaseHistory?: () => void;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({
  coins,
  musicEnabled,
  onToggleMusic,
  onOpenPurchaseHistory
}) => {
  const { profile, hasPremium, isAdFree } = useUserProfile();

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-6 animate-fade-in" 
          style={{ animationDelay: '0.1s' }}>
      <div className="p-6">
        {/* User Info */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {profile?.username || 'Flappy Pilot'}
          </h2>
          <div className="flex items-center justify-center space-x-2">
            {hasPremium && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            {isAdFree && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                Ad-Free
              </Badge>
            )}
          </div>
        </div>

        {/* Coins Display */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Coins className="h-6 w-6 text-yellow-600" />
          <span className="text-2xl font-bold text-yellow-600">
            {coins.toLocaleString()}
          </span>
          <span className="text-gray-600">coins</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between space-x-3">
          {/* Music Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleMusic(!musicEnabled)}
            className="flex items-center space-x-2 flex-1"
          >
            {musicEnabled ? (
              <Music className="h-4 w-4 text-blue-600" />
            ) : (
              <MusicOff className="h-4 w-4 text-gray-600" />
            )}
            <span className="text-sm">
              {musicEnabled ? 'Music On' : 'Music Off'}
            </span>
          </Button>

          {/* Purchase History Button */}
          {onOpenPurchaseHistory && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenPurchaseHistory}
              className="flex items-center space-x-2 flex-1"
            >
              <ShoppingBag className="h-4 w-4 text-green-600" />
              <span className="text-sm">History</span>
            </Button>
          )}
        </div>

        {/* Premium Status */}
        {hasPremium && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-800">Premium Active</span>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserStatsCard;
