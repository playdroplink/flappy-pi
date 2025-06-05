
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { FileText, AlertTriangle, Zap } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-gray-300">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-gray-800 flex items-center justify-center space-x-2">
            <FileText className="h-6 w-6 text-blue-500" />
            <span>Terms of Service</span>
          </DialogTitle>
          <p className="text-center text-gray-600 text-sm">
            MRWAIN ORGANIZATION - Flappy Pi
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <Zap className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Pi Network Integration</h3>
                <p className="text-blue-700 text-sm">
                  This game integrates with Pi Network for payments and authentication. By using this service, you agree to comply with Pi Network's terms and conditions. All Pi transactions are final and non-refundable.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-start space-x-3">
              <FileText className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Game Usage</h3>
                <p className="text-green-700 text-sm">
                  You may use this game for personal entertainment. Any attempt to hack, exploit, or manipulate the game mechanics is strictly prohibited and may result in account termination.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Disclaimer</h3>
                <p className="text-yellow-700 text-sm">
                  The game is provided "as is" without warranties. MRWAIN ORGANIZATION is not responsible for any loss of Pi coins, game progress, or other issues that may arise during gameplay.
                </p>
              </div>
            </div>
          </Card>

          <div className="text-gray-700 text-sm space-y-4">
            <h4 className="font-semibold text-gray-800">Key Terms:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fair play is required at all times</li>
              <li>No sharing of accounts or credentials</li>
              <li>Respect other players in leaderboards</li>
              <li>Report bugs and issues responsibly</li>
              <li>Pi payments are processed by Pi Network</li>
            </ul>

            <h4 className="font-semibold text-gray-800 mt-6">Intellectual Property:</h4>
            <p className="text-sm">
              Flappy Pi is owned by MRWAIN ORGANIZATION. All game assets, code, and content are protected by copyright and other intellectual property laws.
            </p>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Last updated: January 2025<br/>
                Contact: legal@mrwain.org<br/>
                MRWAIN ORGANIZATION
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
