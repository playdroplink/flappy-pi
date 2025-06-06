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

import { loadPiSdk, detectEnvironment } from './piSdkLoader';
import { purchaseStateService, PurchaseUpdate } from './purchaseStateService';

class PiNetworkService {
  private isInitialized = false;
  private currentUser: PiUser | null = null;
  private readonly APP_ID = 'flappypi';
  private readonly environment = detectEnvironment();
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

      // Initialize with auto-detected environment
      await window.Pi.init({ 
        version: "2.0", 
        sandbox: this.environment.sandbox 
      });
      
      this.isInitialized = true;
      console.log(`Pi Network SDK initialized successfully in ${this.environment.isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode (sandbox: ${this.environment.sandbox})`);
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
          timestamp: Date.now(),
          environment: this.environment.isDevelopment ? 'development' : 'production'
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
          this.completePayment(paymentId, txid, paymentData.metadata)
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
      console.log('Calling approve payment endpoint for:', paymentId);
      
      const response = await fetch('https://fwfefplvruawsbspwpxh.supabase.co/functions/v1/pi-approve-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`Payment approval failed: ${result.error}`);
      }
      
      console.log('Payment approval successful:', result);
    } catch (error) {
      console.error('Payment approval error:', error);
      throw error;
    }
  }

  private async completePayment(paymentId: string, txid: string, metadata?: any): Promise<void> {
    try {
      console.log('Calling complete payment endpoint for:', paymentId, txid);
      
      const response = await fetch('https://fwfefplvruawsbspwpxh.supabase.co/functions/v1/pi-complete-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId, txid, metadata })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`Payment completion failed: ${result.error}`);
      }
      
      // Update purchase state in Supabase after successful payment
      if (this.currentUser && metadata) {
        await this.updatePurchaseStateFromMetadata(metadata, txid);
      }
      
      console.log('Payment completion successful:', result);
    } catch (error) {
      console.error('Payment completion error:', error);
      throw error;
    }
  }

  private async updatePurchaseStateFromMetadata(metadata: any, txid: string): Promise<void> {
    if (!this.currentUser) return;

    try {
      const purchaseUpdate: PurchaseUpdate = this.determinePurchaseType(metadata);
      await purchaseStateService.updatePurchaseState(
        this.currentUser.uid,
        purchaseUpdate,
        txid
      );
    } catch (error) {
      console.error('Error updating purchase state:', error);
    }
  }

  private determinePurchaseType(metadata: any): PurchaseUpdate {
    const type = metadata.type;
    
    switch (type) {
      case 'subscription':
        return { itemType: 'premium', duration: 30 };
      case 'elite':
        return { itemType: 'elite', duration: 30 };
      case 'no-ads':
        return { itemType: 'ad_free', permanent: true };
      case 'skin':
        return { itemType: 'skin', itemId: metadata.itemId };
      case 'all-skins':
        return { itemType: 'premium', duration: 30 }; // All skins access via premium
      default:
        console.warn('Unknown purchase type:', type);
        return { itemType: 'premium', duration: 30 };
    }
  }

  // Enhanced convenience methods with purchase state integration
  async purchasePremiumSubscription(): Promise<string> {
    const paymentId = await this.createPayment(15, "Unlock Pi Premium", { type: "subscription" });
    return paymentId;
  }

  async purchaseEliteSubscription(): Promise<string> {
    const paymentId = await this.createPayment(20, "Unlock Elite Pack", { type: "elite" });
    return paymentId;
  }

  async purchaseBirdSkin(skinId: string, skinName: string): Promise<string> {
    const paymentId = await this.createPayment(2, `Unlock ${skinName} Bird Skin`, { 
      type: "skin", 
      itemId: skinId 
    });
    return paymentId;
  }

  async purchaseAdRemoval(): Promise<string> {
    const paymentId = await this.createPayment(10, "Remove All Ads Forever", { type: "no-ads" });
    return paymentId;
  }

  async purchaseAllSkins(): Promise<string> {
    const paymentId = await this.createPayment(15, "Unlock All Standard Skins", { type: "all-skins" });
    return paymentId;
  }

  // Get user's purchase state
  async getUserPurchaseState() {
    if (!this.currentUser) return null;
    return purchaseStateService.getCachedState(this.currentUser.uid);
  }

  // Check specific ownership
  async userOwnsSkin(skinId: string): Promise<boolean> {
    if (!this.currentUser) return skinId === 'default';
    return purchaseStateService.userOwnsSkin(this.currentUser.uid, skinId);
  }

  async userHasPremium(): Promise<boolean> {
    if (!this.currentUser) return false;
    return purchaseStateService.userHasActivePremium(this.currentUser.uid);
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

  getEnvironment() {
    return this.environment;
  }
}

export const piNetworkService = new PiNetworkService();
export type { PiUser, PiPayment };
