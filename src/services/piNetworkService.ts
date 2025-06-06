
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
    piAccessToken?: string;
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

  private onIncompletePaymentFound = (payment: PiPayment): void => {
    console.log('Incomplete payment found:', payment);
    const paymentId = payment.identifier;
    const txid = payment.transaction?.txid;

    // Handle incomplete payment - try to complete it
    if (txid) {
      this.completePayment(paymentId, txid);
    } else {
      // Cancel incomplete payment if no transaction ID
      console.log('Cancelling incomplete payment without txid:', paymentId);
    }
  };

  async authenticate(): Promise<PiUser | null> {
    try {
      await this.initialize();
      
      this.currentUser = await window.Pi!.authenticate([
        'payments',
        'username'
      ], this.onIncompletePaymentFound);

      // Store access token globally for backend calls
      if (this.currentUser?.accessToken) {
        window.piAccessToken = this.currentUser.accessToken;
      }

      console.log('Pi user authenticated:', this.currentUser);
      return this.currentUser;
    } catch (error) {
      console.error('Pi authentication failed:', error);
      return null;
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

      const paymentCallbacks = {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('Payment ready for server approval:', paymentId);
          this.approvePayment(paymentId)
            .then(() => {
              console.log('Payment approved successfully:', paymentId);
            })
            .catch((error) => {
              console.error('Payment approval failed:', error);
              reject(error);
            });
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log('Payment ready for server completion:', paymentId, txid);
          this.completePayment(paymentId, txid)
            .then(() => {
              console.log('Payment completed successfully:', paymentId);
              resolve(paymentId);
            })
            .catch((error) => {
              console.error('Payment completion failed:', error);
              reject(error);
            });
        },
        onCancel: (paymentId: string) => {
          console.log('Payment cancelled by user:', paymentId);
          reject(new Error('Payment cancelled by user'));
        },
        onError: (error: Error, payment?: PiPayment) => {
          console.error('Payment error:', error, payment);
          reject(error);
        }
      };

      window.Pi.createPayment(paymentData, paymentCallbacks);
    });
  }

  private async approvePayment(paymentId: string): Promise<void> {
    try {
      // In a real implementation, this would call your backend
      // For demo purposes, we'll simulate the approval
      console.log('Simulating payment approval for:', paymentId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, you would make this call:
      /*
      const response = await fetch('/api/payments/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.piAccessToken}`
        },
        body: JSON.stringify({ paymentId })
      });
      
      if (!response.ok) {
        throw new Error('Payment approval failed');
      }
      */
      
      console.log('Payment approval simulated successfully');
    } catch (error) {
      console.error('Payment approval error:', error);
      throw error;
    }
  }

  private async completePayment(paymentId: string, txid: string): Promise<void> {
    try {
      // In a real implementation, this would call your backend
      // For demo purposes, we'll simulate the completion
      console.log('Simulating payment completion for:', paymentId, txid);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, you would make this call:
      /*
      const response = await fetch('/api/payments/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.piAccessToken}`
        },
        body: JSON.stringify({ paymentId, txid })
      });
      
      if (!response.ok) {
        throw new Error('Payment completion failed');
      }
      */
      
      console.log('Payment completion simulated successfully');
    } catch (error) {
      console.error('Payment completion error:', error);
      throw error;
    }
  }

  // Convenience methods for common Flappy Pi purchases
  async purchasePremiumSubscription(): Promise<string> {
    return this.createPayment(15, "Unlock Pi Premium", { type: "subscription" });
  }

  async purchaseBirdSkin(skinId: string, skinName: string): Promise<string> {
    return this.createPayment(2, `Unlock ${skinName} Bird Skin`, { 
      type: "skin", 
      itemId: skinId 
    });
  }

  async purchaseAdRemoval(): Promise<string> {
    return this.createPayment(5, "Remove All Ads Forever", { type: "no-ads" });
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
