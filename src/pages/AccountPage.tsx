
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Coins, Settings, History, Crown, Star } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    profile, 
    isAuthenticated, 
    signInWithPi, 
    signOut, 
    hasPremium, 
    isAdFree, 
    subscriptionStatus 
  } = useUserProfile();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="w-6 h-6 text-purple-600" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Sign in with Pi Network to access your account.
              </p>
              <Button onClick={signInWithPi} className="bg-purple-600 hover:bg-purple-700">
                Sign in with Pi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getSubscriptionBadge = () => {
    if (hasPremium) {
      return <Badge className="bg-purple-600"><Crown className="w-3 h-3 mr-1" />Premium</Badge>;
    }
    if (subscriptionStatus === 'active') {
      return <Badge className="bg-blue-600"><Star className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="secondary">Free</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Account</h1>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </span>
              {getSubscriptionBadge()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Username</label>
              <p className="font-semibold">{profile?.username || 'Player'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Coins Balance</label>
              <p className="font-semibold flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-500" />
                {profile?.total_coins || 0}
              </p>
            </div>

            {isAdFree && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm font-medium">✨ Ad-Free Experience Active</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/payment-history')}
            >
              <History className="w-4 h-4 mr-2" />
              Payment History
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/subscription-plans')}
            >
              <Crown className="w-4 h-4 mr-2" />
              Subscription Plans
            </Button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="pt-6">
            <Button
              variant="destructive"
              onClick={signOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
