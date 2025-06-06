
import React from 'react';
import { Button } from '@/components/ui/button';

interface WelcomeFooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenHelp: () => void;
}

const WelcomeFooter: React.FC<WelcomeFooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenHelp
}) => {
  return (
    <div className="p-4 text-center space-y-3 animate-fade-in" style={{ animationDelay: '0.8s' }}>
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenPrivacy}
          className="text-white/80 hover:text-white hover:bg-white/10 h-8 px-3 text-xs"
        >
          Privacy Policy
        </Button>
        <span className="text-white/50">•</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenTerms}
          className="text-white/80 hover:text-white hover:bg-white/10 h-8 px-3 text-xs"
        >
          Terms of Service
        </Button>
        <span className="text-white/50">•</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenContact}
          className="text-white/80 hover:text-white hover:bg-white/10 h-8 px-3 text-xs"
        >
          Contact Us
        </Button>
        <span className="text-white/50">•</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenHelp}
          className="text-white/80 hover:text-white hover:bg-white/10 h-8 px-3 text-xs"
        >
          Help & FAQ
        </Button>
      </div>
      
      <div className="text-xs text-white/60">
        <p>© 2025 Flappy Pi - Built for Pi Network</p>
        <p className="mt-1">
          Made with ❤️ for the Pi Community
        </p>
      </div>
    </div>
  );
};

export default WelcomeFooter;
