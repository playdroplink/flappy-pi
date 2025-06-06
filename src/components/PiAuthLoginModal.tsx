
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wallet, Shield, Coins, X } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

interface PiAuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PiAuthLoginModal: React.FC<PiAuthLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { signInWithPi, isAuthenticated, user } = useSupabaseAuth();
  const { toast } = useToast();

  const handlePiConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await signInWithPi();
      if (success) {
        toast({
          title: "Welcome to Flappy Pi! 🎉",
          description: "Successfully connected to Pi Network. Start earning while you play!"
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Pi connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGuestPlay = () => {
    localStorage.setItem('flappypi-guest-mode', 'true');
    toast({
      title: "Guest Mode Activated",
      description: "Playing as guest. Connect Pi Network later to save progress and earn rewards!"
    });
    onClose();
  };

  if (isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-b from-blue-50 to-cyan-50 border-2 border-blue-200">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-6 w-6"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-center text-xl font-bold text-blue-800">
              Welcome Back! 👋
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            <div className="text-4xl">🚀</div>
            <p className="text-blue-700">
              You're already connected to Pi Network as <strong>{user?.user_metadata?.username}</strong>
            </p>
            <Button onClick={onClose} className="w-full">
              Continue Playing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-b from-blue-50 to-cyan-50 border-2 border-blue-200">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-6 w-6"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center text-xl font-bold text-blue-800">
            Welcome to Flappy Pi! 🚀
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🐦</div>
            <p className="text-gray-600">
              The Pi Network game where you can earn while you play!
            </p>
          </div>

          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Wallet className="h-5 w-5" />
                Connect Pi Network
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-purple-700">
                <Shield className="h-4 w-4" />
                <span>Secure Pi Network authentication</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-700">
                <Coins className="h-4 w-4" />
                <span>Earn Pi coins while playing</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-700">
                <Wallet className="h-4 w-4" />
                <span>Save progress & buy upgrades</span>
              </div>
              
              <Button
                onClick={handlePiConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to Pi...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Pi Network
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">
              Don't have Pi Network yet?
            </p>
            <Button
              variant="outline"
              onClick={handleGuestPlay}
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              Play as Guest
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              You can connect Pi Network later to save your progress
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PiAuthLoginModal;
