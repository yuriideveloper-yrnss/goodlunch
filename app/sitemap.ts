import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = ['pl', 'ua', 'ru', 'en'];

  // Base routes for each language
  const routes = [
    '',
    '/privacy-policy',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const lang of languages) {
      const url = `${SITE_URL}/${lang}${route}`;

      const alternatesLanguages: Record<string, string> = {
        'x-default': `${SITE_URL}/pl${route}`,
      };

      for (const l of languages) {
        // Map internal language code to proper BCP-47 hreflang
        const hreflangCode = l === 'ua' ? 'uk-UA' : l === 'pl' ? 'pl-PL' : l === 'ru' ? 'ru' : 'en';
        alternatesLanguages[hreflangCode] = `${SITE_URL}/${l}${route}`;
      }

      sitemapEntries.push({
        url,
        lastModified,
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? (lang === 'pl' ? 1.0 : 0.9) : 0.6,
        alternates: {
          languages: alternatesLanguages,
        },
      });
    }
  }

  return sitemapEntries;
}
