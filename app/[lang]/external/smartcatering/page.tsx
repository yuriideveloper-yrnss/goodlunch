import { dictionary } from '@/lib/dictionary'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import MenuCalendar from '@/components/sections/MenuCalendar'
import SmartCateringCalculator from '@/components/smartcatering/SmartCateringCalculator'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'
import SmartCateringLeadForm from '@/components/smartcatering/SmartCateringLeadForm'

export default async function SmartCateringPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // @ts-ignore
  const dict = dictionary[lang] || dictionary.pl;

  return (
    <main className="flex flex-col min-h-screen" key={`smartcatering-${lang}`}>
      <Hero lang={lang} dict={dict} />
      <Features dict={dict} />
      <MenuCalendar dict={dict} lang={lang} />
      <SmartCateringCalculator dict={dict} lang={lang} />
      <Reviews dict={dict} lang={lang} />
      <FAQ dict={dict} />
      <SmartCateringLeadForm dict={dict} lang={lang} />
    </main>
  );
}
