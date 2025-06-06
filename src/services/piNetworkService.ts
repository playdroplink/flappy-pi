
interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
}

interface PiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: object;
  from_address: string;
  to_address: string;
  direction: string;
  created_at: string;
  network: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox: boolean }) => Promise<void>;
      authenticate: (scopes: string[], onIncompletePaymentFound?: (payment: PiPayment) => void) => Promise<PiUser>;
      createPayment: (paymentData: {
        amount: number;
        memo: string;
        metadata: object;
      }, callbacks: {
        onReadyForServerApproval: (paymentId: string) => void;
        onReadyForServerCompletion: (paymentId: string, txid: string) => void;
        onCancel: (paymentId: string) => void;
        onError: (error: Error, payment?: PiPayment) => void;
      }) => void;
      openShareDialog: (title: string, message: string) => void;
    };
  }
}

import { loadPiSdk } from './piSdkLoader';

class PiNetworkService {
  private isInitialized = false;
  private currentUser: PiUser | null = null;
  private readonly APP_ID = 'flappypi';
  private readonly SANDBOX = true; // Change to false for production
  private paymentCallbacks: Map<string, Function> = new Map();

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load Pi SDK if not loaded
      const sdkLoaded = await loadPiSdk();
      if (!sdkLoaded) {
        throw new Error('Pi SDK failed to load');
      }

      // Check if Pi SDK is loaded
      if (!window.Pi) {
        console.error('Pi SDK not loaded. Make sure to include the Pi SDK script.');
        throw new Error('Pi SDK not available');
      }

      await window.Pi.init({ 
        version: "2.0", 
        sandbox: this.SANDBOX 
      });
      
      this.isInitialized = true;
      console.log('Pi Network SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Pi SDK:', error);
      throw error;
    }
  }

  async authenticate(): Promise<PiUser | null> {
    try {
      await this.initialize();
      
      this.currentUser = await window.Pi!.authenticate([
        'payments',
        'username'
      ], (payment) => {
        console.log('Incomplete payment found:', payment);
        // Handle incomplete payment
        this.handleIncompletePayment(payment);
      });

      console.log('Pi user authenticated:', this.currentUser);
      return this.currentUser;
    } catch (error) {
      console.error('Pi authentication failed:', error);
      return null;
    }
  }

  private handleIncompletePayment(payment: PiPayment): void {
    // Get the callback for this payment if it exists
    const callback = this.paymentCallbacks.get(payment.identifier);
    if (callback) {
      callback(payment);
      this.paymentCallbacks.delete(payment.identifier);
    } else {
      console.log('No callback found for incomplete payment:', payment.identifier);
    }
  }

  async createPayment(amount: number, memo: string, metadata: any = {}): Promise<string> {
    if (!this.currentUser) {
      const user = await this.authenticate();
      if (!user) {
        throw new Error('User not authenticated');
      }
    }

    return new Promise((resolve, reject) => {
      if (!window.Pi) {
        reject(new Error('Pi SDK not available'));
        return;
      }

      const paymentData = {
        amount,
        memo,
        metadata: {
          ...metadata,
          app_id: this.APP_ID,
          user_id: this.currentUser?.uid || 'guest',
          timestamp: Date.now()
        }
      };

      console.log('Creating payment with data:', paymentData);

      window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('Payment ready for server approval:', paymentId);
          // In a real app, you would call your backend to approve the payment
          // For now, we'll just resolve the promise with the payment ID
          resolve(paymentId);
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log('Payment ready for server completion:', paymentId, txid);
          // This will be handled by the backend in a real implementation
        },
        onCancel: (paymentId: string) => {
          console.log('Payment cancelled by user:', paymentId);
          reject(new Error('Payment cancelled by user'));
        },
        onError: (error: Error, payment?: PiPayment) => {
          console.error('Payment error:', error, payment);
          reject(error);
        }
      });
    });
  }

  // Register a callback for a specific payment
  registerPaymentCallback(paymentId: string, callback: Function): void {
    this.paymentCallbacks.set(paymentId, callback);
  }

  shareScore(score: number, level: number): void {
    try {
      if (!window.Pi) {
        throw new Error('Pi SDK not available');
      }

      const title = "Check out my Flappy Pi score!";
      const message = `I just scored ${score} points and reached level ${level} in Flappy Pi! 🐦 Can you beat my score? Play now on Pi Network!`;
      
      if (window.Pi?.openShareDialog) {
        window.Pi.openShareDialog(title, message);
      } else {
        // Fallback to native sharing
        if (navigator.share) {
          navigator.share({ title, text: message });
        } else {
          // Copy to clipboard as fallback
          navigator.clipboard.writeText(`${title} ${message}`);
          console.log('Score shared to clipboard');
        }
      }
    } catch (error) {
      console.error('Failed to share score:', error);
    }
  }

  getCurrentUser(): PiUser | null {
    return this.currentUser;
  }

  isUserAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const piNetworkService = new PiNetworkService();
export type { PiUser, PiPayment };
