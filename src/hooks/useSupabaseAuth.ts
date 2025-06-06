
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { piAuthService } from '@/services/piAuthService';
import { useToast } from '@/hooks/use-toast';

interface UseSupabaseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithPi: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

export const useSupabaseAuth = (): UseSupabaseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithPi = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await piAuthService.authenticateWithPi();
      
      if (result.success) {
        toast({
          title: "Pi Authentication Successful! 🎉",
          description: `Welcome ${result.user?.username}! You're now connected to Supabase.`
        });
        return true;
      } else {
        toast({
          title: "Authentication Failed",
          description: result.error || "Could not authenticate with Pi Network",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Pi sign in error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to connect to Pi Network",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await piAuthService.signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: "Failed to sign out properly",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signInWithPi,
    signOut
  };
};
