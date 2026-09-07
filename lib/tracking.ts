/**
 * Utility for tracking events across different platforms (GA4, Google Ads, Meta Pixel)
 */

const STANDARD_META_EVENTS = new Set([
  'PageView',
  'Lead',
  'InitiateCheckout',
  'Purchase',
  'AddToCart',
  'AddToWishlist',
  'CompleteRegistration',
  'Contact',
  'CustomizeProduct',
  'Donate',
  'FindLocation',
  'Schedule',
  'Search',
  'StartTrial',
  'SubmitApplication',
  'Subscribe',
  'ViewContent'
]);

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
    if (STANDARD_META_EVENTS.has(eventName)) {
      (window as any).fbq('track', eventName, params);
    } else {
      (window as any).fbq('trackCustom', eventName, params);
    }
  }

  // TikTok Pixel
  if ((window as any).ttq) {
    (window as any).ttq.track(eventName, params);
  }
};

export const trackLead = (params?: any) => {
  if (typeof window === 'undefined') return;

  const leadParams = {
    content_name: params?.content_name || (params?.event_label === 'meals4' ? '4 Posiłki' : '3 Posiłki'),
    currency: params?.currency || 'PLN',
    value: params?.value || 0,
    ...params
  };

  // Push to Google Tag Manager
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: 'generate_lead',
    ...leadParams
  });

  // Google Analytics / Ads
  if ((window as any).gtag) {
    (window as any).gtag('event', 'generate_lead', leadParams);
  }

  // Meta Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Lead', leadParams);
  }

  // TikTok Pixel
  if ((window as any).ttq) {
    (window as any).ttq.track('SubmitForm', leadParams);
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

export const getStoredAttribution = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const getVal = (key: string) => urlParams.get(key) || localStorage.getItem('gl_' + key) || '';
    const attr: Record<string, string> = {};
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
    keys.forEach(k => {
      const v = getVal(k);
      if (v) attr[k] = v;
    });
    return attr;
  } catch {
    return {};
  }
};
