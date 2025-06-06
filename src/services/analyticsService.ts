
interface UserTraits {
  piUserId?: string;
  username?: string;
  country?: string;
  device?: string;
  browser?: string;
  subscriptionStatus?: string;
}

interface EventProperties {
  [key: string]: any;
}

interface AnalyticsEvent {
  eventName: string;
  properties?: EventProperties;
  timestamp?: string;
  userId?: string;
  sessionId?: string;
}

class AnalyticsService {
  private sessionId: string;
  private userId: string | null = null;
  private userTraits: UserTraits = {};

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): void {
    // Track basic device and browser info
    this.userTraits.device = this.getDeviceType();
    this.userTraits.browser = this.getBrowserInfo();
    
    // Get geolocation if available
    this.getGeolocation();
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private async getGeolocation(): Promise<void> {
    try {
      // Use IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_name) {
        this.userTraits.country = data.country_name;
      }
    } catch (error) {
      console.log('Could not determine user location');
    }
  }

  // Identify user after Pi authentication
  identify(userId: string, traits: UserTraits = {}): void {
    this.userId = userId;
    this.userTraits = { ...this.userTraits, ...traits };

    // Send to analytics platforms
    this.sendToGoogleAnalytics('identify', { userId, traits });
    this.logToBackend('user_identified', { userId, traits });
  }

  // Track events
  track(eventName: string, properties: EventProperties = {}): void {
    const event: AnalyticsEvent = {
      eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        device: this.userTraits.device,
        browser: this.userTraits.browser,
        country: this.userTraits.country,
        timestamp: new Date().toISOString()
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    };

    // Send to multiple analytics platforms
    this.sendToGoogleAnalytics('event', event);
    this.logToBackend('event_tracked', event);

    console.log('Analytics Event:', event);
  }

  // Track page views
  page(pageName: string, properties: EventProperties = {}): void {
    this.track('page_viewed', {
      page: pageName,
      url: window.location.href,
      ...properties
    });
  }

  // Send to Google Analytics (GA4)
  private sendToGoogleAnalytics(type: string, data: any): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      if (type === 'event') {
        (window as any).gtag('event', data.eventName, {
          event_category: data.properties?.category || 'User Action',
          event_label: data.properties?.label,
          value: data.properties?.value,
          custom_parameters: data.properties
        });
      } else if (type === 'identify') {
        (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
          user_id: data.userId,
          custom_map: data.traits
        });
      }
    }
  }

  // Log events to backend for custom analytics
  private async logToBackend(eventType: string, data: any): Promise<void> {
    try {
      const response = await fetch('https://fwfefplvruawsbspwpxh.supabase.co/functions/v1/analytics-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          url: window.location.href
        })
      });

      if (!response.ok) {
        console.warn('Failed to log analytics event to backend');
      }
    } catch (error) {
      console.warn('Analytics backend logging failed:', error);
    }
  }

  // Track user retention
  trackRetention(): void {
    const lastVisit = localStorage.getItem('flappypi-last-visit');
    const currentVisit = Date.now();
    
    if (lastVisit) {
      const daysSinceLastVisit = Math.floor((currentVisit - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
      this.track('user_return', { days_since_last_visit: daysSinceLastVisit });
    } else {
      this.track('user_first_visit');
    }
    
    localStorage.setItem('flappypi-last-visit', currentVisit.toString());
  }

  // Track conversion events
  trackConversion(conversionType: string, value?: number, currency?: string): void {
    this.track('conversion', {
      conversion_type: conversionType,
      value,
      currency: currency || 'Pi',
      timestamp: new Date().toISOString()
    });
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Helper functions for common events
export const Analytics = {
  // User authentication events
  userSignedIn: (userId: string, username: string) => {
    analyticsService.identify(userId, { piUserId: userId, username });
    analyticsService.track('user_signed_in', { method: 'pi_network' });
  },

  userSignedOut: () => {
    analyticsService.track('user_signed_out');
  },

  // Game events
  gameStarted: (gameMode: string) => {
    analyticsService.track('game_started', { game_mode: gameMode });
  },

  gameCompleted: (score: number, level: number, gameMode: string, duration: number) => {
    analyticsService.track('game_completed', {
      score,
      level,
      game_mode: gameMode,
      duration_seconds: duration,
      score_per_second: duration > 0 ? score / duration : 0
    });
  },

  // Payment events
  paymentInitiated: (amount: number, itemType: string, itemId: string) => {
    analyticsService.track('payment_initiated', {
      amount,
      item_type: itemType,
      item_id: itemId,
      currency: 'Pi'
    });
  },

  paymentCompleted: (amount: number, itemType: string, itemId: string, paymentId: string) => {
    analyticsService.track('payment_completed', {
      amount,
      item_type: itemType,
      item_id: itemId,
      payment_id: paymentId,
      currency: 'Pi'
    });
    analyticsService.trackConversion('purchase', amount, 'Pi');
  },

  paymentFailed: (amount: number, itemType: string, error: string) => {
    analyticsService.track('payment_failed', {
      amount,
      item_type: itemType,
      error,
      currency: 'Pi'
    });
  },

  // Shop events
  shopViewed: () => {
    analyticsService.track('shop_viewed');
  },

  itemViewed: (itemType: string, itemId: string, price: number) => {
    analyticsService.track('item_viewed', {
      item_type: itemType,
      item_id: itemId,
      price
    });
  },

  // Page tracking
  pageViewed: (pageName: string) => {
    analyticsService.page(pageName);
  },

  // Retention tracking
  checkRetention: () => {
    analyticsService.trackRetention();
  }
};
