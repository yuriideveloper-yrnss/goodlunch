export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('goodlunch-catering.vercel.app')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'https://good-lunch.pl';
