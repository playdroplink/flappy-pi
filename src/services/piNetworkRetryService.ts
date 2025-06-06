
// Enhanced retry service for Pi Network API calls
class PiNetworkRetryService {
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000; // 1 second

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    retryCount = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(`${operationName} failed (attempt ${retryCount + 1}):`, error);
      
      if (retryCount >= this.maxRetries) {
        throw new Error(`${operationName} failed after ${this.maxRetries} attempts: ${error}`);
      }

      // Exponential backoff with jitter
      const delay = this.baseDelay * Math.pow(2, retryCount) + Math.random() * 1000;
      await this.delay(delay);
      
      return this.executeWithRetry(operation, operationName, retryCount + 1);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async retryPaymentApproval(paymentId: string): Promise<any> {
    return this.executeWithRetry(
      async () => {
        const response = await fetch('https://fwfefplvruawsbspwpxh.supabase.co/functions/v1/pi-approve-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentId })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      },
      `Payment approval for ${paymentId}`
    );
  }

  async retryPaymentCompletion(paymentId: string, txid: string, metadata?: any): Promise<any> {
    return this.executeWithRetry(
      async () => {
        const response = await fetch('https://fwfefplvruawsbspwpxh.supabase.co/functions/v1/pi-complete-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentId, txid, metadata })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      },
      `Payment completion for ${paymentId}`
    );
  }
}

export const piNetworkRetryService = new PiNetworkRetryService();
