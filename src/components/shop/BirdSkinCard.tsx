

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coins, Check, Zap, Sparkles, Crown } from 'lucide-react';

interface BirdSkin {
  id: string;
  name: string;
  piPrice: number;
  coinPrice: number;
  priceType: 'free' | 'premium' | 'elite';
  image: string;
  owned: boolean;
  eliteOnly?: boolean;
}

interface BirdSkinCardProps {
  skin: BirdSkin;
  selectedBirdSkin: string;
  coins: number;
  isOwned: boolean;
  hasAllSkinsSubscription?: boolean;
  hasEliteSubscription?: boolean;
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
  hasEliteSubscription = false,
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

    // Elite skins require elite subscription
    if (skin.eliteOnly && !hasEliteSubscription) {
      return (
        <Button className="bg-gray-400 cursor-not-allowed text-white w-full" disabled>
          <Crown className="mr-1 h-4 w-4" />
          Elite Only
        </Button>
      );
    }

    // If user has subscriptions or owns the skin, they can select it
    if (isOwned) {
      return (
        <Button 
          onClick={() => onSelectSkin(skin.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
        >
          {hasEliteSubscription && skin.eliteOnly ? (
            <>
              <Crown className="mr-1 h-4 w-4" />
              Select (Elite)
            </>
          ) : hasAllSkinsSubscription && !skin.owned ? (
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

    if (skin.priceType === 'elite') {
      return (
        <Button className="bg-gray-400 cursor-not-allowed text-white w-full" disabled>
          <Crown className="mr-1 h-4 w-4" />
          Elite Required
        </Button>
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
          {hasEliteSubscription && skin.eliteOnly && (
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
              <Crown className="h-3 w-3 text-white" />
            </div>
          )}
          {hasAllSkinsSubscription && !skin.owned && !skin.eliteOnly && (
            <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-lg truncate flex items-center">
            {skin.name}
            {skin.eliteOnly && (
              <Crown className="h-4 w-4 ml-2 text-yellow-600" />
            )}
          </h4>
          <div className="mb-2">
            {skin.eliteOnly && hasEliteSubscription ? (
              <span className="text-yellow-600 text-sm font-medium flex items-center">
                <Crown className="h-4 w-4 mr-1" />
                Elite Access
              </span>
            ) : skin.eliteOnly ? (
              <span className="text-gray-500 text-sm font-medium flex items-center">
                <Crown className="h-4 w-4 mr-1" />
                Elite Only
              </span>
            ) : hasAllSkinsSubscription && !skin.owned ? (
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

