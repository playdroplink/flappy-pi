
import React from 'react';
import PowerUpCard from './PowerUpCard';
import { POWER_UPS } from '@/constants/shopData';

interface PowerUpsSectionProps {
  coins: number;
  ownedPowerUps: string[];
  onPowerUpPurchase: (powerUpId: string, cost: number) => void;
}

const PowerUpsSection: React.FC<PowerUpsSectionProps> = ({
  coins,
  ownedPowerUps,
  onPowerUpPurchase
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">⚡ Power-ups Arsenal</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POWER_UPS.map((powerUp) => (
          <PowerUpCard
            key={powerUp.id}
            powerUp={powerUp}
            coins={coins}
            isOwned={ownedPowerUps.includes(powerUp.id)}
            onPurchase={onPowerUpPurchase}
          />
        ))}
      </div>
    </div>
  );
};

export default PowerUpsSection;
