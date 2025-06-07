
import { supabase } from '@/integrations/supabase/client';
import { InputValidation } from '@/utils/inputValidation';

class SecureAuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 900000; // 15 minutes

  // Secure Pi authentication with enhanced validation
  async authenticateWithPi(): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      // Check rate limiting
      if (!InputValidation.checkRateLimit('pi_auth', this.MAX_LOGIN_ATTEMPTS, this.LOCKOUT_DURATION)) {
        return { success: false, error: 'Too many authentication attempts. Please try again later.' };
      }

      // Check if Pi SDK is available
      if (typeof window === 'undefined' || !window.Pi) {
        return { success: false, error: 'Pi Network SDK not available' };
      }

      // Authenticate with Pi Network
      const scopes = ['username', 'payments', 'wallet_address'];
      const piAuth = await window.Pi.authenticate(scopes, (payment: any) => {
        console.log('Pi payment callback:', payment);
      });

      if (!piAuth || !piAuth.accessToken) {
        return { success: false, error: 'Pi authentication failed' };
      }

      // Sanitize user data
      const sanitizedUsername = InputValidation.sanitizeString(piAuth.user.username, 50);
      if (!InputValidation.isValidUserInput(sanitizedUsername)) {
        return { success: false, error: 'Invalid username format' };
      }

      // Authenticate with Supabase using Pi credentials
      const { data, error } = await supabase.functions.invoke('pi-auth', {
        body: {
          accessToken: piAuth.accessToken,
          piUserId: piAuth.user.uid,
          username: sanitizedUsername
        }
      });

      if (error) {
        console.error('Supabase auth error:', error);
        return { success: false, error: 'Authentication failed' };
      }

      if (data.success && data.access_token) {
        // Set the session with Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          return { success: false, error: 'Failed to establish session' };
        }

        // Log successful authentication
        this.logSecurityEvent('successful_login', {
          pi_user_id: piAuth.user.uid,
          username: sanitizedUsername
        });

        return { success: true, user: data.user };
      }

      return { success: false, error: data.error || 'Authentication failed' };
    } catch (error) {
      console.error('Pi authentication error:', error);
      this.logSecurityEvent('failed_login', { error: error instanceof Error ? error.message : 'Unknown error' });
      return { success: false, error: 'Authentication system error' };
    }
  }

  // Secure sign out with session cleanup
  async signOut(): Promise<void> {
    try {
      // Clear Pi SDK session if available
      if (typeof window !== 'undefined' && window.Pi) {
        try {
          await window.Pi.closeSession();
        } catch (piError) {
          console.warn('Pi closeSession error:', piError);
        }
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
      }

      // Clear local storage of sensitive data
      this.clearSensitiveLocalStorage();

      this.logSecurityEvent('logout', {});
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Clear sensitive data from local storage
  private clearSensitiveLocalStorage(): void {
    const sensitiveKeys = [
      'flappypi-profile',
      'flappypi-purchase-state',
      'supabase.auth.token'
    ];

    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Log security events
  private async logSecurityEvent(eventType: string, data: any): Promise<void> {
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_event_data: data
      });
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  }

  // Validate user session
  async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }

      // Check if session is expired
      const now = new Date().getTime();
      const expiresAt = new Date(session.expires_at || 0).getTime();
      
      if (now >= expiresAt) {
        await this.signOut();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }
}

export const secureAuthService = new SecureAuthService();
