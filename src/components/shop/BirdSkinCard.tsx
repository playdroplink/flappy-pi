
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coins, Check, Zap, Sparkles } from 'lucide-react';

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
  hasAllSkinsSubscription?: boolean;
  onSelectSkin: (skinId: string) => void;
  onPiPayment: (skin: BirdSkin) => void;
  onCoinPurchase: (skin: BirdSkin) => void;
}

const BirdSkinCard: React.FC<BirdSkinCardProps> = ({
  skin,
  selectedBirdSkin,
  coins,
  isOwned,
  hasAllSkinsSubscription = false,
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

    // If user has all skins subscription, they can select any skin
    if (hasAllSkinsSubscription || isOwned) {
      return (
        <Button 
          onClick={() => onSelectSkin(skin.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
        >
          {hasAllSkinsSubscription && !isOwned ? (
            <>
              <Sparkles className="mr-1 h-4 w-4" />
              Select (Subscription)
            </>
          ) : (
            <>
              <Check className="mr-1 h-4 w-4" />
              Select
            </>
          )}
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
        <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg border border-gray-200 relative">
          <img 
            src={skin.image} 
            alt={skin.name}
            className="w-12 h-12 object-contain"
          />
          {hasAllSkinsSubscription && !isOwned && (
            <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-lg truncate">{skin.name}</h4>
          <div className="mb-2">
            {hasAllSkinsSubscription && !isOwned ? (
              <span className="text-pink-600 text-sm font-medium flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                Subscription Access
              </span>
            ) : skin.priceType === 'free' ? (
              <span className="text-green-600 text-sm font-medium">Free</span>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-600 font-bold text-sm">{skin.piPrice} Pi</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-600 font-bold text-sm">{skin.coinPrice.toLocaleString()} Coins</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-right space-y-2 flex-shrink-0">
          {renderActionButtons()}
        </div>
      </div>
    </Card>
  );
};

export default BirdSkinCard;
