
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Coins, Trophy, Target, Zap } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onStartGame
}) => {
  const handleStartGame = () => {
    onClose();
    onStartGame();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 bg-white rounded-2xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800 mb-4">
            🎮 How to Play Flappy Pi
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Basic Controls */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">Basic Controls</h3>
            </div>
            <p className="text-sm text-gray-600">
              Tap anywhere on the screen or press SPACE to make your bird flap its wings and fly upward.
            </p>
          </Card>

          {/* Objective */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">Objective</h3>
            </div>
            <p className="text-sm text-gray-600">
              Navigate through gaps between pipes without hitting them, the ground, or ceiling.
            </p>
          </Card>

          {/* Scoring */}
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Coins className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">Earning Points</h3>
            </div>
            <p className="text-sm text-gray-600">
              Earn 1 point for each pipe you pass. Collect Pi coins to unlock new bird skins!
            </p>
          </Card>

          {/* Game Modes */}
          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">Game Modes</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Classic:</strong> Progressive difficulty</div>
              <div><strong>Endless:</strong> Continuous challenge</div>
              <div><strong>Challenge:</strong> Maximum difficulty</div>
            </div>
          </Card>

          {/* Pi Features */}
          <Card className="p-4 bg-cyan-50 border-cyan-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">Pi Network Features</h3>
            </div>
            <p className="text-sm text-gray-600">
              Watch ads to continue after collisions, compete on leaderboards, and share your high scores!
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleStartGame}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl border-0"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Playing!
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 py-3 rounded-xl"
            >
              Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialModal;
