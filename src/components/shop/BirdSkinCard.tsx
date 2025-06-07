
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Crown, Lock, Check } from 'lucide-react';
import PiPaymentModal from '../PiPaymentModal';

interface BirdSkinCardProps {
  id: string;
  name: string;
  description?: string;
  image: string;
  piPrice: number;
  coinPrice: number;
  isOwned: boolean;
  isSelected: boolean;
  canUse: boolean;
  onSelect: () => void;
  onPurchase: () => void;
  userCoins: number;
  priceType: 'free' | 'premium' | 'elite';
}

const BirdSkinCard: React.FC<BirdSkinCardProps> = ({
  id,
  name,
  description,
  image,
  piPrice,
  coinPrice,
  isOwned,
  isSelected,
  canUse,
  onSelect,
  onPurchase,
  userCoins,
  priceType
}) => {
  const [showPiModal, setShowPiModal] = useState(false);
  const canAffordCoins = userCoins >= coinPrice;
  
  // Calculate status text and styles
  let statusText = '';
  let statusColor = '';
  
  if (isSelected) {
    statusText = 'Selected';
    statusColor = 'bg-green-100 text-green-700';
  } else if (isOwned) {
    statusText = 'Owned';
    statusColor = 'bg-blue-100 text-blue-700';
  } else if (!canUse) {
    statusText = priceType === 'elite' ? 'Elite Only' : 'Locked';
    statusColor = 'bg-red-100 text-red-700';
  } else {
    statusText = 'Available';
    statusColor = 'bg-gray-100 text-gray-700';
  }

  const handlePiPayment = () => {
    setShowPiModal(true);
  };

  const handlePiSuccess = () => {
    onPurchase();
    setShowPiModal(false);
  };

  return (
    <>
      <Card className={`overflow-hidden ${isSelected ? 'border-2 border-green-500' : 'border border-gray-200'}`}>
        <div className="relative">
          {/* Status Badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {statusText}
          </div>
          
          {/* Elite Badge */}
          {priceType === 'elite' && (
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-amber-700 flex items-center">
              <Crown className="w-3 h-3 mr-1" />
              <span>Elite</span>
            </div>
          )}
          
          {/* Image */}
          <div className="h-32 bg-gradient-to-b from-blue-50 to-cyan-50 flex items-center justify-center">
            <img 
              src={image} 
              alt={name} 
              className="h-24 w-24 object-contain" 
              loading="lazy"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-gray-800">{name}</h3>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
          
          {/* Price */}
          {!isOwned && (
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center">
                <span className="text-yellow-600 font-bold mr-1">{piPrice}</span>
                <span className="text-gray-600">Pi</span>
              </div>
              <span className="text-gray-400">or</span>
              <div className="flex items-center">
                <Coins className="w-3 h-3 text-blue-500 mr-1" />
                <span className="text-gray-700">{coinPrice}</span>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-2">
            {isOwned ? (
              <Button 
                onClick={onSelect} 
                variant={isSelected ? "default" : "outline"}
                className="w-full"
                size="sm"
              >
                {isSelected ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Selected
                  </>
                ) : (
                  'Select'
                )}
              </Button>
            ) : canUse ? (
              <div className="space-y-2">
                <Button 
                  onClick={handlePiPayment}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium"
                  size="sm"
                >
                  Buy with Pi ({piPrice} Pi)
                </Button>
                <Button 
                  onClick={onPurchase}
                  disabled={!canAffordCoins}
                  className={`w-full font-medium ${canAffordCoins ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                  size="sm"
                >
                  <Coins className="h-3 w-3 mr-2" />
                  {canAffordCoins ? `Buy with Coins (${coinPrice})` : 'Not enough coins'}
                </Button>
              </div>
            ) : (
              <Button 
                disabled 
                className="w-full bg-gray-200 text-gray-500"
                size="sm"
              >
                <Lock className="h-3 w-3 mr-2" />
                Locked
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Pi Payment Modal */}
      <PiPaymentModal
        isOpen={showPiModal}
        onClose={() => setShowPiModal(false)}
        itemName={name}
        itemDescription={`Bird Skin: ${description || name}`}
        piAmount={piPrice}
        onSuccess={handlePiSuccess}
        skinId={id}
        isSubscription={false}
      />
    </>
  );
};

export default BirdSkinCard;
