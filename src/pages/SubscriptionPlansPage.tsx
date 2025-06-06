
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Crown, Star, Zap, Check, Coins, X, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { subscriptionService } from '@/services/subscriptionService';
import SubscriptionStatusCard from '@/components/SubscriptionStatusCard';
import SubscriptionHistoryModal from '@/components/SubscriptionHistoryModal';
import EnhancedFooter from '@/components/EnhancedFooter';

const SubscriptionPlansPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, refreshProfile } = useUserProfile();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter Pack',
      price: '5 π',
      period: 'one-time',
      duration: 30,
      description: 'Essential features for new players',
      icon: <Star className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: [
        '5,000 bonus coins',
        '1 premium bird skin',
        'Daily bonus multiplier',
        'Priority support'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      price: '15 π',
      period: 'one-time',
      duration: 30,
      description: 'Perfect for serious gamers',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      features: [
        '15,000 bonus coins',
        '3 premium bird skins',
        '2x coin multiplier (30 days)',
        'Weekly Pi bonus',
        'VIP badge'
      ],
      popular: true
    },
    {
      id: 'ultimate',
      name: 'Ultimate Pack',
      price: '30 π',
      period: 'one-time',
      duration: 60,
      description: 'Maximum rewards and exclusive content',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      features: [
        '50,000 bonus coins',
        'All premium bird skins',
        '5x coin multiplier (60 days)',
        'Monthly Pi airdrops',
        'Exclusive elite skins',
        'Lifetime VIP status'
      ],
      popular: false
    }
  ];

  const handlePurchase = async (plan: any) => {
    if (!profile?.pi_user_id) {
      toast({
        title: "Authentication Required",
        description: "Please create a profile first.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Processing Pi Payment",
      description: `Processing ${plan.price} payment for ${plan.name}...`
    });

    // Simulate Pi Network payment processing
    setTimeout(async () => {
      try {
        const mockTransactionId = `pi_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const amountPi = parseFloat(plan.price.replace(' π', ''));

        const result = await subscriptionService.activateSubscription(
          profile.pi_user_id,
          plan.id,
          plan.name,
          plan.duration,
          mockTransactionId,
          amountPi
        );

        if (result.success) {
          toast({
            title: "Purchase Successful! 🎉",
            description: `Successfully purchased ${plan.name} with ${plan.price}!`
          });
          
          // Refresh profile to show updated subscription status
          await refreshProfile();
        } else {
          throw new Error(result.error || 'Payment failed');
        }
      } catch (error) {
        console.error('Purchase error:', error);
        toast({
          title: "Purchase Failed",
          description: error instanceof Error ? error.message : "Failed to process purchase",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const handleCancelPlan = async (planId: string) => {
    if (!profile?.pi_user_id) return;

    toast({
      title: "Processing Cancellation",
      description: "Cancelling your subscription..."
    });

    try {
      const result = await subscriptionService.cancelSubscription(profile.pi_user_id);
      
      if (result.success) {
        toast({
          title: "Subscription Cancelled",
          description: result.message || "Your subscription has been cancelled successfully."
        });
        
        await refreshProfile();
      } else {
        throw new Error(result.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Failed to cancel subscription",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={() => setIsHistoryOpen(true)}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <History className="w-6 h-6 mr-2" />
              History
            </Button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Crown className="h-8 w-8 text-yellow-300" />
              <h1 className="text-4xl font-black text-white drop-shadow-lg">
                Pi Premium Packs
              </h1>
            </div>
            <p className="text-xl text-white/90 drop-shadow-md">
              One-time purchases to boost your gaming experience
            </p>
          </div>

          {/* Current Subscription Status */}
          <div className="max-w-4xl mx-auto mb-8">
            <SubscriptionStatusCard />
          </div>

          {/* Plans Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative p-6 border-2 transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/25 bg-gradient-to-br from-purple-50 to-pink-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                    {plan.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                    <span className="text-gray-500 text-sm ml-2">{plan.period}</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <Button
                      onClick={() => handlePurchase(plan)}
                      className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
                      size="lg"
                    >
                      Buy with Pi
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Pi Network Info */}
          <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Coins className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Pi Network Integration</h4>
                <p className="text-gray-700 text-sm mb-4">
                  All purchases are processed through the Pi Network blockchain. 
                  Your Pi coins are securely transferred and rewards are instantly applied to your account.
                </p>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <h5 className="font-medium text-gray-800 mb-1">Secure & Instant</h5>
                  <p className="text-xs text-gray-600">Powered by Pi Network's secure payment system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <EnhancedFooter />
      </ScrollArea>

      <SubscriptionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};

export default SubscriptionPlansPage;
