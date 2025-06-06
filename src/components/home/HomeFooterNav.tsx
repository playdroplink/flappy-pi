
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, FileText, Mail, Settings } from 'lucide-react';

interface HomeFooterNavProps {
  onNavigate: (path: string) => void;
}

const HomeFooterNav: React.FC<HomeFooterNavProps> = ({ onNavigate }) => {
  return (
    <div className="px-2 sm:px-4 pb-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
      <Card className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border-0">
        <div className="grid grid-cols-4 gap-1 mb-2 sm:mb-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate('/privacy')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-1 sm:py-2 px-1 rounded-lg"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs">Privacy</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate('/terms')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-1 sm:py-2 px-1 rounded-lg"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs">Terms</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate('/contact')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-1 sm:py-2 px-1 rounded-lg"
          >
            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs">Contact</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate('/help')}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-800 h-auto py-1 sm:py-2 px-1 rounded-lg"
          >
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs">Help</span>
          </Button>
        </div>
        <div className="text-center pt-1 sm:pt-2 border-t border-gray-200">
          <p className="text-gray-800 text-xs sm:text-sm font-bold">
            Powered by Pi Network • MRWAIN ORGANIZATION
          </p>
        </div>
      </Card>
    </div>
  );
};

export default HomeFooterNav;
