
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
    expiresAt: string | null;
    daysRemaining: number;
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
  // Separate birds by type for better organization
  const freeBirds = birdSkins.filter(skin => skin.priceType === 'free');
  const premiumBirds = birdSkins.filter(skin => skin.priceType === 'premium');
  const eliteBirds = birdSkins.filter(skin => skin.priceType === 'elite');

  const renderBirdSection = (birds: BirdSkin[], title: string, icon: string, badge?: string) => {
    if (birds.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 text-gray-700 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
          {badge && (
            <span className="ml-2 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded">
              {badge}
            </span>
          )}
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {birds.map((skin) => (
            <BirdSkinCard
              key={skin.id}
              id={skin.id}
              name={skin.name}
              image={skin.image}
              piPrice={skin.piPrice}
              coinPrice={skin.coinPrice}
              isOwned={isOwned(skin.id)}
              isSelected={selectedBirdSkin === skin.id}
              canUse={
                skin.priceType === 'free' || 
                (skin.priceType === 'premium' && hasAnySubscription) ||
                (skin.priceType === 'elite' && eliteSubscription.isActive)
              }
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
            Premium Access
          </span>
        ) : (
          <span className="ml-2 text-sm bg-blue-100 px-2 py-1 rounded text-blue-700">
            Standard Access
          </span>
        )}
      </h3>

      {/* Free Birds */}
      {renderBirdSection(freeBirds, "Free Characters", "🆓")}

      {/* Premium Birds */}
      {renderBirdSection(premiumBirds, "Premium Characters", "⭐", hasAnySubscription ? "Unlocked" : "Premium")}

      {/* Elite Birds */}
      {renderBirdSection(eliteBirds, "Elite Characters", "👑", eliteSubscription.isActive ? "Unlocked" : "Elite Only")}

      {/* Access Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <div className="flex items-center space-x-2 mb-1">
          <span>🔓</span>
          <span className="font-medium">Your Access Level:</span>
        </div>
        {eliteSubscription.isActive ? (
          <p className="text-yellow-700">👑 Elite Member - All characters unlocked!</p>
        ) : hasAnySubscription ? (
          <p className="text-green-700">⭐ Premium Member - Free & Premium characters unlocked</p>
        ) : (
          <p className="text-blue-700">🆓 Standard - Only free characters available</p>
        )}
      </div>
    </div>
  );
};

export default BirdCharactersSection;
