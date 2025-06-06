import { supabase } from '@/integrations/supabase/client';
import { piNetworkService } from './piNetworkService';
import { Analytics } from '@/services/analyticsService';

interface PiAuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
  };
  error?: string;
}

class PiAuthService {
  async authenticateWithPi(): Promise<PiAuthResult> {
    try {
      // Step 1: Authenticate with Pi Network using proper Pi SDK flow
      const piUser = await piNetworkService.authenticate();
      
      if (!piUser) {
        return { success: false, error: 'Pi Network authentication failed' };
      }

      // Step 2: Send Pi user data to our backend for verification and Supabase authentication
      const response = await fetch(`https://fwfefplvruawsbspwpxh.supabase.co/functions/v1/pi-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZmVmcGx2cnVhd3Nic3B3cHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDYzMjgsImV4cCI6MjA2NDcyMjMyOH0.q2g4YZeUpmOOmK2LO7KKb-B8ZTpsoxJ9b1H_Wf11_LM`
        },
        body: JSON.stringify({
          accessToken: piUser.accessToken,
          piUserId: piUser.uid,
          username: piUser.username
        })
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'Authentication failed' };
      }

      // Step 3: Set the Supabase session with the tokens returned from backend
      if (result.access_token && result.refresh_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: result.access_token,
          refresh_token: result.refresh_token
        });

        if (sessionError) {
          console.error('Failed to set Supabase session:', sessionError);
          return { success: false, error: 'Failed to establish session' };
        }
      }

      // Track successful authentication
      Analytics.userSignedIn(piUser.uid, piUser.username);

      return {
        success: true,
        user: result.user
      };

    } catch (error) {
      console.error('Pi authentication error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  }

  async signOut(): Promise<void> {
    Analytics.userSignedOut();
    await supabase.auth.signOut();
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
}

export const piAuthService = new PiAuthService();
