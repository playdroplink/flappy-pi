
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coins, Check, Lock } from 'lucide-react';

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
  const birdSkins = [
    { id: 'default', name: 'Classic Blue', price: 0, emoji: '🐦', owned: true },
    { id: 'red', name: 'Cardinal Red', price: 50, emoji: '🔴', owned: false },
    { id: 'golden', name: 'Golden Eagle', price: 100, emoji: '🟡', owned: false },
    { id: 'rainbow', name: 'Rainbow Bird', price: 200, emoji: '🌈', owned: false },
  ];

  const powerUps = [
    { id: 'shield', name: 'Shield', price: 25, description: 'Protection for 10 seconds', emoji: '🛡️' },
    { id: 'magnet', name: 'Coin Magnet', price: 30, description: 'Attracts coins automatically', emoji: '🧲' },
    { id: 'slowmo', name: 'Slow Motion', price: 40, description: 'Slows down time for 5 seconds', emoji: '⏱️' },
  ];

  const handlePurchase = (item: any, type: 'skin' | 'powerup') => {
    if (coins >= item.price) {
      setCoins(coins - item.price);
      if (type === 'skin') {
        setSelectedBirdSkin(item.id);
        // Mark as owned (in real app, this would be saved to backend)
      }
      localStorage.setItem('flappypi-coins', (coins - item.price).toString());
      if (type === 'skin') {
        localStorage.setItem('flappypi-skin', item.id);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-violet-300/50 bg-gradient-to-br from-violet-600/95 to-purple-700/95 backdrop-blur-sm text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-white flex items-center justify-center space-x-2">
            <span>🛍️ Pi Shop</span>
          </DialogTitle>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 bg-white/10 rounded-lg p-2 mt-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="font-bold">{coins} Pi Coins</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bird Skins */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">🐦 Bird Skins</h3>
            <div className="grid grid-cols-2 gap-4">
              {birdSkins.map((skin) => (
                <Card key={skin.id} className="p-4 text-center">
                  <div className="text-3xl mb-2">{skin.emoji}</div>
                  <h4 className="font-semibold text-white mb-2">{skin.name}</h4>
                  <div className="mb-3">
                    {skin.price === 0 ? (
                      <span className="text-green-400 text-sm">Free</span>
                    ) : (
                      <div className="flex items-center justify-center space-x-1">
                        <Coins className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400">{skin.price}</span>
                      </div>
                    )}
                  </div>
                  {selectedBirdSkin === skin.id ? (
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Check className="mr-1 h-4 w-4" />
                      Selected
                    </Button>
                  ) : skin.owned || skin.price === 0 ? (
                    <Button 
                      onClick={() => setSelectedBirdSkin(skin.id)}
                      className="w-full"
                    >
                      Select
                    </Button>
                  ) : coins >= skin.price ? (
                    <Button 
                      onClick={() => handlePurchase(skin, 'skin')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Buy
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      <Lock className="mr-1 h-4 w-4" />
                      Locked
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Power-ups */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">⚡ Power-ups</h3>
            <div className="grid grid-cols-1 gap-3">
              {powerUps.map((powerup) => (
                <Card key={powerup.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{powerup.emoji}</span>
                      <div>
                        <h4 className="font-semibold text-white">{powerup.name}</h4>
                        <p className="text-white/80 text-sm">{powerup.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-2">
                        <Coins className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400">{powerup.price}</span>
                      </div>
                      {coins >= powerup.price ? (
                        <Button 
                          onClick={() => handlePurchase(powerup, 'powerup')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Buy
                        </Button>
                      ) : (
                        <Button disabled size="sm">
                          <Lock className="mr-1 h-3 w-3" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
