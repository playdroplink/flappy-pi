
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/gameTypes';

class UserProfileService {
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
  async upsertUserProfile(profile: UserProfile): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profile as any, {
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
}

export const userProfileService = new UserProfileService();
