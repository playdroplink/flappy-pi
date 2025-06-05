
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Shield, Eye, Lock, Database } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-gray-300">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-gray-800 flex items-center justify-center space-x-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <span>Privacy Policy</span>
          </DialogTitle>
          <p className="text-center text-gray-600 text-sm">
            MRWAIN ORGANIZATION - Flappy Pi
          </p>
        </DialogHeader>

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

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Last updated: January 2025<br/>
                Contact: privacy@mrwain.org<br/>
                MRWAIN ORGANIZATION
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyModal;
