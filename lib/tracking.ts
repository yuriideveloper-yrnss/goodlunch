/**
 * Utility for tracking events across different platforms (GA4, Google Ads, Meta Pixel)
 */

export const trackEvent = (eventName: string, params?: any) => {
  if (typeof window === 'undefined') return;

  // Push to Google Tag Manager
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: eventName,
    ...params
  });

  // Google Analytics / Google Ads
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  // Meta (Facebook) Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }

  // TikTok Pixel
  if ((window as any).ttq) {
    (window as any).ttq.track(eventName, params);
  }
};

export const trackLead = (params?: any) => {
  if (typeof window === 'undefined') return;

  // Push to Google Tag Manager
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: 'generate_lead',
    ...params
  });

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

  // TikTok Pixel
  if ((window as any).ttq) {
    (window as any).ttq.track('SubmitForm', params);
  }
};

export const trackPurchase = (value: number, currency: string = 'PLN', params?: any) => {
  if (typeof window === 'undefined') return;

  const purchaseParams = {
    value,
    currency,
    ...params
  };

  // Push to Google Tag Manager
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: 'purchase',
    ...purchaseParams
  });

  // Google Analytics / Ads
  if ((window as any).gtag) {
    (window as any).gtag('event', 'purchase', purchaseParams);
  }

  // Meta Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Purchase', purchaseParams);
  }

  // TikTok Pixel
  if ((window as any).ttq) {
    (window as any).ttq.track('CompletePayment', purchaseParams);
  }
};
