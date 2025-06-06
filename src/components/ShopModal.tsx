
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, ShoppingBag, Star, Lock, Crown, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';
import BirdSkinCard from './shop/BirdSkinCard';
import ShopHeader from './shop/ShopHeader';
import ShopInfoSection from './shop/ShopInfoSection';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  selectedSkin: string;
  onSkinSelect: (skin: string) => void;
  onPurchase: (itemId: string, cost: number) => void;
  setCoins: (coins: number) => void;
  onWatchAd: (adType: 'continue' | 'coins' | 'life') => void;
}

const BIRD_SKINS = [
  { 
    id: 'default', 
    name: 'Classic Bird', 
    piPrice: 0,
    coinPrice: 0, 
    priceType: 'free' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: true
  },
  { 
    id: 'red', 
    name: 'Fire Bird', 
    piPrice: 1,
    coinPrice: 50, 
    priceType: 'premium' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: false
  },
  { 
    id: 'blue', 
    name: 'Ice Bird', 
    piPrice: 2,
    coinPrice: 75, 
    priceType: 'premium' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: false
  },
  { 
    id: 'green', 
    name: 'Nature Bird', 
    piPrice: 3,
    coinPrice: 100, 
    priceType: 'premium' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: false
  },
  { 
    id: 'purple', 
    name: 'Mystic Bird', 
    piPrice: 5,
    coinPrice: 150, 
    priceType: 'premium' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: false
  },
  { 
    id: 'golden', 
    name: 'Golden Bird', 
    piPrice: 10,
    coinPrice: 300, 
    priceType: 'elite' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: false,
    eliteOnly: true
  },
];

const POWER_UPS = [
  { id: 'extra_life', name: 'Extra Life', cost: 25, description: 'Start with an additional life', icon: <Crown className="h-6 w-6" /> },
  { id: 'slow_motion', name: 'Slow Motion', cost: 30, description: 'Slows down time briefly', icon: <Zap className="h-6 w-6" /> },
  { id: 'coin_magnet', name: 'Coin Magnet', cost: 40, description: 'Attracts nearby coins', icon: <Coins className="h-6 w-6" /> },
  { id: 'shield', name: 'Shield', cost: 50, description: 'Protects from one collision', icon: <Star className="h-6 w-6" /> },
];

const ShopModal: React.FC<ShopModalProps> = ({ 
  isOpen, 
  onClose, 
  coins, 
  selectedSkin, 
  onSkinSelect, 
  onPurchase, 
  setCoins,
  onWatchAd 
}) => {
  const [activeTab, setActiveTab] = useState<'skins' | 'powerups'>('skins');
  const [ownedSkins, setOwnedSkins] = useState<string[]>(['default']);
  const [ownedPowerUps, setOwnedPowerUps] = useState<string[]>([]);
  const { profile } = useUserProfile();

  const handleSkinPurchase = async (skinId: string, cost: number) => {
    if (coins < cost) {
      toast({
        title: "Not enough coins! 💸",
        description: `You need ${cost - coins} more coins. Watch an ad to earn some!`,
        variant: "destructive"
      });
      return;
    }

    if (!profile) {
      toast({
        title: "Error",
        description: "User profile not available",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await gameBackendService.makePurchase(
        profile.pi_user_id,
        "bird_skin" as const,
        skinId
      );

      if (result.success) {
        setCoins(coins - cost);
        setOwnedSkins([...ownedSkins, skinId]);
        onSkinSelect(skinId);
        
        toast({
          title: "Purchase Successful! 🎉",
          description: `You've unlocked the ${BIRD_SKINS.find(s => s.id === skinId)?.name}!`
        });
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to purchase skin",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: "Something went wrong with your purchase",
        variant: "destructive"
      });
    }
  };

  const handlePowerUpPurchase = async (powerUpId: string, cost: number) => {
    if (coins < cost) {
      toast({
        title: "Not enough coins! 💸",
        description: `You need ${cost - coins} more coins. Watch an ad to earn some!`,
        variant: "destructive"
      });
      return;
    }

    if (!profile) {
      toast({
        title: "Error",
        description: "User profile not available",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await gameBackendService.makePurchase(
        profile.pi_user_id,
        "power_up" as const,
        powerUpId
      );

      if (result.success) {
        setCoins(coins - cost);
        setOwnedPowerUps([...ownedPowerUps, powerUpId]);
        
        toast({
          title: "Purchase Successful! ⚡",
          description: `You've unlocked the ${POWER_UPS.find(p => p.id === powerUpId)?.name}!`
        });
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to purchase power-up",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: "Something went wrong with your purchase",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <DialogTitle className="text-2xl font-bold text-blue-600">Flappy Pi Shop</DialogTitle>
          </div>
        </DialogHeader>

        <ShopHeader coins={coins} onWatchAd={onWatchAd} />

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === 'skins' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setActiveTab('skins')}
          >
            Bird Skins
          </Button>
          <Button
            variant={activeTab === 'powerups' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setActiveTab('powerups')}
          >
            Power-ups
          </Button>
        </div>

        {/* Skins Tab */}
        {activeTab === 'skins' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">🐦 Bird Skins Collection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BIRD_SKINS.map((skin) => (
                <BirdSkinCard
                  key={skin.id}
                  skin={skin}
                  selectedBirdSkin={selectedSkin}
                  coins={coins}
                  isOwned={ownedSkins.includes(skin.id)}
                  onSelectSkin={() => ownedSkins.includes(skin.id) && onSkinSelect(skin.id)}
                  onPiPayment={() => handleSkinPurchase(skin.id, skin.piPrice)}
                  onCoinPurchase={() => handleSkinPurchase(skin.id, skin.coinPrice)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Power-ups Tab */}
        {activeTab === 'powerups' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">⚡ Power-ups Arsenal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {POWER_UPS.map((powerUp) => (
                <div
                  key={powerUp.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    ownedPowerUps.includes(powerUp.id)
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-blue-600">
                      {powerUp.icon}
                    </div>
                    <h4 className="font-semibold text-gray-800">{powerUp.name}</h4>
                    {ownedPowerUps.includes(powerUp.id) && (
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
                    
                    {ownedPowerUps.includes(powerUp.id) ? (
                      <Button size="sm" variant="outline" disabled>
                        Owned ✓
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handlePowerUpPurchase(powerUp.id, powerUp.cost)}
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
              ))}
            </div>
          </div>
        )}

        <ShopInfoSection />

        <div className="flex justify-center pt-4">
          <Button onClick={onClose} variant="outline" className="px-8">
            Close Shop
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
