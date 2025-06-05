
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

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
    { id: 'default', name: 'Classic Yellow', price: 0, color: '#fbbf24' },
    { id: 'red', name: 'Fire Bird', price: 50, color: '#ef4444' },
    { id: 'blue', name: 'Ocean Bird', price: 75, color: '#3b82f6' },
    { id: 'gold', name: 'Golden Eagle', price: 100, color: '#f59e0b' },
    { id: 'purple', name: 'Royal Phoenix', price: 150, color: '#8b5cf6' }
  ];

  const powerUps = [
    { id: 'revive', name: 'Extra Life', price: 25, description: 'Continue playing after collision' },
    { id: 'multiplier', name: 'Score Multiplier', price: 30, description: 'Double points for 30 seconds' },
    { id: 'slow-motion', name: 'Slow Motion', price: 35, description: 'Slow down time for easier navigation' }
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
    }
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
            Your coins: 🪙 {coins}. Purchase bird skins and power-ups to enhance your gaming experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
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
                    <div className="flex items-center justify-between">
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
                      
                      <div>
                        {isSelected ? (
                          <div className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-1" />
                            <span className="text-sm">Selected</span>
                          </div>
                        ) : isOwned ? (
                          <Button
                            onClick={() => selectSkin(skin.id)}
                            variant="outline"
                            size="sm"
                          >
                            Select
                          </Button>
                        ) : (
                          <Button
                            onClick={() => purchaseSkin(skin)}
                            disabled={!canAfford}
                            size="sm"
                            className={canAfford ? 'bg-green-500 hover:bg-green-600' : ''}
                          >
                            {canAfford ? 'Buy' : 'Not enough coins'}
                          </Button>
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
                        <p className="text-sm text-yellow-600">🪙 {powerUp.price}</p>
                      </div>
                      
                      <Button
                        disabled={!canAfford}
                        size="sm"
                        className={canAfford ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                      >
                        {canAfford ? 'Buy' : 'Not enough coins'}
                      </Button>
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
              Soon you'll be able to purchase items with real Pi coins! 
              Connect your Pi wallet to unlock exclusive skins and earn Pi rewards.
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
