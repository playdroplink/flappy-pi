
// Pi SDK Loader
// Ensures the Pi SDK is loaded properly before use

export const loadPiSdk = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if SDK is already loaded
    if (window.Pi) {
      console.log('Pi SDK already loaded');
      resolve(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    script.onload = () => {
      console.log('Pi SDK loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Pi SDK');
      resolve(false);
    };
    
    // Add to document
    document.head.appendChild(script);
  });
};
