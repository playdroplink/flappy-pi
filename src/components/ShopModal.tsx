
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  setCoins: (coins: number) => void;
  selectedBirdSkin: string;
  setSelectedBirdSkin: (skin: string) => void;
}

const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  coins,
  setCoins,
  selectedBirdSkin,
  setSelectedBirdSkin
}) => {
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const birdSkins = [
    { id: 'default', name: 'Classic Yellow', price: 0, piPrice: 0, color: '#fbbf24' },
    { id: 'red', name: 'Fire Bird', price: 50, piPrice: 0.1, color: '#ef4444' },
    { id: 'blue', name: 'Ocean Bird', price: 75, piPrice: 0.15, color: '#3b82f6' },
    { id: 'gold', name: 'Golden Eagle', price: 100, piPrice: 0.2, color: '#f59e0b' },
    { id: 'purple', name: 'Royal Phoenix', price: 150, piPrice: 0.3, color: '#8b5cf6' }
  ];

  const powerUps = [
    { id: 'revive', name: 'Extra Life', price: 25, piPrice: 0.05, description: 'Continue playing after collision' },
    { id: 'multiplier', name: 'Score Multiplier', price: 30, piPrice: 0.06, description: 'Double points for 30 seconds' },
    { id: 'slow-motion', name: 'Slow Motion', price: 35, piPrice: 0.07, description: 'Slow down time for easier navigation' }
  ];

  const coinPackages = [
    { id: 'small', name: '100 Coins', coins: 100, piPrice: 0.1 },
    { id: 'medium', name: '500 Coins', coins: 500, piPrice: 0.4 },
    { id: 'large', name: '1000 Coins', coins: 1000, piPrice: 0.7 },
    { id: 'mega', name: '2500 Coins', coins: 2500, piPrice: 1.5 }
  ];

  const ownedSkins = React.useMemo(() => {
    const owned = JSON.parse(localStorage.getItem('flappypi-owned-skins') || '["default"]');
    return owned;
  }, []);

  const purchaseSkin = (skin: typeof birdSkins[0]) => {
    if (coins >= skin.price && !ownedSkins.includes(skin.id)) {
      const newCoins = coins - skin.price;
      setCoins(newCoins);
      localStorage.setItem('flappypi-coins', newCoins.toString());
      
      const newOwnedSkins = [...ownedSkins, skin.id];
      localStorage.setItem('flappypi-owned-skins', JSON.stringify(newOwnedSkins));
      
      setSelectedBirdSkin(skin.id);
      localStorage.setItem('flappypi-skin', skin.id);

      toast({
        title: "Purchase Successful!",
        description: `You unlocked the ${skin.name} skin!`
      });
    }
  };

  const purchaseWithPi = async (item: any, type: 'skin' | 'powerup' | 'coins') => {
    setPurchaseLoading(item.id);
    
    // Simulate Pi payment processing
    setTimeout(() => {
      setPurchaseLoading(null);
      
      if (type === 'skin') {
        const newOwnedSkins = [...ownedSkins, item.id];
        localStorage.setItem('flappypi-owned-skins', JSON.stringify(newOwnedSkins));
        setSelectedBirdSkin(item.id);
        localStorage.setItem('flappypi-skin', item.id);
      } else if (type === 'coins') {
        const newCoins = coins + item.coins;
        setCoins(newCoins);
        localStorage.setItem('flappypi-coins', newCoins.toString());
      }
      
      toast({
        title: "Pi Payment Successful!",
        description: `Purchase completed with ${item.piPrice} Pi`
      });
    }, 2000);
  };

  const selectSkin = (skinId: string) => {
    if (ownedSkins.includes(skinId)) {
      setSelectedBirdSkin(skinId);
      localStorage.setItem('flappypi-skin', skinId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">
            🏪 Pi Shop
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Your coins: 🪙 {coins}. Purchase items with coins or Pi to enhance your gaming experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Coin Packages Section */}
          <div>
            <h3 className="text-lg font-bold mb-3">🪙 Coin Packages</h3>
            <div className="grid grid-cols-2 gap-3">
              {coinPackages.map((pkg) => (
                <Card key={pkg.id} className="p-4 border-2 border-yellow-200 bg-yellow-50">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">🪙</div>
                    <p className="font-bold">{pkg.name}</p>
                    <Button
                      onClick={() => purchaseWithPi(pkg, 'coins')}
                      disabled={purchaseLoading === pkg.id}
                      className="w-full bg-yellow-500 hover:bg-yellow-600"
                    >
                      {purchaseLoading === pkg.id ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        `🥧 ${pkg.piPrice} Pi`
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Bird Skins Section */}
          <div>
            <h3 className="text-lg font-bold mb-3">🐦 Bird Skins</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {birdSkins.map((skin) => {
                const isOwned = ownedSkins.includes(skin.id);
                const isSelected = selectedBirdSkin === skin.id;
                const canAfford = coins >= skin.price;
                
                return (
                  <Card key={skin.id} className={`p-4 border-2 ${
                    isSelected ? 'border-green-500 bg-green-50' : 
                    isOwned ? 'border-blue-300' : 'border-gray-200'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: skin.color }}
                        />
                        <div>
                          <p className="font-bold">{skin.name}</p>
                          <p className="text-sm text-gray-600">
                            {skin.price === 0 ? 'Free' : `🪙 ${skin.price}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {isSelected ? (
                          <div className="flex items-center text-green-600 flex-1">
                            <Check className="h-4 w-4 mr-1" />
                            <span className="text-sm">Selected</span>
                          </div>
                        ) : isOwned ? (
                          <Button
                            onClick={() => selectSkin(skin.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Select
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => purchaseSkin(skin)}
                              disabled={!canAfford}
                              size="sm"
                              className={`flex-1 ${canAfford ? 'bg-green-500 hover:bg-green-600' : ''}`}
                            >
                              {canAfford ? `🪙 ${skin.price}` : 'Not enough coins'}
                            </Button>
                            {skin.piPrice > 0 && (
                              <Button
                                onClick={() => purchaseWithPi(skin, 'skin')}
                                disabled={purchaseLoading === skin.id}
                                size="sm"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                              >
                                {purchaseLoading === skin.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  `🥧 ${skin.piPrice}`
                                )}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Power-ups Section */}
          <div>
            <h3 className="text-lg font-bold mb-3">⚡ Power-ups</h3>
            <div className="grid grid-cols-1 gap-3">
              {powerUps.map((powerUp) => {
                const canAfford = coins >= powerUp.price;
                
                return (
                  <Card key={powerUp.id} className="p-4 border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{powerUp.name}</p>
                        <p className="text-sm text-gray-600">{powerUp.description}</p>
                        <p className="text-sm text-yellow-600">🪙 {powerUp.price} | 🥧 {powerUp.piPrice} Pi</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          disabled={!canAfford}
                          size="sm"
                          className={canAfford ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {canAfford ? `🪙 ${powerUp.price}` : 'Not enough coins'}
                        </Button>
                        <Button
                          onClick={() => purchaseWithPi(powerUp, 'powerup')}
                          disabled={purchaseLoading === powerUp.id}
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          {purchaseLoading === powerUp.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            `🥧 ${powerUp.piPrice}`
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Pi Integration Notice */}
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-bold text-green-700 mb-2">🥧 Pi Network Integration</h4>
            <p className="text-sm text-green-600">
              Purchase items directly with Pi coins! Connect your Pi wallet to unlock exclusive deals and earn Pi rewards.
            </p>
            <Button className="mt-2 bg-green-600 hover:bg-green-700 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Connect Pi Wallet
            </Button>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
