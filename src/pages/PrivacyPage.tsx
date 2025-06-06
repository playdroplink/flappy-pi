
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Shield, Eye, Lock, Database, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
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
            <Shield className="h-6 w-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">MRWAIN ORGANIZATION - Flappy Pi</h2>
                <p className="text-gray-600">Effective Date: January 2025</p>
              </div>

              <div className="space-y-6">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Eye className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">Data Collection</h3>
                      <p className="text-blue-700 text-sm">
                        We collect minimal data necessary for game functionality including game scores, Pi Network wallet address for payments, and basic usage analytics to improve the gaming experience.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Data Protection</h3>
                      <p className="text-green-700 text-sm">
                        All data is encrypted and stored securely. We use industry-standard security measures to protect your information. Payment data is processed through Pi Network's secure payment system.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-purple-50 border-purple-200">
                  <div className="flex items-start space-x-3">
                    <Database className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-2">Data Usage</h3>
                      <p className="text-purple-700 text-sm">
                        Your data is used solely for game functionality, leaderboards, Pi Network payments, and improving user experience. We never sell or share personal data with third parties.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="text-gray-700 text-sm space-y-4">
                  <h4 className="font-semibold text-gray-800">Your Rights:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal data</li>
                    <li>Request data deletion</li>
                    <li>Opt-out of analytics</li>
                    <li>Update your information</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* FAQ Section */}
            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-4">
                <HelpCircle className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Privacy FAQ</h3>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-gray-200">
                  <AccordionTrigger className="text-gray-800">What personal information do you collect?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We collect your Pi Network wallet address for payments, game scores, device information for analytics, and any information you voluntarily provide when contacting support.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-gray-200">
                  <AccordionTrigger className="text-gray-800">How is my Pi Network data protected?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    All Pi Network transactions are processed through Pi's secure payment system. We never store your Pi Network credentials or have access to your wallet beyond the payment transaction.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-gray-200">
                  <AccordionTrigger className="text-gray-800">Can I delete my account and data?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, you can request complete data deletion by contacting us at privacy@mrwain.org. We will remove all your personal data within 30 days, except where required by law.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-gray-200">
                  <AccordionTrigger className="text-gray-800">Do you use cookies or tracking?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We use minimal local storage for game settings and progress. No third-party tracking cookies are used. Analytics are anonymized and used only for improving game performance.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Contact: privacy@mrwain.org<br/>
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

export default PrivacyPage;
