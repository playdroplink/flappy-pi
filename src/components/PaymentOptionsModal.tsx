
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Play, Zap, Gift } from 'lucide-react';
import PiPaymentModal from './PiPaymentModal';
import { usePiPayments } from '@/hooks/usePiPayments';

interface PaymentOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  piPrice: number;
  coinPrice: number;
  onPayWithPi: () => void;
  onPayWithCoins: () => void;
  onWatchAd: () => void;
  userCoins: number;
  itemDescription?: string;
  skinId?: string;
  isSubscription?: boolean;
}

const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({
  isOpen,
  onClose,
  itemName,
  itemDescription,
  piPrice,
  coinPrice,
  onPayWithPi,
  onPayWithCoins,
  onWatchAd,
  userCoins,
  skinId,
  isSubscription = false
}) => {
  const [showPiModal, setShowPiModal] = useState(false);
  const { isPiAvailable } = usePiPayments();
  const canAffordCoins = userCoins >= coinPrice;

  const handlePiPayment = () => {
    setShowPiModal(true);
  };

  const handlePiSuccess = () => {
    onPayWithPi();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white border-gray-300">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-gray-800">
              Purchase {itemName}
            </DialogTitle>
            <p className="text-center text-gray-600 text-sm">
              Choose your preferred payment method
            </p>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {/* Pi Payment */}
            <Card className={`p-4 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 ${!isPiAvailable ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500 rounded-full">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Pay with Pi</h3>
                    <p className="text-sm text-gray-600">Instant unlock</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-600">{piPrice} Pi</p>
                </div>
              </div>
              <Button 
                onClick={handlePiPayment}
                disabled={!isPiAvailable}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {isPiAvailable ? 'Pay with Pi Network' : 'Pi Network Unavailable'}
              </Button>
              {!isPiAvailable && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Pi Network is not available on this platform or browser.
                </p>
              )}
            </Card>

            {/* Coin Payment */}
            <Card className={`p-4 border-2 ${canAffordCoins ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${canAffordCoins ? 'bg-blue-500' : 'bg-gray-400'}`}>
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Pay with Coins</h3>
                    <p className="text-sm text-gray-600">
                      You have: {userCoins.toLocaleString()} coins
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${canAffordCoins ? 'text-blue-600' : 'text-gray-500'}`}>
                    {coinPrice.toLocaleString()} coins
                  </p>
                </div>
              </div>
              <Button 
                onClick={onPayWithCoins}
                disabled={!canAffordCoins}
                className={`w-full ${canAffordCoins ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' : 'bg-gray-400'}`}
              >
                {canAffordCoins ? 'Pay with Coins' : 'Not Enough Coins'}
              </Button>
            </Card>

            {/* Watch Ad Option */}
            <Card className="p-4 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-full">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Watch Ad</h3>
                    <p className="text-sm text-gray-600">Get 24h trial access</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">FREE</p>
                </div>
              </div>
              <Button 
                onClick={onWatchAd}
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                <Gift className="w-4 h-4 mr-2" />
                Watch Ad for Trial
              </Button>
            </Card>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Pi payments support the Pi Network ecosystem and provide permanent access.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pi Payment Modal */}
      <PiPaymentModal
        isOpen={showPiModal}
        onClose={() => setShowPiModal(false)}
        itemName={itemName}
        itemDescription={itemDescription}
        piAmount={piPrice}
        onSuccess={handlePiSuccess}
        skinId={skinId}
        isSubscription={isSubscription}
      />
    </>
  );
};

export default PaymentOptionsModal;
