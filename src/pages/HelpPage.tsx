
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, HelpCircle, Play, Trophy, Coins, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-6 w-6 text-white" />
            <h1 className="text-2xl font-bold text-white">How to Play</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <div className="text-center mb-6">
                <img 
                  src="/lovable-uploads/8d2aed26-e6ed-4f65-9613-6ec708c96c50.png" 
                  alt="Flappy Pi Character" 
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h2 className="text-xl font-bold text-gray-800">Welcome to Flappy Pi! 🚀</h2>
              </div>

              <div className="space-y-6">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Gamepad2 className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">Basic Controls</h3>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• <strong>Tap/Click:</strong> Make the bird flap and fly up</li>
                        <li>• <strong>Gravity:</strong> Bird falls down naturally</li>
                        <li>• <strong>Goal:</strong> Navigate through pipes without hitting them</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start space-x-3">
                    <Play className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Game Modes</h3>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• <strong>Classic:</strong> Traditional difficulty progression</li>
                        <li>• <strong>Endless:</strong> Continuous challenge mode</li>
                        <li>• <strong>Challenge:</strong> Maximum difficulty from start</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-purple-50 border-purple-200">
                  <div className="flex items-start space-x-3">
                    <Coins className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-2">Earning Coins</h3>
                      <ul className="text-purple-700 text-sm space-y-1">
                        <li>• <strong>Score Points:</strong> 1 coin per pipe passed</li>
                        <li>• <strong>Watch Ads:</strong> Bonus coins for ad viewing</li>
                        <li>• <strong>Daily Rewards:</strong> Log in daily for bonuses</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-orange-50 border-orange-200">
                  <div className="flex items-start space-x-3">
                    <Trophy className="h-6 w-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-orange-800 mb-2">Pi Network Features</h3>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• <strong>Pi Payments:</strong> Purchase premium features with Pi</li>
                        <li>• <strong>Weekly Contests:</strong> Top players win real Pi</li>
                        <li>• <strong>Leaderboards:</strong> Compete with Pi Network users</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <div className="text-gray-700 text-sm space-y-4">
                  <h4 className="font-semibold text-gray-800">Pro Tips:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Stay calm and maintain steady rhythm</li>
                    <li>Look ahead to anticipate pipe gaps</li>
                    <li>Practice makes perfect - don't give up!</li>
                    <li>Use earned coins to unlock cool bird skins</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* FAQ Section */}
            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-4">
                <HelpCircle className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Gameplay FAQ</h3>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-gray-200">
                  <AccordionTrigger className="text-gray-800">Why does my bird keep falling?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    The bird is affected by gravity and will naturally fall. You need to tap/click regularly to keep it flying. Find a rhythm that works for you - usually one tap every 0.5-1 seconds.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-gray-200">
                  <AccordionTrigger className="text-gray-800">How do I get better at the game?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Practice consistently, focus on timing rather than speed, watch the gap in pipes ahead, and stay calm. Many players improve significantly after their first 10-20 attempts.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-gray-200">
                  <AccordionTrigger className="text-gray-800">What can I buy with Flappy Coins?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Use Flappy Coins to purchase new bird skins, power-ups, continue tokens after game over, and unlock special game modes. Check the shop for all available items.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-gray-200">
                  <AccordionTrigger className="text-gray-800">How do leaderboards work?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Weekly leaderboards reset every Monday. Your highest score of the week counts. Top 3 players win Pi coins as prizes. Global leaderboards show all-time best scores.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-gray-200">
                  <AccordionTrigger className="text-gray-800">Can I play offline?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Basic gameplay works offline, but features like leaderboards, Pi payments, rewards, and cloud save require an internet connection.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Need more help? Contact: support@mrwain.org<br/>
                  MRWAIN ORGANIZATION
                </p>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default HelpPage;
