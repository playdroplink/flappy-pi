
import { supabase } from '@/integrations/supabase/client';

// Audit logging service for security monitoring
export const AuditService = {
  // Log security-relevant events
  logSecurityEvent: async (
    eventType: 'login' | 'purchase' | 'score_submit' | 'suspicious_activity',
    details: Record<string, any> = {}
  ): Promise<void> => {
    try {
      // Only log in production or when specifically enabled
      if (process.env.NODE_ENV !== 'production') {
        return;
      }

      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          event_type: eventType,
          event_details: details,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: null // Will be populated server-side
        });

      if (error) {
        console.error('Audit logging failed:', error.message);
      }
    } catch (error) {
      console.error('Audit service error:', error);
    }
  },

  // Check for suspicious patterns
  checkSuspiciousActivity: (score: number, sessionDuration: number): boolean => {
    // Flag extremely high scores in short time
    if (score > 500 && sessionDuration < 60) {
      return true;
    }

    // Flag impossible score rates
    if (sessionDuration > 0 && (score / sessionDuration) > 10) {
      return true;
    }

    return false;
  }
};
