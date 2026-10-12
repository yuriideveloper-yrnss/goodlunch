import { SITE_URL } from '@/lib/site';

export function generateStructuredData(lang: string, dict: any) {
  const isPl = lang === 'pl';

  // 1. FoodEstablishment / Restaurant / DeliveryService / LocalBusiness Schema
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': ['FoodEstablishment', 'Restaurant', 'DeliveryService', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: 'GoodLunch – Jedzenie na dowóz & Catering Dietetyczny Wrocław',
    alternateName: [
      'GoodLunch Dieta Pudełkowa Wrocław',
      'GoodLunch Domowe Obiady z Dowozem',
      'GoodLunch Catering',
    ],
    url: `${SITE_URL}/${lang}`,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description: isPl
      ? 'Pyszne domowe jedzenie na dowóz, obiady z bezpłatną dostawą pod drzwi oraz tani catering dietetyczny we Wrocławiu. Pełnowartościowe posiłki na cały dzień, dzień próbny z rabatem 20% od 36 zł.'
      : 'Delicious home-cooked food delivery, daily lunches, and diet catering with free door-to-door delivery in Wroclaw. Full daily meals, trial day from 36 PLN.',
    telephone: '+48123456789',
    priceRange: '36 - 70 PLN',
    servesCuisine: ['Polska', 'Domowa', 'Europejska', 'Zdrowa żywność', 'Dietetyczna'],
    currenciesAccepted: 'PLN',
    paymentAccepted: 'Przelew, Karta płatnicza, BLIK, Mobilny Catering',
    knowsAbout: [
      'Jedzenie na dowóz Wrocław',
      'Dostawa jedzenia Wrocław',
      'Domowe obiady Wrocław dowóz',
      'Obiady z dowozem Wrocław',
      'Catering dietetyczny Wrocław',
      'Dieta pudełkowa Wrocław',
      'Polska kuchnia z dostawą Wrocław',
      'Tanie jedzenie z dowozem Wrocław',
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Wrocław',
        sameAs: 'https://pl.wikipedia.org/wiki/Wroc%C5%82aw',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Dolnośląskie',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Wrocław',
      addressRegion: 'Dolnośląskie',
      addressCountry: 'PL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '51.107883',
      longitude: '17.038538',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '22:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/goodlunch1/',
      'https://goodlunch-catering.mobilnycatering.pl/sklep',
    ],
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${lang}#cennik`,
        inLanguage: lang,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Oferta jedzenia na dowóz i cateringu GoodLunch Wrocław',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Zestaw 3 Posiłki – Domowe posiłki na dowóz',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'GoodLunch 3 Posiłki (1300-1900 kcal) – Domowe obiady na cały dzień',
                description: '3 zbilansowane domowe posiłki (śniadanie, obiad, kolacja) z bezpłatną dostawą pod drzwi we Wrocławiu.',
                image: `${SITE_URL}/logo.png`,
              },
              price: '36.00',
              priceCurrency: 'PLN',
              availability: 'https://schema.org/InStock',
              validFrom: '2026-01-01',
              priceValidUntil: '2027-12-31',
              url: `${SITE_URL}/${lang}#cennik`,
            },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Zestaw 4 Posiłki – Pełne wyżywienie na cały dzień',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'GoodLunch 4 Posiłki (1500-2500 kcal) – Pełny zestaw na cały dzień',
                description: '4 pełnowartościowe posiłki z zupą i daniem obiadowym z dostawą pod drzwi we Wrocławiu.',
                image: `${SITE_URL}/logo.png`,
              },
              price: '44.00',
              priceCurrency: 'PLN',
              availability: 'https://schema.org/InStock',
              validFrom: '2026-01-01',
              priceValidUntil: '2027-12-31',
              url: `${SITE_URL}/${lang}#cennik`,
            },
          ],
        },
      ],
    },
  };

  // 2. FAQPage Schema (enables Rich Snippets in Google & direct citations in AI models)
  const faqQuestions = [
    { q: dict.faq.q1, a: dict.faq.a1 },
    { q: dict.faq.q2, a: dict.faq.a2 },
    { q: dict.faq.q3, a: dict.faq.a3 },
    ...(dict.faq.q4 ? [{ q: dict.faq.q4, a: dict.faq.a4 }] : []),
    ...(dict.faq.q5 ? [{ q: dict.faq.q5, a: dict.faq.a5 }] : []),
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  // 3. WebSite with Sitelinks Search / Navigation
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'GoodLunch – Jedzenie na dowóz & Catering Dietetyczny Wrocław',
    description: dict.meta.desc,
    inLanguage: [
      'pl-PL',
      'uk-UA',
      'ru',
      'en',
    ],
  };

  return {
    businessSchema,
    faqSchema,
    websiteSchema,
  };
}
