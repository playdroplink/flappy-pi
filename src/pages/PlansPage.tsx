
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlansPage = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      color: 'from-gray-400 to-gray-600',
      features: [
        'Play unlimited games',
        'Basic bird skins',
        'Leaderboard access',
        'Ads supported'
      ],
      current: true
    },
    {
      name: 'Premium',
      price: '50 Pi/month',
      color: 'from-purple-500 to-pink-600',
      features: [
        'Everything in Basic',
        'Ad-free experience',
        'Exclusive premium skins',
        'Double Pi coin rewards',
        'Priority customer support'
      ],
      popular: true
    },
    {
      name: 'VIP',
      price: '100 Pi/month',
      color: 'from-yellow-500 to-orange-600',
      features: [
        'Everything in Premium',
        'Ultra-rare VIP skins',
        'Weekly bonus rewards',
        'Early access to new features',
        'Custom bird animations'
      ]
    }
  ];

  return (
    <div className="min-h-screen p-4 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/home">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Premium Plans</h1>
        <div className="w-16" />
      </div>

      {/* Hero Section */}
      <Card className="mb-6 p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-center">
        <Crown className="h-12 w-12 mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-2">Unlock Premium Features</h2>
        <p className="text-sm opacity-90">
          Remove ads, get exclusive skins, and earn more rewards!
        </p>
      </Card>

      {/* Plans */}
      <div className="space-y-4 mb-8">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`p-4 relative ${
              plan.popular ? 'ring-2 ring-purple-500' : ''
            } ${plan.current ? 'bg-blue-50' : 'bg-white/95'} backdrop-blur-sm`}
          >
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                MOST POPULAR
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center`}>
                  {plan.name === 'VIP' ? <Crown className="h-6 w-6 text-white" /> : 
                   plan.name === 'Premium' ? <Zap className="h-6 w-6 text-white" /> :
                   <span className="text-white font-bold">F</span>}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.price}</p>
                </div>
              </div>
              
              {plan.current ? (
                <Button disabled className="bg-gray-300 text-gray-600">
                  Current Plan
                </Button>
              ) : (
                <Button className={`bg-gradient-to-r ${plan.color} text-white hover:opacity-90`}>
                  Subscribe
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Benefits */}
      <Card className="mb-8 p-4 bg-white/95 backdrop-blur-sm">
        <h3 className="font-bold text-gray-800 mb-3">Why Go Premium?</h3>
        <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
          <div>🚫 <strong>No Ads:</strong> Enjoy uninterrupted gameplay</div>
          <div>✨ <strong>Exclusive Content:</strong> Access unique bird skins</div>
          <div>💰 <strong>More Rewards:</strong> Earn Pi coins faster</div>
          <div>⚡ <strong>Priority Support:</strong> Get help when you need it</div>
        </div>
      </Card>
    </div>
  );
};

export default PlansPage;
