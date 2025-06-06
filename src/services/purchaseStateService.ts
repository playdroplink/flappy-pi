
import { supabase } from '@/integrations/supabase/client';
import { gameBackendService } from './gameBackendService';

export interface PurchaseState {
  hasPremium: boolean;
  isAdFree: boolean;
  ownedSkins: string[];
  premiumExpiresAt: string | null;
}

export interface PurchaseUpdate {
  itemType: 'premium' | 'ad_free' | 'skin' | 'elite';
  itemId?: string;
  duration?: number; // in days for subscriptions
  permanent?: boolean;
}

class PurchaseStateService {
  private cachedState: PurchaseState | null = null;

  // Get current purchase state for user
  async getPurchaseState(piUserId: string): Promise<PurchaseState> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('premium_expires_at, ad_free_permanent, owned_skins')
        .eq('pi_user_id', piUserId)
        .single();

      if (error) {
        console.error('Error fetching purchase state:', error);
        return this.getDefaultState();
      }

      const now = new Date();
      const premiumExpiresAt = profile?.premium_expires_at ? new Date(profile.premium_expires_at) : null;
      const hasPremium = premiumExpiresAt ? premiumExpiresAt > now : false;

      const state: PurchaseState = {
        hasPremium,
        isAdFree: profile?.ad_free_permanent || hasPremium,
        ownedSkins: profile?.owned_skins || ['default'],
        premiumExpiresAt: profile?.premium_expires_at || null
      };

      this.cachedState = state;
      return state;
    } catch (error) {
      console.error('Error in getPurchaseState:', error);
      return this.getDefaultState();
    }
  }

  // Update purchase state after successful payment
  async updatePurchaseState(piUserId: string, purchase: PurchaseUpdate, piTransactionId?: string): Promise<boolean> {
    try {
      const updates: any = {};

      switch (purchase.itemType) {
        case 'premium':
        case 'elite':
          const duration = purchase.duration || 30;
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + duration);
          updates.premium_expires_at = expiresAt.toISOString();
          break;

        case 'ad_free':
          if (purchase.permanent) {
            updates.ad_free_permanent = true;
          } else {
            // If it's a temporary ad-free, extend premium instead
            const duration = purchase.duration || 30;
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + duration);
            updates.premium_expires_at = expiresAt.toISOString();
          }
          break;

        case 'skin':
          if (purchase.itemId) {
            // Add skin to owned_skins array
            const { data: currentProfile } = await supabase
              .from('user_profiles')
              .select('owned_skins')
              .eq('pi_user_id', piUserId)
              .single();

            const currentSkins = currentProfile?.owned_skins || ['default'];
            if (!currentSkins.includes(purchase.itemId)) {
              updates.owned_skins = [...currentSkins, purchase.itemId];
            }
          }
          break;
      }

      if (Object.keys(updates).length === 0) {
        console.warn('No updates to apply for purchase:', purchase);
        return false;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('pi_user_id', piUserId);

      if (error) {
        console.error('Error updating purchase state:', error);
        return false;
      }

      // Record the purchase in purchases table
      if (piTransactionId) {
        await gameBackendService.makePurchase(
          piUserId,
          purchase.itemType as any,
          purchase.itemId || purchase.itemType,
          0, // Pi payments don't cost coins
          piTransactionId
        );
      }

      // Clear cache to force refresh
      this.cachedState = null;
      
      console.log('Purchase state updated successfully:', { piUserId, purchase, updates });
      return true;
    } catch (error) {
      console.error('Error in updatePurchaseState:', error);
      return false;
    }
  }

  // Check if user owns a specific skin
  async userOwnsSkin(piUserId: string, skinId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('user_owns_skin', { user_id: piUserId, skin_id: skinId });

      if (error) {
        console.error('Error checking skin ownership:', error);
        return skinId === 'default'; // Default skin is always owned
      }

      return data || skinId === 'default';
    } catch (error) {
      console.error('Error in userOwnsSkin:', error);
      return skinId === 'default';
    }
  }

  // Check if user has active premium
  async userHasActivePremium(piUserId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('user_has_active_premium', { user_id: piUserId });

      if (error) {
        console.error('Error checking premium status:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error in userHasActivePremium:', error);
      return false;
    }
  }

  // Get cached state or fetch if not available
  async getCachedState(piUserId: string): Promise<PurchaseState> {
    if (this.cachedState) {
      return this.cachedState;
    }
    return this.getPurchaseState(piUserId);
  }

  // Clear cache (useful for logout or refresh)
  clearCache(): void {
    this.cachedState = null;
  }

  private getDefaultState(): PurchaseState {
    return {
      hasPremium: false,
      isAdFree: false,
      ownedSkins: ['default'],
      premiumExpiresAt: null
    };
  }
}

export const purchaseStateService = new PurchaseStateService();
