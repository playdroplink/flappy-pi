
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameContinueOverlayProps {
  showContinueButton: boolean;
  onContinue: () => void;
}

const GameContinueOverlay: React.FC<GameContinueOverlayProps> = ({
  showContinueButton,
  onContinue
}) => {
  if (!showContinueButton) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
        <h2 className="text-xl font-bold mb-4">Continue Game?</h2>
        <p className="text-gray-600 mb-6">
          Watch an ad to continue your game!
        </p>
        <Button 
          onClick={onContinue}
          className="w-full"
          size="lg"
        >
          Continue Game
        </Button>
      </div>
    </div>
  );
};

export default GameContinueOverlay;
