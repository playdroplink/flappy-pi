
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { usePiPayments } from '@/hooks/usePiPayments';
import { Check, AlertCircle, X } from 'lucide-react';

interface PiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemDescription?: string;
  piAmount: number;
  onSuccess: () => void;
  skinId?: string;
  isSubscription?: boolean;
}

enum PaymentState {
  AUTH = 'auth',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}

const PiPaymentModal: React.FC<PiPaymentModalProps> = ({
  isOpen,
  onClose,
  itemName,
  itemDescription,
  piAmount,
  onSuccess,
  skinId,
  isSubscription = false
}) => {
  const [paymentState, setPaymentState] = useState<PaymentState>(PaymentState.AUTH);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { authenticateUser, purchaseAdFreeSubscription, purchaseBirdSkin, isProcessing } = usePiPayments();

  const handlePayment = async () => {
    try {
      setPaymentState(PaymentState.PROCESSING);
      
      // First authenticate the user
      const isAuthenticated = await authenticateUser();
      if (!isAuthenticated) {
        setErrorMessage('Pi authentication failed. Please try again.');
        setPaymentState(PaymentState.ERROR);
        return;
      }
      
      // Process the payment based on item type
      let result;
      if (isSubscription) {
        result = await purchaseAdFreeSubscription();
      } else if (skinId) {
        result = await purchaseBirdSkin(skinId, piAmount);
      } else {
        setErrorMessage('Invalid purchase type.');
        setPaymentState(PaymentState.ERROR);
        return;
      }

      if (result.success) {
        setPaymentState(PaymentState.SUCCESS);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setErrorMessage(result.error || 'Payment failed. Please try again.');
        setPaymentState(PaymentState.ERROR);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setPaymentState(PaymentState.ERROR);
    }
  };

  const resetState = () => {
    setPaymentState(PaymentState.AUTH);
    setErrorMessage('');
  };

  const renderContent = () => {
    switch (paymentState) {
      case PaymentState.AUTH:
        return (
          <div className="space-y-6 py-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <div className="text-center mb-4">
                <div className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mt-2">{itemName}</h3>
                {itemDescription && <p className="text-gray-600 text-sm">{itemDescription}</p>}
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-lg">{piAmount} π</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">Pi Network</span>
                </div>
                <div className="text-xs text-gray-500">
                  You'll be securely connected to Pi Network to complete this transaction.
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button onClick={handlePayment} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Pay with Pi
                </Button>
                <Button variant="ghost" onClick={onClose} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        );

      case PaymentState.PROCESSING:
        return (
          <div className="py-8 text-center">
            <Spinner className="mx-auto mb-4 h-12 w-12 text-purple-600" />
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we connect with Pi Network...</p>
          </div>
        );

      case PaymentState.SUCCESS:
        return (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-600">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
            <Button onClick={onClose} variant="outline" className="mx-auto">
              Close
            </Button>
          </div>
        );

      case PaymentState.ERROR:
        return (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-red-600">Payment Failed</h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="space-x-3">
              <Button onClick={resetState} variant="outline" className="mx-auto">
                Try Again
              </Button>
              <Button onClick={onClose} variant="ghost" className="mx-auto">
                Cancel
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setTimeout(resetState, 300); // Reset after dialog closing animation
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Pi Network Payment</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PiPaymentModal;
