'use client'
import { SmartCateringForm } from '@/components/smartcatering/SmartCateringForm'

export default function SmartCateringLeadForm({ dict, lang }: { dict: any; lang: string }) {
  return (
    <section className="py-24 bg-brand-dark text-white relative overflow-hidden" id="order">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange opacity-20 blur-[100px] rounded-full"></div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row gap-12 items-center">
        {/* Left text */}
        <div className="md:w-1/2">
          <span className="text-brand-orange font-bold tracking-widest uppercase mb-2 block">
            Last Call 🚀
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {dict.form.title} <br />
            <span className="text-brand-orange">-20% OFF</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            {dict.form.subtitle}
          </p>
        </div>

        {/* Right form */}
        <div className="md:w-1/2 bg-white text-brand-dark p-8 rounded-3xl border border-white/10 w-full shadow-2xl relative z-20">
          <SmartCateringForm
            dict={dict}
            lang={lang}
            showPackageSelector={true}
          />
        </div>
      </div>
    </section>
  )
}
