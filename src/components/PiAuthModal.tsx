
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePiAuth } from '@/hooks/usePiAuth';
import { Loader2 } from 'lucide-react';

interface PiAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PiAuthModal: React.FC<PiAuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, loading } = usePiAuth();

  const handleSignIn = async () => {
    await signIn();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <img 
              src="/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png" 
              alt="Flappy Pi Logo" 
              className="w-16 h-16 object-contain"
            />
            <DialogTitle className="text-center text-2xl font-bold text-blue-600">
              Welcome to Flappy Pi! 🐦
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-6">
          <img 
            src="/lovable-uploads/8d2aed26-e6ed-4f65-9613-6ec708c96c50.png" 
            alt="Flappy Pi Character" 
            className="w-20 h-20 object-contain animate-bounce"
          />
          
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Sign in with Pi Network</h3>
            <p className="text-gray-600 text-sm">
              Connect your Pi Network account to save your progress, compete on leaderboards, and earn Pi rewards!
            </p>
          </div>
          
          <Button 
            onClick={handleSignIn}
            className="w-full text-lg py-3 bg-purple-600 hover:bg-purple-700"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting to Pi Network...
              </>
            ) : (
              <>
                🥧 Sign in with Pi Network
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PiAuthModal;
