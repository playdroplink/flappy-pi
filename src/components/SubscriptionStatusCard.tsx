
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Crown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Shield,
  Info
} from 'lucide-react';
import { format } from 'date-fns';

interface SubscriptionStatusCardProps {
  className?: string;
}

const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({ className }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const { profile, refreshProfile } = useUserProfile();
  const { toast } = useToast();

  if (!profile) return null;

  const {
    subscription_status = 'none',
    subscription_start,
    subscription_end,
    subscription_plan
  } = profile;

  const isExpired = subscription_end ? new Date(subscription_end) < new Date() : false;
  const isActive = subscription_status === 'active' && !isExpired;
  const isCancelled = subscription_status === 'cancelled';

  const getStatusInfo = () => {
    if (isActive) {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        label: 'Active',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    }
    if (isCancelled && !isExpired) {
      return {
        icon: <Clock className="h-4 w-4 text-orange-600" />,
        label: 'Cancelled (Active until expiry)',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    }
    if (isExpired || subscription_status === 'expired') {
      return {
        icon: <XCircle className="h-4 w-4 text-red-600" />,
        label: 'Expired',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    }
    return {
      icon: <Info className="h-4 w-4 text-gray-600" />,
      label: 'No Active Plan',
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    };
  };

  const handleCancelSubscription = async () => {
    if (!profile?.pi_user_id) return;

    setIsCancelling(true);
    try {
      const { data, error } = await supabase.rpc('cancel_subscription', {
        p_pi_user_id: profile.pi_user_id,
        p_reason: 'user_requested'
      });

      if (error) {
        throw error;
      }

      const result = data as { success: boolean; error?: string; message?: string; remains_active_until?: string };

      if (result.success) {
        toast({
          title: "Subscription Cancelled",
          description: result.message || "Your subscription has been cancelled successfully.",
        });
        
        // Refresh profile to get updated status
        await refreshProfile();
      } else {
        throw new Error(result.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Failed to cancel subscription",
        variant: "destructive"
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-800">Subscription Status</h3>
          </div>
          <Badge className={`${statusInfo.color} flex items-center space-x-1`}>
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </Badge>
        </div>

        {/* Plan Information */}
        {subscription_plan && subscription_plan !== 'none' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Current Plan</span>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  {subscription_plan.charAt(0).toUpperCase() + subscription_plan.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {subscription_start && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-gray-600">Started:</span>
                      <div className="font-medium text-gray-800">
                        {format(new Date(subscription_start), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                )}
                
                {subscription_end && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-gray-600">Expires:</span>
                      <div className="font-medium text-gray-800">
                        {format(new Date(subscription_end), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cancel Button */}
        {isActive && subscription_status === 'active' && (
          <div className="space-y-3">
            <Button
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              variant="destructive"
              className="w-full"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </div>
        )}

        {/* No Refund Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Important Notice</p>
              <p>
                All Pi Network payments are final and non-refundable. 
                Cancelled subscriptions remain active until the expiry date.
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Secure Payments</p>
              <p>
                All transactions are secured by Pi Network's blockchain technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionStatusCard;
