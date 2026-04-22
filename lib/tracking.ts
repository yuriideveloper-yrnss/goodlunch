/**
 * Utility for tracking events across different platforms (GA4, Google Ads, Meta Pixel)
 */

export const trackEvent = (eventName: string, params?: any) => {
  if (typeof window === 'undefined') return;

  // Google Analytics / Google Ads
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  // Meta (Facebook) Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
};

export const trackLead = (params?: any) => {
  if (typeof window === 'undefined') return;

  // Google Analytics / Ads
  if ((window as any).gtag) {
    // Specifically for Google Ads conversion tracking if needed
    // gtag('event', 'conversion', {'send_to': 'AW-18066459268/xxxxxx'});
    (window as any).gtag('event', 'generate_lead', params);
  }

  // Meta Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Lead', params);
  }
};

export const trackPurchase = (value: number, currency: string = 'PLN', params?: any) => {
  if (typeof window === 'undefined') return;

  const purchaseParams = {
    value,
    currency,
    ...params
  };

  // Google Analytics / Ads
  if ((window as any).gtag) {
    (window as any).gtag('event', 'purchase', purchaseParams);
  }

  // Meta Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Purchase', purchaseParams);
  }
};
