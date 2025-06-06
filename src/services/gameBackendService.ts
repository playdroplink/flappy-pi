
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id?: string;
  pi_user_id: string;
  username: string;
  total_coins: number;
  selected_bird_skin: string;
  music_enabled: boolean;
  premium_expires_at?: string;
  ad_free_permanent?: boolean;
  owned_skins?: string[];
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  // New subscription fields
  subscription_status?: string;
  subscription_start?: string;
  subscription_end?: string;
  subscription_plan?: string;
}

export interface GameSession {
  pi_user_id: string;
  game_mode: 'classic' | 'endless' | 'challenge';
  final_score: number;
  level_reached: number;
  coins_earned: number;
  session_duration?: number;
}

export interface PurchaseItem {
  pi_user_id: string;
  item_type: 'bird_skin' | 'power_up' | 'life' | 'coins';
  item_id: string;
  cost_coins: number;
  pi_transaction_id?: string;
}

class GameBackendService {
  // Get user profile by Pi user ID
  async getUserProfile(piUserId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('pi_user_id', piUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - user doesn't exist yet
          return null;
        }
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  // Create or update user profile
  async upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profile, {
          onConflict: 'pi_user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in upsertUserProfile:', error);
      return null;
    }
  }

  // Complete a game session
  async completeGameSession(session: GameSession): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('complete_game_session_secure', {
        p_game_mode: session.game_mode,
        p_final_score: session.final_score,
        p_level_reached: session.level_reached,
        p_coins_earned: session.coins_earned,
        p_session_duration: session.session_duration
      });

      if (error) {
        console.error('Error completing game session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in completeGameSession:', error);
      return null;
    }
  }

  // Make a purchase
  async makePurchase(purchase: PurchaseItem): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('make_purchase_secure', {
        p_item_type: purchase.item_type,
        p_item_id: purchase.item_id,
        p_cost_coins: purchase.cost_coins,
        p_pi_transaction_id: purchase.pi_transaction_id
      });

      if (error) {
        console.error('Error making purchase:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in makePurchase:', error);
      return null;
    }
  }

  // Get user inventory
  async getUserInventory(piUserId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('pi_user_id', piUserId);

      if (error) {
        console.error('Error fetching user inventory:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserInventory:', error);
      return [];
    }
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_scores')
        .select('username, highest_score, total_games, updated_at')
        .order('highest_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      return [];
    }
  }
}

export const gameBackendService = new GameBackendService();
