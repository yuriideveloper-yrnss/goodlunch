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
    
    // Cookie getter helper
    const getCookie = (name: string): string => {
      const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : '';
    };

    const getVal = (key: string): string => {
      return urlParams.get(key) || localStorage.getItem('gl_' + key) || getCookie('gl_' + key) || '';
    };

    const attr: Record<string, string> = {};
    const keys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'fbclid',
      'gclid',
      'ttclid',
      'landing_page',
      'referrer',
      'traffic_source',
      'traffic_type'
    ];

    keys.forEach(k => {
      const v = getVal(k);
      if (v) attr[k] = v;
    });

    // Fallbacks if not already cached
    if (!attr.landing_page && typeof window !== 'undefined') {
      attr.landing_page = window.location.pathname + window.location.search;
    }

    if (!attr.referrer && typeof document !== 'undefined' && document.referrer) {
      try {
        const curHost = window.location.hostname;
        const refHost = new URL(document.referrer).hostname;
        if (refHost && refHost !== curHost) {
          attr.referrer = document.referrer;
        }
      } catch {
        attr.referrer = document.referrer;
      }
    }

    // Determine traffic source and type dynamically if missing
    if (!attr.traffic_source) {
      const utmSource = attr.utm_source;
      const fbclid = attr.fbclid;
      const gclid = attr.gclid;
      const refVal = attr.referrer || (typeof document !== 'undefined' ? document.referrer : '');

      if (utmSource) {
        attr.traffic_source = utmSource;
        attr.traffic_type = 'Рекламная кампания (UTM)';
      } else if (fbclid) {
        attr.traffic_source = 'Meta Ads (Facebook / Instagram)';
        attr.traffic_type = 'Платный трафик (Meta)';
      } else if (gclid) {
        attr.traffic_source = 'Google Ads';
        attr.traffic_type = 'Платный трафик (Google)';
      } else if (refVal) {
        const lowerRef = refVal.toLowerCase();
        if (lowerRef.includes('google.')) {
          attr.traffic_source = 'Google Search (Органика / SEO)';
          attr.traffic_type = 'Органика (SEO / Поиск)';
        } else if (lowerRef.includes('instagram.com')) {
          attr.traffic_source = 'Instagram (Органика / Bio / Stories)';
          attr.traffic_type = 'Органика (Соцсети)';
        } else if (lowerRef.includes('facebook.com') || lowerRef.includes('fb.com')) {
          attr.traffic_source = 'Facebook (Органика / Пост)';
          attr.traffic_type = 'Органика (Соцсети)';
        } else if (lowerRef.includes('t.me') || lowerRef.includes('telegram')) {
          attr.traffic_source = 'Telegram (Ссылка / Чат)';
          attr.traffic_type = 'Мессенджер (Telegram)';
        } else if (lowerRef.includes('tiktok.com')) {
          attr.traffic_source = 'TikTok (Органика)';
          attr.traffic_type = 'Органика (Соцсети)';
        } else if (lowerRef.includes('bing.com')) {
          attr.traffic_source = 'Bing Search (Органика)';
          attr.traffic_type = 'Органика (SEO / Поиск)';
        } else {
          try {
            attr.traffic_source = new URL(refVal).hostname;
            attr.traffic_type = 'Реферер (Сайт)';
          } catch {
            attr.traffic_source = refVal;
            attr.traffic_type = 'Реферер';
          }
        }
      } else {
        attr.traffic_source = 'Прямой заход (Direct / Ввод URL / Закладки)';
        attr.traffic_type = 'Прямой заход (Direct)';
      }
    }

    return attr;
  } catch {
    return {};
  }
};
