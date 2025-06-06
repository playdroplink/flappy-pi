
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 text-center shadow-2xl border border-gray-200 max-w-sm mx-4">
        <div className="text-4xl mb-4">🚀</div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Continue!</h3>
        <p className="text-gray-600 mb-4">Thanks for watching the Pi Ad!</p>
        <p className="text-sm text-gray-500 mb-6">Your bird will respawn in a safe area. Get ready to continue flying!</p>
        
        <Button
          onClick={onContinue}
          className="w-full bg-green-500 hover:bg-green-600 text-white border-0 rounded-xl py-3 font-bold text-base"
        >
          <Play className="mr-2 h-5 w-5" />
          Tap to Continue Flying
        </Button>
        
        <p className="text-xs text-gray-400 mt-3">
          Your bird will be placed in a safe position
        </p>
      </div>
    </div>
  );
};

export default GameContinueOverlay;
