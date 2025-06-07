
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

export interface DailyRewardResult {
  success: boolean;
  reward_amount?: number;
  current_day?: number;
  streak?: number;
  error?: string;
}

export interface DailyRewardStatus {
  reward_day: number;
  last_claimed_date: string | null;
  streak_count: number;
}

export interface AdRewardResult {
  success: boolean;
  reward_amount: number;
  description: string;
}

export const themes= {
  space:"space",
  night:"night",
  evening: "evening", 
  day: "day" ,
  sunset: "sunset"
}
export type Theme = keyof typeof themes;