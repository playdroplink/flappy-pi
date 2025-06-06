
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import ShopHeader from './shop/ShopHeader';
import ShopInfoSection from './shop/ShopInfoSection';
import BirdSkinsSection from './shop/BirdSkinsSection';
import PowerUpsSection from './shop/PowerUpsSection';
import { useShopPurchases } from '@/hooks/useShopPurchases';

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
  
  const {
    ownedSkins,
    ownedPowerUps,
    handleSkinPurchase,
    handlePowerUpPurchase
  } = useShopPurchases(coins, setCoins);

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
          <BirdSkinsSection
            selectedSkin={selectedSkin}
            coins={coins}
            ownedSkins={ownedSkins}
            onSkinSelect={onSkinSelect}
            onSkinPurchase={handleSkinPurchase}
          />
        )}

        {/* Power-ups Tab */}
        {activeTab === 'powerups' && (
          <PowerUpsSection
            coins={coins}
            ownedPowerUps={ownedPowerUps}
            onPowerUpPurchase={handlePowerUpPurchase}
          />
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
