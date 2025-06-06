
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, FileText, Scale, AlertTriangle, Users, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 overflow-hidden">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center space-x-4 p-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden px-4 pb-4">
          <ScrollArea className="h-full">
            <div className="space-y-6 pr-4">
              <Card className="p-6 bg-white/95 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">MRWAIN ORGANIZATION - Flappy Pi</h2>
                  <p className="text-gray-600">Effective Date: January 2025</p>
                </div>

                <div className="space-y-6">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Scale className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">Acceptance of Terms</h3>
                        <p className="text-blue-700 text-sm">
                          By playing Flappy Pi, you agree to these terms and conditions. This game is built for the Pi Network ecosystem and follows Pi Network's community guidelines.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-start space-x-3">
                      <Users className="h-6 w-6 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-green-800 mb-2">Fair Play</h3>
                        <p className="text-green-700 text-sm">
                          Cheating, exploiting, or using unauthorized tools is prohibited. Maintain respectful behavior in leaderboards and community features.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-orange-50 border-orange-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-orange-800 mb-2">Pi Network Integration</h3>
                        <p className="text-orange-700 text-sm">
                          Pi payments and rewards are subject to Pi Network's terms. Flappy Pi is an independent application built on Pi Network infrastructure.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div className="text-gray-700 text-sm space-y-4">
                    <h4 className="font-semibold text-gray-800">Key Points:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Game content and scores are stored securely</li>
                      <li>Virtual currency (Flappy Coins) has no real-world value</li>
                      <li>We reserve the right to modify features or suspend accounts for violations</li>
                      <li>You retain ownership of your Pi Network wallet and assets</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* FAQ Section */}
              <Card className="p-6 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">Terms FAQ</h3>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-gray-200">
                    <AccordionTrigger className="text-gray-800">What happens if I violate the fair play rules?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      Violations may result in temporary suspension, score reset, or permanent account ban depending on the severity. We review each case individually and provide appeal options.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-gray-200">
                    <AccordionTrigger className="text-gray-800">Can I transfer my Flappy Coins to other players?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      No, Flappy Coins are non-transferable virtual currency for in-game purchases only. They cannot be exchanged for real money or transferred between accounts.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-gray-200">
                    <AccordionTrigger className="text-gray-800">What if Pi Network changes their terms?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      We will update our terms accordingly and notify users of any significant changes. Continued use of the game constitutes acceptance of updated terms.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border-gray-200">
                    <AccordionTrigger className="text-gray-800">Who owns the intellectual property of Flappy Pi?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      MRWAIN ORGANIZATION owns all game assets, code, and branding. The game is licensed under PiOS License for Pi Network ecosystem use.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Contact: legal@mrwain.org<br/>
                    MRWAIN ORGANIZATION
                  </p>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
