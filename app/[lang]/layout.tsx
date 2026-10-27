import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { dictionary } from "@/lib/dictionary";
import { SITE_URL } from "@/lib/site";
import { generateStructuredData } from "@/lib/structured-data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyBottomCTA from "@/components/ui/StickyBottomCTA";
import LoadingScreen from "@/components/ui/LoadingScreen";
import FloatingBackgrounds from "@/components/ui/FloatingBackgrounds";
import { OrderProvider } from "@/components/providers/OrderProvider";
import { GlobalQuickOrderModal } from "@/components/ui/QuickOrderModal";
import TrackingScripts from "@/components/scripts/TrackingScripts";
import { Analytics } from "@vercel/analytics/react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF6B00",
};

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  // @ts-ignore
  const dict = dictionary[lang] || dictionary.pl;
  const meta = dict.meta;

  const canonicalUrl = `${SITE_URL}/${lang}`;
  const ogLocaleMap: Record<string, string> = {
    pl: 'pl_PL',
    ua: 'uk_UA',
    ru: 'ru_RU',
    be: 'be_BY',
    en: 'en_US',
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.title,
      template: `%s | GoodLunch Wrocław`,
    },
    description: meta.desc,
    keywords: meta.keywords,
    applicationName: 'GoodLunch',
    authors: [{ name: 'GoodLunch Catering Dietetyczny Wrocław', url: SITE_URL }],
    creator: 'GoodLunch',
    publisher: 'GoodLunch',
    formatDetection: {
      telephone: true,
      address: true,
      email: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'pl-PL': `${SITE_URL}/pl`,
        'uk-UA': `${SITE_URL}/ua`,
        'ru-RU': `${SITE_URL}/ru`,
        'be-BY': `${SITE_URL}/be`,
        'en-US': `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/pl`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: canonicalUrl,
      siteName: 'GoodLunch – Catering Dietetyczny Wrocław',
      locale: ogLocaleMap[lang] || 'pl_PL',
      alternateLocale: Object.values(ogLocaleMap).filter((l) => l !== (ogLocaleMap[lang] || 'pl_PL')),
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/logo.png`,
          width: 512,
          height: 512,
          alt: 'GoodLunch Catering Dietetyczny Wrocław',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.desc,
      images: [`${SITE_URL}/logo.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: 'food',
    other: {
      'geo.region': 'PL-DS',
      'geo.placename': 'Wrocław',
      'geo.position': '51.107883;17.038538',
      'ICBM': '51.107883, 17.038538',
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  // @ts-ignore
  const dict = dictionary[lang] || dictionary.pl;
  const { businessSchema, faqSchema, websiteSchema } = generateStructuredData(lang, dict);

  const loadingTextMap: Record<string, string> = {
    pl: 'Gotujemy...',
    ua: 'Готуємо...',
    ru: 'Готовим...',
    be: 'Гатуем...',
    en: 'Cooking...'
  };
  const loadingText = loadingTextMap[lang] || loadingTextMap.en;

  // Map internal lang to HTML lang standard
  const htmlLang = lang === 'ua' ? 'uk' : lang;

  return (
    <html lang={htmlLang}>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* Preconnect to external critical origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Preload hero dish image for fastest LCP */}
        <link
          rel="preload"
          as="image"
          href="/hero-dish.webp"
          type="image/webp"
          fetchPriority="high"
        />
        {/* Schema.org Structured Data for Search Engines & AI Crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className}>
        <OrderProvider>
          <TrackingScripts />
          <LoadingScreen text={loadingText} />
          <FloatingBackgrounds />
          <Header lang={lang} />
          {children}
          <Footer lang={lang} />
          <StickyBottomCTA lang={lang} dict={dict} ctaText={dict.hero?.cta_main || 'Zamów z rabatem -25%'} />
          <GlobalQuickOrderModal dict={dict} lang={lang} />
          <Analytics />
        </OrderProvider>
      </body>
    </html>
  );
}