'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

export default function Hero({ lang, dict }: { lang: string, dict: any }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-bg">

      {/* Фоновый шум (еле заметный) */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>

      {/* ГИГАНТСКОЕ Свечение справа сверху (Ambient Light) */}
      <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-brand-orange/20 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Контейнер */}
      <div className="container mx-auto px-4 z-10 flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center pt-24 lg:pt-0">

        {/* Текстовая часть (45% ширины) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[45%] text-center lg:text-left relative z-20"
        >
          <span className="inline-block py-2 px-4 rounded-full bg-white border border-brand-orange/20 text-brand-orange text-sm font-bold mb-6 shadow-sm">
            🔥 {dict.hero.badge}
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-brand-dark leading-[1.1] mb-6 tracking-tight">
            {dict.hero.title} <br className="hidden lg:block" />
            <del className="text-3xl lg:text-5xl text-gray-500 mr-3 decoration-brand-orange/50">45 zł</del>
            <span className="text-brand-orange whitespace-nowrap">36 zł</span>
          </h1>

          <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            {dict.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
            <a href="#cennik" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full shadow-brand-orange/40 shadow-xl">
                {dict.hero.cta_main}
              </Button>
            </a>
            <a href="#menu" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-white/50 backdrop-blur-sm">
                {dict.hero.cta_menu}
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Визуальная часть (55% ширины - ЕДА ГЛАВНАЯ) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[55%] relative flex justify-center lg:justify-end"
        >
          {/* Контейнер для картинки: Мобилка 320px -> Десктоп 750px! */}
          <div className="relative w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] lg:w-[750px] lg:h-[750px]">

            {/* Плашка цены (плавает) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-10 left-0 lg:top-20 lg:-left-10 bg-white/90 backdrop-blur-xl p-4 lg:p-6 rounded-3xl shadow-2xl z-20 border border-white/60"
            >
              <p className="text-xs lg:text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">{dict.hero.trial_price_label}</p>
              <p className="text-3xl lg:text-5xl font-extrabold text-brand-orange tracking-tight">36 zł</p>
            </motion.div>

            <Image
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
              alt="Delicious food preview"
              fill
              loading="lazy"
              className="object-contain lg:object-cover drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-full lg:rounded-[100px]"
              priority={false}
              sizes="(max-width: 768px) 320px, 50vw"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}