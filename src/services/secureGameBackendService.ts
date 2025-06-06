
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { InputValidation } from '@/utils/inputValidation';

type GameMode = Database['public']['Enums']['game_mode'];
type ItemType = Database['public']['Enums']['item_type'];

export interface GameSessionResult {
  session_id: string;
  is_high_score: boolean;
  total_coins: number;
  coins_earned: number;
}

export interface PurchaseResult {
  success: boolean;
  purchase_id?: string;
  remaining_coins?: number;
  error?: string;
}

class SecureGameBackendService {
  private readonly MAX_REQUESTS_PER_MINUTE = 30;

  // Complete a game session with enhanced security validation
  async completeGameSession(
    gameMode: GameMode,
    finalScore: number,
    levelReached: number,
    coinsEarned: number,
    sessionDuration?: number
  ): Promise<GameSessionResult | null> {
    try {
      // Rate limiting check
      if (!InputValidation.checkRateLimit('game_session', this.MAX_REQUESTS_PER_MINUTE, 60000)) {
        throw new Error('Rate limit exceeded');
      }

      // Validate session data
      if (!InputValidation.validateGameSession({
        score: finalScore,
        level: levelReached,
        coins: coinsEarned,
        duration: sessionDuration
      })) {
        throw new Error('Invalid game session data');
      }

      // Validate user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User must be authenticated');
      }

      // Use the secure database function that includes server-side validation
      const { data, error } = await supabase.rpc('complete_game_session', {
        p_game_mode: gameMode,
        p_final_score: finalScore,
        p_level_reached: levelReached,
        p_coins_earned: coinsEarned,
        p_session_duration: sessionDuration || null
      });

      if (error) {
        console.error('Game session error:', error.message);
        
        // Log suspicious activity if validation fails
        if (error.message.includes('Invalid game session data')) {
          await this.logSuspiciousActivity('invalid_game_data', {
            score: finalScore,
            level: levelReached,
            coins: coinsEarned,
            duration: sessionDuration
          });
        }
        
        return null;
      }

      return data as unknown as GameSessionResult;
    } catch (error) {
      console.error('Error in completeGameSession:', error);
      return null;
    }
  }

  // Make a purchase with enhanced validation
  async makePurchase(
    itemType: ItemType,
    itemId: string,
    costCoins: number,
    piTransactionId?: string
  ): Promise<PurchaseResult> {
    try {
      // Rate limiting check
      if (!InputValidation.checkRateLimit('purchase', 10, 60000)) {
        return { success: false, error: 'Rate limit exceeded' };
      }

      // Validate user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      // Validate purchase data
      if (costCoins < 0 || costCoins > 10000) {
        await this.logSuspiciousActivity('invalid_purchase_amount', { costCoins, itemType, itemId });
        return { success: false, error: 'Invalid purchase amount' };
      }

      // Sanitize item ID
      const sanitizedItemId = InputValidation.sanitizeString(itemId, 50);
      if (!InputValidation.isValidUserInput(sanitizedItemId)) {
        return { success: false, error: 'Invalid item ID' };
      }

      // Use the secure database function
      const { data, error } = await supabase.rpc('make_purchase', {
        p_item_type: itemType,
        p_item_id: sanitizedItemId,
        p_cost_coins: costCoins,
        p_pi_transaction_id: piTransactionId
      });

      if (error) {
        console.error('Purchase error:', error.message);
        return { success: false, error: error.message };
      }

      return data as unknown as PurchaseResult;
    } catch (error) {
      console.error('Error in makePurchase:', error);
      return { success: false, error: 'Failed to process purchase' };
    }
  }

  // Get user profile securely
  async getUserProfile(): Promise<any> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('pi_user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  // Get leaderboard with rate limiting
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      // Rate limiting for leaderboard requests
      if (!InputValidation.checkRateLimit('leaderboard', 20, 60000)) {
        console.warn('Leaderboard rate limit exceeded');
        return [];
      }

      const sanitizedLimit = Math.min(Math.max(1, limit), 50); // Ensure limit is between 1-50

      const { data, error } = await supabase
        .from('user_scores')
        .select('pi_user_id, username, highest_score, total_games, updated_at')
        .order('highest_score', { ascending: false })
        .limit(sanitizedLimit);

      if (error) {
        console.error('Error fetching leaderboard:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      return [];
    }
  }

  // Log suspicious activity using analytics_events table
  private async logSuspiciousActivity(activityType: string, data: any): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('analytics_events').insert({
        pi_user_id: user?.id || null,
        event_type: `suspicious_${activityType}`,
        event_data: data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.warn('Failed to log suspicious activity:', error);
    }
  }

  // Validate Pi transaction ID format
  private isValidPiTransactionId(txId: string): boolean {
    // Pi transaction IDs typically follow a specific format
    const piTxPattern = /^[a-zA-Z0-9_-]{10,100}$/;
    return piTxPattern.test(txId);
  }
}

export const secureGameBackendService = new SecureGameBackendService();
