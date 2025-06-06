
import React from 'react';
import { Coins, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShopHeaderProps {
  coins?: number;
  onClose?: () => void;
}

const ShopHeader: React.FC<ShopHeaderProps> = ({ coins = 0, onClose }) => {
  return (
    <div className="text-center">
      {onClose && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Pi Shop</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-2 mt-2">
        <Coins className="h-5 w-5 text-yellow-500" />
        <span className="font-bold text-gray-800">{coins.toLocaleString()} Game Coins</span>
      </div>
      <p className="text-gray-600 text-sm mt-2">
        Buy with Pi Network or Game Coins
      </p>
    </div>
  );
};

export default ShopHeader;
