export interface ErrorLogEntry {
  timestamp: Date;
  error: Error;
  context?: string;
  userAgent: string;
  url: string;
  userId?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: ErrorLogEntry[] = [];

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  logError(error: Error, context?: string, userId?: string): void {
    const entry: ErrorLogEntry = {
      timestamp: new Date(),
      error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId
    };

    this.errors.push(entry);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 Error logged:', entry);
    }

    // In production, send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(entry);
    }

    // Keep only last 50 errors in memory
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }
  }

  private sendToMonitoring(entry: ErrorLogEntry): void {
    // In a real production app, you'd send this to services like:
    // - Sentry
    // - LogRocket
    // - Bugsnag
    // - Your own logging endpoint
    
    try {
      // Example endpoint call (uncomment when you have a real endpoint)
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: entry.error.message,
      //     stack: entry.error.stack,
      //     context: entry.context,
      //     timestamp: entry.timestamp.toISOString(),
      //     userAgent: entry.userAgent,
      //     url: entry.url,
      //     userId: entry.userId
      //   })
      // });
    } catch (sendError) {
      console.warn('Failed to send error to monitoring service:', sendError);
    }
  }

  getRecentErrors(): ErrorLogEntry[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const errorLogger = ErrorLogger.getInstance();

// Global error handlers for production
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorLogger.logError(
      new Error(event.message),
      `Global error at ${event.filename}:${event.lineno}:${event.colno}`
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.logError(
      new Error(event.reason || 'Unhandled promise rejection'),
      'Unhandled promise rejection'
    );
  });
}
