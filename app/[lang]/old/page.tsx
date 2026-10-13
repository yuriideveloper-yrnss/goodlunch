import type { Metadata } from 'next'
import { dictionary } from '@/lib/dictionary'
import Hero from '@/components/sections/Hero'
import PriceCalculator from '@/components/sections/PriceCalculator'
import Features from '@/components/sections/Features'
import MenuCalendar from '@/components/sections/MenuCalendar'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'
import LeadForm from '@/components/sections/LeadForm'

export const metadata: Metadata = {
  title: 'GoodLunch Archive',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default async function OldHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // @ts-ignore
  const dict = dictionary[lang] || dictionary.pl

  return (
    <main className="flex flex-col min-h-screen">
      <Hero lang={lang} dict={dict} isOld={true} />
      <Features dict={dict} />
      <MenuCalendar dict={dict} lang={lang} />
      <PriceCalculator dict={dict} lang={lang} />
      <Reviews dict={dict} lang={lang} />
      <FAQ dict={dict} />
      <LeadForm dict={dict} lang={lang} />
    </main>
  )
}
