
import React from 'react';
import { Coins } from 'lucide-react';

interface ShopHeaderProps {
  coins: number;
}

const ShopHeader: React.FC<ShopHeaderProps> = ({ coins }) => {
  return (
    <div className="text-center">
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
