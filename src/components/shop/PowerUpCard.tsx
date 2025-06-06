
import React from 'react';
import { Button } from '@/components/ui/button';
import { Coins, Lock, Star } from 'lucide-react';

interface PowerUp {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: React.ComponentType<any>;
}

interface PowerUpCardProps {
  powerUp: PowerUp;
  coins: number;
  isOwned: boolean;
  onPurchase: (powerUpId: string, cost: number) => void;
}

const PowerUpCard: React.FC<PowerUpCardProps> = ({
  powerUp,
  coins,
  isOwned,
  onPurchase
}) => {
  const IconComponent = powerUp.icon;

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        isOwned
          ? 'border-green-400 bg-green-50'
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-blue-600">
          <IconComponent className="h-6 w-6" />
        </div>
        <h4 className="font-semibold text-gray-800">{powerUp.name}</h4>
        {isOwned && (
          <div className="ml-auto">
            <Star className="h-5 w-5 text-green-500 fill-current" />
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{powerUp.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span className="font-semibold text-gray-800">{powerUp.cost}</span>
        </div>
        
        {isOwned ? (
          <Button size="sm" variant="outline" disabled>
            Owned ✓
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onPurchase(powerUp.id, powerUp.cost)}
            disabled={coins < powerUp.cost}
            className={coins < powerUp.cost ? 'opacity-50' : ''}
          >
            {coins < powerUp.cost ? (
              <>
                <Lock className="h-4 w-4 mr-1" />
                Need {powerUp.cost - coins} more
              </>
            ) : (
              'Purchase'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PowerUpCard;
