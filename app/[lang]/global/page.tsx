import type { Metadata } from 'next'
import { getGlobalDictionary } from '@/lib/global-dictionary'
import { SITE_URL } from '@/lib/site'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import MenuCalendar from '@/components/sections/MenuCalendar'
import PriceCalculator from '@/components/sections/PriceCalculator'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'
import LeadForm from '@/components/sections/LeadForm'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = getGlobalDictionary(lang)

  return {
    title: dict.meta?.title || 'GoodLunch | Catering Dietetyczny & Domowe Obiady w całej Polsce – od 37,50 zł',
    description: dict.meta?.desc || 'Pyszne domowe jedzenie i catering dietetyczny z dostawą w całej Polsce. Zniżka -25% na pierwsze zamówienie z kodem Jesień!',
    alternates: {
      canonical: `${SITE_URL}/${lang}/global`,
      languages: {
        'pl-PL': `${SITE_URL}/pl/global`,
        'uk-UA': `${SITE_URL}/ua/global`,
        'ru-RU': `${SITE_URL}/ru/global`,
        'be-BY': `${SITE_URL}/be/global`,
        'en-US': `${SITE_URL}/en/global`,
        'x-default': `${SITE_URL}/pl/global`,
      },
    },
    openGraph: {
      title: dict.meta?.title,
      description: dict.meta?.desc,
      url: `${SITE_URL}/${lang}/global`,
      siteName: 'GoodLunch Polska',
      locale: lang === 'pl' ? 'pl_PL' : lang === 'ua' ? 'uk_UA' : lang === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/hero-dish.jpg`,
          width: 1024,
          height: 1024,
          alt: 'GoodLunch Catering Dietetyczny Polska',
        },
      ],
    },
  }
}

export default async function GlobalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = getGlobalDictionary(lang)

  return (
    <main className="flex flex-col min-h-screen">
      <Hero lang={lang} dict={dict} isGlobal={true} />
      <Features dict={dict} />
      <MenuCalendar dict={dict} lang={lang} />
      <PriceCalculator dict={dict} lang={lang} isGlobal={true} />
      <Reviews dict={dict} lang={lang} />
      <FAQ dict={dict} />
      <LeadForm dict={dict} lang={lang} isGlobal={true} />
    </main>
  )
}
