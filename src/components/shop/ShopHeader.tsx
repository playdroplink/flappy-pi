
import React from 'react';
import { Coins, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShopHeaderProps {
  coins: number;
  onWatchAd: (adType: 'continue' | 'coins' | 'life') => void;
}

const ShopHeader: React.FC<ShopHeaderProps> = ({ coins, onWatchAd }) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 mt-2 border border-yellow-200">
        <Coins className="h-5 w-5 text-yellow-500" />
        <span className="font-bold text-gray-800 text-lg">{coins.toLocaleString()} Flappy Coins</span>
      </div>
      <p className="text-gray-600 text-sm mt-2">
        Buy with Pi Network or Flappy Coins
      </p>
      <Button 
        onClick={() => onWatchAd('coins')} 
        variant="outline" 
        size="sm" 
        className="mt-2 text-green-600 border-green-600 hover:bg-green-50"
      >
        <Play className="h-4 w-4 mr-1" />
        Watch Ad for Coins
      </Button>
    </div>
  );
};

export default ShopHeader;
