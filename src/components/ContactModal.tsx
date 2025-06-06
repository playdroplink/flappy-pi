
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Mail, MessageSquare, Globe, Users } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 w-full h-full max-w-none max-h-none m-0 rounded-none bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <DialogHeader className="p-6 flex-shrink-0">
            <DialogTitle className="text-center text-3xl text-white flex items-center justify-center space-x-2">
              <Mail className="h-8 w-8 text-white" />
              <span>Contact Us</span>
            </DialogTitle>
            <p className="text-center text-white/90 text-lg mt-2">
              MRWAIN ORGANIZATION - Get in Touch
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-auto px-6 pb-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <div className="flex items-start space-x-3">
                  <Mail className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Email Support</h3>
                    <p className="text-blue-700 text-sm mb-2">
                      For general inquiries, bug reports, and support:
                    </p>
                    <a href="mailto:support@mrwain.org" className="text-blue-600 font-medium">
                      support@mrwain.org
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2">Business Inquiries</h3>
                    <p className="text-green-700 text-sm mb-2">
                      For partnerships, business proposals, and collaborations:
                    </p>
                    <a href="mailto:business@mrwain.org" className="text-green-600 font-medium">
                      business@mrwain.org
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <div className="flex items-start space-x-3">
                  <Globe className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">Website</h3>
                    <p className="text-purple-700 text-sm mb-2">
                      Visit our official website for more information:
                    </p>
                    <a href="https://mrwain.org" className="text-purple-600 font-medium">
                      www.mrwain.org
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-orange-800 mb-2">Community</h3>
                    <p className="text-orange-700 text-sm mb-2">
                      Join our community for updates and discussions:
                    </p>
                    <div className="space-y-1">
                      <p className="text-orange-600 font-medium">Discord: Coming Soon</p>
                      <p className="text-orange-600 font-medium">Telegram: Coming Soon</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <div className="text-gray-700 text-sm space-y-4">
                  <h4 className="font-semibold text-gray-800">Response Times:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>General Support: 24-48 hours</li>
                    <li>Bug Reports: 12-24 hours</li>
                    <li>Business Inquiries: 2-5 business days</li>
                  </ul>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      MRWAIN ORGANIZATION<br/>
                      Flappy Pi Development Team<br/>
                      Building the future of Pi Network gaming
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

export default ContactModal;
