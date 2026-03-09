import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { dictionary } from "@/lib/dictionary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import FloatingBackgrounds from "@/components/ui/FloatingBackgrounds";
import { OrderProvider } from "@/components/providers/OrderProvider";
import TrackingScripts from "@/components/scripts/TrackingScripts";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const inter = Inter({ subsets: ["latin"] });

// Исправляем Metadata
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params; // <--- ЖДЕМ
  // @ts-ignore
  const meta = dictionary[lang]?.meta || dictionary.pl.meta;
  return {
    title: meta.title,
    description: meta.desc,
  };
}

export default async function RootLayout({
  children,
  params, // <--- Не разбираем сразу, а берем целиком
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>; // <--- Типизируем как Promise
}>) {

  const { lang } = await params; // <--- ЖДЕМ ЗДЕСЬ

  const loadingTextMap: Record<string, string> = {
    pl: 'Gotujemy...',
    ua: 'Готуємо...',
    ru: 'Готовим...',
    en: 'Cooking...'
  };
  const loadingText = loadingTextMap[lang] || loadingTextMap.en;

  return (
    <html lang="pl">
      <head>
      </head>
      <body className={inter.className}>
        <OrderProvider>
          <TrackingScripts />
          <LoadingScreen text={loadingText} />
          <FloatingBackgrounds />
          <Header lang={lang} />
          {children}
          <Footer lang={lang} />
          <SpeedInsights />
        </OrderProvider>
      </body>
    </html>
  );
}