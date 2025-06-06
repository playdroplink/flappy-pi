
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Pi Network SDK types
interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
}

interface PiAuthContextType {
  user: PiUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export const usePiAuth = () => {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error('usePiAuth must be used within a PiAuthProvider');
  }
  return context;
};

interface PiAuthProviderProps {
  children: ReactNode;
}

export const PiAuthProvider = ({ children }: PiAuthProviderProps) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Pi SDK
    const initializePi = async () => {
      try {
        // Check if Pi SDK is available
        if (typeof window !== 'undefined' && window.Pi) {
          await window.Pi.init({
            version: "2.0",
            sandbox: true // Set to false for production
          });
          
          // Check if user is already authenticated
          const auth = await window.Pi.authenticate([], (user: PiUser) => {
            setUser(user);
            localStorage.setItem('pi-user', JSON.stringify(user));
          });
          
          if (auth) {
            setUser(auth.user);
            localStorage.setItem('pi-user', JSON.stringify(auth.user));
          }
        } else {
          // Fallback: check for stored user
          const storedUser = localStorage.getItem('pi-user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Pi SDK initialization error:', error);
        toast({
          title: "Pi Network Error",
          description: "Failed to initialize Pi Network SDK",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializePi();
  }, [toast]);

  const signIn = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && window.Pi) {
        const auth = await window.Pi.authenticate(["username", "payments"], (user: PiUser) => {
          setUser(user);
          localStorage.setItem('pi-user', JSON.stringify(user));
          toast({
            title: "Welcome to Flappy Pi! 🚀",
            description: `Signed in as ${user.username}`
          });
        });
        
        if (auth) {
          setUser(auth.user);
          localStorage.setItem('pi-user', JSON.stringify(auth.user));
        }
      } else {
        throw new Error('Pi Network SDK not available');
      }
    } catch (error: any) {
      console.error('Pi sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: error.message || "Failed to sign in with Pi Network",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('pi-user');
      
      toast({
        title: "Signed Out",
        description: "See you next time! 👋"
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut
  };

  return (
    <PiAuthContext.Provider value={value}>
      {children}
    </PiAuthContext.Provider>
  );
};

// Extend Window interface for Pi SDK
declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox: boolean }) => Promise<void>;
      authenticate: (scopes: string[], onIncompletePaymentFound?: (user: PiUser) => void) => Promise<{ user: PiUser; accessToken: string } | null>;
    };
  }
}
