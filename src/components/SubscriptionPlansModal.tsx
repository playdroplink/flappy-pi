
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap, Heart, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionPlansModal: React.FC<SubscriptionPlansModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();

  const plans = [
    {
      id: 'starter',
      name: 'Starter Pack',
      price: '5 Pi',
      period: 'one-time',
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
      price: '15 Pi',
      period: 'one-time',
      description: 'Perfect for serious gamers',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      features: [
        '15,000 bonus coins',
        '3 premium bird skins',
        '2x coin multiplier (7 days)',
        'Weekly Pi bonus',
        'VIP badge'
      ],
      popular: true
    },
    {
      id: 'ultimate',
      name: 'Ultimate Pack',
      price: '30 Pi',
      period: 'one-time',
      description: 'Maximum rewards and exclusive content',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      features: [
        '50,000 bonus coins',
        'All premium bird skins',
        '5x coin multiplier (14 days)',
        'Monthly Pi airdrops',
        'Exclusive elite skins',
        'Lifetime VIP status'
      ],
      popular: false
    }
  ];

  const handlePurchase = async (plan: any) => {
    toast({
      title: "Processing Pi Payment",
      description: `Processing ${plan.price} payment for ${plan.name}...`
    });

    // Simulate Pi Network payment processing
    setTimeout(() => {
      toast({
        title: "Purchase Successful! 🎉",
        description: `Successfully purchased ${plan.name} with ${plan.price}!`
      });
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white border-gray-300">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl text-gray-800 flex items-center justify-center space-x-2 mb-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pi Premium Packs
            </span>
          </DialogTitle>
          <p className="text-center text-gray-600">
            One-time purchases to boost your gaming experience
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                  Most Popular
                </Badge>
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
                
                <Button
                  onClick={() => handlePurchase(plan)}
                  className={`w-full mb-6 bg-gradient-to-r ${plan.color} hover:opacity-90`}
                  size="lg"
                >
                  Buy with Pi
                </Button>
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

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                <Heart className="w-6 h-6 text-red-500" />
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
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPlansModal;
