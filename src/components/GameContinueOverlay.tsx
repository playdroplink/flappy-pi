
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface GameContinueOverlayProps {
  isVisible: boolean;
  countdown: number;
  showContinueButton: boolean;
  onContinue: () => void;
}

const GameContinueOverlay: React.FC<GameContinueOverlayProps> = ({
  isVisible,
  countdown,
  showContinueButton,
  onContinue
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 text-center shadow-2xl border border-gray-200 max-w-sm mx-4">
        {countdown > 0 ? (
          <>
            <div className="text-6xl font-bold text-blue-500 mb-4 animate-pulse">
              {countdown}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Get Ready!</h3>
            <p className="text-gray-600">Prepare to continue your flight...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              ></div>
            </div>
          </>
        ) : showContinueButton ? (
          <>
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Continue!</h3>
            <p className="text-gray-600 mb-6">Thanks for watching the Pi Ad!</p>
            <Button
              onClick={onContinue}
              className="w-full bg-green-500 hover:bg-green-600 text-white border-0 rounded-xl py-3 font-bold text-base"
            >
              <Play className="mr-2 h-5 w-5" />
              Continue Game
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GameContinueOverlay;
