
import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Zap, Star, Clock } from 'lucide-react';

interface PowerUp {
  id: string;
  name: string;
  icon: React.ReactNode;
  duration: number;
  active: boolean;
}

interface PowerUpsProps {
  powerUps: PowerUp[];
}

const PowerUps: React.FC<PowerUpsProps> = ({ powerUps }) => {
  const activePowerUps = powerUps.filter(p => p.active);

  if (activePowerUps.length === 0) return null;

  return (
    <div className="absolute top-20 right-4 space-y-2 pointer-events-none">
      {activePowerUps.map((powerUp) => (
        <Card 
          key={powerUp.id}
          className="bg-gradient-to-r from-purple-500/90 to-pink-600/90 backdrop-blur-sm border-purple-300/50 p-2 shadow-lg animate-pulse"
        >
          <div className="flex items-center space-x-2 text-white">
            {powerUp.icon}
            <span className="text-xs font-bold">{powerUp.name}</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{powerUp.duration}s</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PowerUps;
