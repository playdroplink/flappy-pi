
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coins, Check, Zap } from 'lucide-react';

interface BirdSkin {
  id: string;
  name: string;
  piPrice: number;
  coinPrice: number;
  priceType: 'free' | 'premium';
  image: string;
  owned: boolean;
}

interface BirdSkinCardProps {
  skin: BirdSkin;
  selectedBirdSkin: string;
  coins: number;
  isOwned: boolean;
  onSelectSkin: (skinId: string) => void;
  onPiPayment: (skin: BirdSkin) => void;
  onCoinPurchase: (skin: BirdSkin) => void;
}

const BirdSkinCard: React.FC<BirdSkinCardProps> = ({
  skin,
  selectedBirdSkin,
  coins,
  isOwned,
  onSelectSkin,
  onPiPayment,
  onCoinPurchase
}) => {
  const renderActionButtons = () => {
    if (selectedBirdSkin === skin.id) {
      return (
        <Button className="bg-green-600 hover:bg-green-700 text-white w-full" disabled>
          <Check className="mr-1 h-4 w-4" />
          Selected
        </Button>
      );
    }

    if (isOwned) {
      return (
        <Button 
          onClick={() => onSelectSkin(skin.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
        >
          Select
        </Button>
      );
    }

    if (skin.priceType === 'premium') {
      return (
        <div className="space-y-2">
          <Button 
            onClick={() => onPiPayment(skin)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full"
          >
            <Zap className="mr-1 h-4 w-4" />
            Buy with Pi
          </Button>
          <Button 
            onClick={() => onCoinPurchase(skin)}
            className={`w-full ${coins >= skin.coinPrice ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-400 cursor-not-allowed'} text-white`}
            disabled={coins < skin.coinPrice}
          >
            <Coins className="mr-1 h-4 w-4" />
            Buy with Coins
          </Button>
        </div>
      );
    }

    return (
      <Button 
        onClick={() => onSelectSkin(skin.id)}
        className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
      >
        <Coins className="mr-1 h-4 w-4" />
        Free
      </Button>
    );
  };

  return (
    <Card className="p-4 bg-gray-50 border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg border border-gray-200">
          <img 
            src={skin.image} 
            alt={skin.name}
            className="w-12 h-12 object-contain"
          />
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-lg">{skin.name}</h4>
          <div className="mb-2">
            {skin.priceType === 'free' ? (
              <span className="text-green-600 text-sm font-medium">Free</span>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-600 font-bold">{skin.piPrice} Pi</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-600 font-bold">{skin.coinPrice.toLocaleString()} Coins</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-right space-y-2">
          {renderActionButtons()}
        </div>
      </div>
    </Card>
  );
};

export default BirdSkinCard;
