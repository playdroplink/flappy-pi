
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { HelpCircle, Gamepad2, Coins, Trophy, Zap } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 w-full h-full max-w-none max-h-none m-0 rounded-none bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <DialogHeader className="p-6 flex-shrink-0">
            <DialogTitle className="text-center text-3xl text-white flex items-center justify-center space-x-2">
              <HelpCircle className="h-8 w-8 text-white" />
              <span>Help & Guide</span>
            </DialogTitle>
            <p className="text-center text-white/90 text-lg mt-2">
              Learn how to play Flappy Pi
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-auto px-6 pb-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <div className="flex items-start space-x-3">
                  <Gamepad2 className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">How to Play</h3>
                    <ul className="text-blue-700 text-sm space-y-1 list-disc pl-4">
                      <li>Tap or press SPACE to make the bird fly</li>
                      <li>Navigate through the green pipes</li>
                      <li>Avoid hitting pipes or the ground</li>
                      <li>Each pipe you pass increases your score</li>
                      <li>Try to beat your high score!</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <div className="flex items-start space-x-3">
                  <Coins className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2">Game Modes</h3>
                    <ul className="text-green-700 text-sm space-y-1 list-disc pl-4">
                      <li><strong>Classic:</strong> Traditional gameplay with increasing difficulty</li>
                      <li><strong>Endless:</strong> Continuous play without level progression</li>
                      <li><strong>Challenge:</strong> Special missions and objectives</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <div className="flex items-start space-x-3">
                  <Zap className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">Pi Network Features</h3>
                    <ul className="text-purple-700 text-sm space-y-1 list-disc pl-4">
                      <li>Buy premium bird skins with Pi cryptocurrency</li>
                      <li>Watch Pi ads to continue after game over</li>
                      <li>Earn Pi coins through gameplay achievements</li>
                      <li>Participate in weekly Pi prize competitions</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <div className="flex items-start space-x-3">
                  <Trophy className="h-6 w-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Leaderboards & Rewards</h3>
                    <ul className="text-yellow-700 text-sm space-y-1 list-disc pl-4">
                      <li>Weekly leaderboard competitions</li>
                      <li>Top 3 players win Pi coins every week</li>
                      <li>🥇 1st Place: 100 Pi coins</li>
                      <li>🥈 2nd Place: 50 Pi coins</li>
                      <li>🥉 3rd Place: 25 Pi coins</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <div className="text-gray-700 text-sm space-y-4">
                  <h4 className="font-semibold text-gray-800">Tips for Success:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Practice timing your taps - don't tap too frequently</li>
                    <li>Stay calm and focused, especially at higher levels</li>
                    <li>Use the continue feature (watch ad) strategically</li>
                    <li>Collect daily rewards to build up your Pi coins</li>
                    <li>Try different bird skins to find your favorite</li>
                  </ul>

                  <h4 className="font-semibold text-gray-800 mt-6">Troubleshooting:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>If game is laggy, close other browser tabs</li>
                    <li>Ensure your Pi Network wallet is connected</li>
                    <li>Contact support if payments don't process</li>
                    <li>Refresh the page if game doesn't load</li>
                  </ul>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      Need more help? Contact: support@mrwain.org<br/>
                      MRWAIN ORGANIZATION - Flappy Pi
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
