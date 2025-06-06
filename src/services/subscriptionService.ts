
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionData {
  subscription_status: string;
  subscription_start?: string;
  subscription_end?: string;
  subscription_plan?: string;
}

export interface CancelSubscriptionResult {
  success: boolean;
  message?: string;
  error?: string;
  remains_active_until?: string;
}

export interface ActivateSubscriptionResult {
  success: boolean;
  subscription_id?: string;
  end_date?: string;
  error?: string;
}

class SubscriptionService {
  // Cancel user subscription
  async cancelSubscription(piUserId: string, reason: string = 'user_requested'): Promise<CancelSubscriptionResult> {
    try {
      const { data, error } = await supabase.rpc('cancel_subscription', {
        p_pi_user_id: piUserId,
        p_reason: reason
      });

      if (error) {
        console.error('Error cancelling subscription:', error);
        return { success: false, error: error.message };
      }

      return data as CancelSubscriptionResult;
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Activate subscription after Pi payment
  async activateSubscription(
    piUserId: string,
    planId: string,
    planName: string,
    durationDays: number,
    piTransactionId: string,
    amountPi: number = 0
  ): Promise<ActivateSubscriptionResult> {
    try {
      const { data, error } = await supabase.rpc('activate_subscription', {
        p_pi_user_id: piUserId,
        p_plan_id: planId,
        p_plan_name: planName,
        p_duration_days: durationDays,
        p_pi_transaction_id: piTransactionId,
        p_amount_pi: amountPi
      });

      if (error) {
        console.error('Error activating subscription:', error);
        return { success: false, error: error.message };
      }

      return data as ActivateSubscriptionResult;
    } catch (error) {
      console.error('Error in activateSubscription:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Get user's subscription history
  async getSubscriptionHistory(piUserId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('pi_user_id', piUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscription history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSubscriptionHistory:', error);
      return [];
    }
  }

  // Check subscription status
  async checkSubscriptionStatus(piUserId: string): Promise<SubscriptionData | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('subscription_status, subscription_start, subscription_end, subscription_plan')
        .eq('pi_user_id', piUserId)
        .single();

      if (error) {
        console.error('Error checking subscription status:', error);
        return null;
      }

      return data as SubscriptionData;
    } catch (error) {
      console.error('Error in checkSubscriptionStatus:', error);
      return null;
    }
  }

  // Expire old subscriptions (can be called periodically)
  async expireSubscriptions(): Promise<{ success: boolean; expired_count?: number; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('expire_subscriptions');

      if (error) {
        console.error('Error expiring subscriptions:', error);
        return { success: false, error: error.message };
      }

      return data as { success: boolean; expired_count?: number };
    } catch (error) {
      console.error('Error in expireSubscriptions:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}

export const subscriptionService = new SubscriptionService();
