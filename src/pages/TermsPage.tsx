
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FileText, Scale, AlertTriangle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
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

        {/* Content */}
        <div className="space-y-6">
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

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Contact: legal@mrwain.org<br/>
                    MRWAIN ORGANIZATION
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
