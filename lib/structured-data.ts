import { SITE_URL } from '@/lib/site';

export function generateStructuredData(lang: string, dict: any) {
  const isPl = lang === 'pl';

  // 1. FoodEstablishment / LocalBusiness Schema
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': ['FoodEstablishment', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: 'GoodLunch – Catering Dietetyczny Wrocław',
    alternateName: 'GoodLunch Dieta Pudełkowa',
    url: `${SITE_URL}/${lang}`,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description: isPl
      ? 'Catering dietetyczny i smaczna dieta pudełkowa z dostawą pod drzwi we Wrocławiu. Pełnowartościowe posiłki, dzień próbny z rabatem 20% od 36 zł.'
      : 'Healthy home meal prep and diet catering delivered to your door in Wroclaw. Full daily meals, trial day from 36 PLN.',
    telephone: '+48123456789',
    priceRange: '36 - 70 PLN',
    servesCuisine: ['Polska', 'Europejska', 'Zdrowa żywność', 'Dietetyczna'],
    currenciesAccepted: 'PLN',
    paymentAccepted: 'Przelew, Karta płatnicza, BLIK, Mobilny Catering',
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
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Pakiety cateringu dietetycznego GoodLunch',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Zestaw 3 Posiłki',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'GoodLunch 3 Posiłki (1300-1900 kcal) – Dzień próbny',
                description: '3 zbilansowane dania (śniadanie, obiad, kolacja) z dostawą pod drzwi we Wrocławiu.',
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
          name: 'Zestaw 4 Posiłki',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'GoodLunch 4 Posiłki (1500-2500 kcal) – Dzień próbny',
                description: '4 pełnowartościowe posiłki z dostawą pod drzwi we Wrocławiu.',
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
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: dict.faq.q1,
        acceptedAnswer: {
          '@type': 'Answer',
          text: dict.faq.a1,
        },
      },
      {
        '@type': 'Question',
        name: dict.faq.q2,
        acceptedAnswer: {
          '@type': 'Answer',
          text: dict.faq.a2,
        },
      },
      {
        '@type': 'Question',
        name: dict.faq.q3,
        acceptedAnswer: {
          '@type': 'Answer',
          text: dict.faq.a3,
        },
      },
    ],
  };

  // 3. WebSite with Sitelinks Search / Navigation
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'GoodLunch Catering Dietetyczny Wrocław',
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
