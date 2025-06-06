
import React from 'react';
import BirdSkinCard from './BirdSkinCard';

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

interface BirdCharactersSectionProps {
  birdSkins: BirdSkin[];
  selectedBirdSkin: string;
  hasAnySubscription: boolean;
  eliteSubscription: {
    isActive: boolean;
  };
  isOwned: (skinId: string) => boolean;
  setSelectedBirdSkin: (skinId: string) => void;
  handlePiPayment: (skin: BirdSkin) => void;
  handleCoinPurchase: (skin: BirdSkin) => void;
  coins: number;
}

const BirdCharactersSection: React.FC<BirdCharactersSectionProps> = ({
  birdSkins,
  selectedBirdSkin,
  hasAnySubscription,
  eliteSubscription,
  isOwned,
  setSelectedBirdSkin,
  handlePiPayment,
  handleCoinPurchase,
  coins
}) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
        🐦 Bird Characters
        {eliteSubscription.isActive ? (
          <span className="ml-2 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded">
            Elite Access
          </span>
        ) : hasAnySubscription ? (
          <span className="ml-2 text-sm bg-green-100 px-2 py-1 rounded text-green-700">
            All Unlocked
          </span>
        ) : (
          <span className="ml-2 text-sm bg-purple-100 px-2 py-1 rounded text-purple-700">
            Premium Skins
          </span>
        )}
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {birdSkins.map((skin) => (
          <BirdSkinCard
            key={skin.id}
            id={skin.id}
            name={skin.name}
            image={skin.image}
            piPrice={skin.piPrice}
            coinPrice={skin.coinPrice}
            isOwned={isOwned(skin.id)}
            isSelected={selectedBirdSkin === skin.id}
            canUse={hasAnySubscription || skin.id === 'default' || (skin.eliteOnly ? eliteSubscription.isActive : true)}
            onSelect={() => setSelectedBirdSkin(skin.id)}
            onPurchase={() => handleCoinPurchase(skin)}
            userCoins={coins}
            priceType={skin.priceType}
          />
        ))}
      </div>
    </div>
  );
};

export default BirdCharactersSection;
