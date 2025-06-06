
import { useEffect } from 'react';
import { Analytics } from '@/services/analyticsService';

export const useAnalytics = () => {
  useEffect(() => {
    // Track page view when component mounts
    Analytics.pageViewed(window.location.pathname);
    
    // Check user retention
    Analytics.checkRetention();
  }, []);

  return Analytics;
};
