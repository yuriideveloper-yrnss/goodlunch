import { dictionary } from '@/lib/dictionary'
import Hero from '@/components/sections/Hero'
import PriceCalculator from '@/components/sections/PriceCalculator'
import Features from '@/components/sections/Features'
import MenuCalendar from '@/components/sections/MenuCalendar'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'
import LeadForm from '@/components/sections/LeadForm'

// Обрати внимание: params теперь Promise
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {

  // 👇 ВОТ ГЛАВНОЕ ИСПРАВЛЕНИЕ: МЫ ЖДЕМ (AWAIT) ПАРАМЕТРЫ
  const { lang } = await params;

  // @ts-ignore
  const dict = dictionary[lang] || dictionary.pl

  return (
    <main className="flex flex-col min-h-screen" key={lang}>
      <Hero lang={lang} dict={dict} />
      <Features dict={dict} />
      <MenuCalendar dict={dict} lang={lang} />
      <PriceCalculator dict={dict} lang={lang} />
      <Reviews dict={dict} />
      <FAQ dict={dict} />
      <LeadForm dict={dict} lang={lang} />
    </main>
  )
}