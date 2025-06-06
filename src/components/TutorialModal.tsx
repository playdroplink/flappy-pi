
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, Coins, Trophy, Shield, Zap, Target } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, onStartGame }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorials = [
    {
      title: "Welcome to Flappy Pi! 🚀",
      icon: <Play className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="text-center space-y-4">
          <img 
            src="/lovable-uploads/8d2aed26-e6ed-4f65-9613-6ec708c96c50.png" 
            alt="Flappy Pi Character" 
            className="w-24 h-24 mx-auto animate-bounce"
          />
          <p className="text-gray-700 leading-relaxed">
            Get ready for an exciting adventure where you control a cute bird through challenging obstacles while earning Pi coins!
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-800 font-medium">🎯 Your mission: Navigate through pipes and collect rewards!</p>
          </div>
        </div>
      )
    },
    {
      title: "Basic Controls 🎮",
      icon: <Target className="w-8 h-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-gray-800 mb-2">💻 Desktop Controls</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Spacebar</strong> or <strong>Click</strong> - Make the bird flap</li>
                <li>• <strong>P</strong> - Pause/Resume game</li>
                <li>• <strong>ESC</strong> - Return to menu</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-cyan-50 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-800 mb-2">📱 Mobile Controls</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Tap screen</strong> - Make the bird flap</li>
                <li>• <strong>Tap pause button</strong> - Pause game</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Game Modes 🎯",
      icon: <Trophy className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-gradient-to-r from-emerald-50 to-green-100 p-4 rounded-lg">
              <h4 className="font-semibold text-emerald-800 mb-2">🟢 Classic Mode</h4>
              <p className="text-emerald-700">Perfect for beginners! Standard difficulty with regular pipe spacing.</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🔵 Endless Mode</h4>
              <p className="text-blue-700">Keep playing forever! Difficulty increases as you progress.</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-100 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">🟣 Challenge Mode</h4>
              <p className="text-purple-700">For experts! Faster speed, tighter gaps, more obstacles.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pi Coins & Rewards 💰",
      icon: <Coins className="w-8 h-8 text-yellow-500" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-3">How to Earn Pi Coins:</h4>
            <ul className="space-y-2 text-yellow-700">
              <li>• 🎯 <strong>Score points</strong> - 1 coin per point</li>
              <li>• 💎 <strong>Collect coin pickups</strong> - Bonus coins in game</li>
              <li>• 📺 <strong>Watch ads</strong> - Extra coin rewards</li>
              <li>• 🏆 <strong>Complete achievements</strong> - Special bonuses</li>
              <li>• 🎁 <strong>Daily rewards</strong> - Login bonuses</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">💰 Spend Coins On:</h4>
            <ul className="space-y-1 text-purple-700">
              <li>• 🐦 New bird skins</li>
              <li>• 🛡️ Power-ups and shields</li>
              <li>• 💫 Continue after game over</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Power-ups & Features 🛡️",
      icon: <Shield className="w-8 h-8 text-red-500" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">🛡️ Shield Power-up</h4>
              <p className="text-red-700">Protects you from one collision with pipes.</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚡ Speed Boost</h4>
              <p className="text-yellow-700">Temporarily increases your flying speed.</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">💫 Continue Option</h4>
              <p className="text-green-700">Watch an ad or spend coins to continue after crashing.</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🎨 Bird Skins</h4>
              <p className="text-blue-700">Customize your bird with different colors and styles.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pro Tips 🎓",
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-3">🎯 Master Tips:</h4>
            <ul className="space-y-2 text-orange-700">
              <li>• 🎪 <strong>Rhythm is key</strong> - Find a steady tapping rhythm</li>
              <li>• 👀 <strong>Look ahead</strong> - Don't just focus on your bird</li>
              <li>• 🧘 <strong>Stay calm</strong> - Panic leads to over-tapping</li>
              <li>• 📈 <strong>Practice daily</strong> - Consistency improves skill</li>
              <li>• 🎯 <strong>Aim for center</strong> - Fly through middle of gaps</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🏆 Ready to Play?</h4>
            <p className="text-blue-700">
              You're all set! Remember, practice makes perfect. Start with Classic mode and work your way up!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorials.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartGame = () => {
    onClose();
    onStartGame();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
            {tutorials[currentStep].icon}
            <span>{tutorials[currentStep].title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {tutorials.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Tutorial content */}
          <Card className="border-0 bg-gray-50">
            <CardContent className="p-6">
              {tutorials[currentStep].content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <span className="text-sm text-gray-500">
              {currentStep + 1} of {tutorials.length}
            </span>

            {currentStep === tutorials.length - 1 ? (
              <Button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Playing!</span>
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Quick action buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Skip Tutorial
            </Button>
            {currentStep !== tutorials.length - 1 && (
              <Button
                onClick={handleStartGame}
                variant="outline"
                className="flex-1"
              >
                Play Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialModal;
