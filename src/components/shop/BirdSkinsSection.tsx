
import React from 'react';
import BirdSkinCard from './BirdSkinCard';
import { BIRD_SKINS } from '@/constants/shopData';

interface BirdSkinsSectionProps {
  selectedSkin: string;
  coins: number;
  ownedSkins: string[];
  onSkinSelect: (skinId: string) => void;
  onSkinPurchase: (skinId: string, cost: number) => void;
}

const BirdSkinsSection: React.FC<BirdSkinsSectionProps> = ({
  selectedSkin,
  coins,
  ownedSkins,
  onSkinSelect,
  onSkinPurchase
}) => {
  return (
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
            onPiPayment={() => onSkinPurchase(skin.id, skin.piPrice)}
            onCoinPurchase={() => onSkinPurchase(skin.id, skin.coinPrice)}
          />
        ))}
      </div>
    </div>
  );
};

export default BirdSkinsSection;
