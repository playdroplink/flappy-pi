import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Star, Zap, Check, Coins, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ShopHeader from './shop/ShopHeader';
import BirdCharactersSection from './shop/BirdCharactersSection';
import ShopInfoSection from './shop/ShopInfoSection';
import AdFreeSubscriptionSection from './shop/AdFreeSubscriptionSection';
import AllSkinsSubscriptionSection from './shop/AllSkinsSubscriptionSection';
import EliteSubscriptionSection from './shop/EliteSubscriptionSection';

interface ShopModalProps {
  open: boolean;
  onClose: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBack = () => {
    navigate('/');
  };

  const handlePurchase = async (item: any) => {
    toast({
      title: "Processing Pi Payment",
      description: `Processing payment for ${item.name}...`
    });

    // Simulate Pi Network payment processing
    setTimeout(() => {
      toast({
        title: "Purchase Successful! 🎉",
        description: `Successfully purchased ${item.name}!`
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white border shadow-lg rounded-lg overflow-hidden">
        <ScrollArea className="h-[85vh] w-full">
          <div className="p-6">
            {/* Header */}
            <ShopHeader onClose={onClose} />

            {/* Bird Characters Section */}
            <BirdCharactersSection />

            {/* Shop Info Section */}
            <ShopInfoSection />

            {/* Ad-Free Subscription Section */}
            <AdFreeSubscriptionSection />

            {/* All Skins Subscription Section */}
            <AllSkinsSubscriptionSection />

            {/* Elite Subscription Section */}
            <EliteSubscriptionSection />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
