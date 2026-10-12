'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { trackEvent } from '@/lib/tracking'
import { QuickOrderModal } from '@/components/ui/QuickOrderModal'

export default function Hero({ lang, dict }: { lang: string, dict: any }) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-brand-bg pt-14 pb-6 sm:py-20 lg:py-0">

      {/* ГИГАНТСКОЕ Свечение справа сверху (Ambient Light) */}
      <div className="absolute -top-20 -right-20 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-brand-orange/20 blur-[120px] sm:blur-[150px] rounded-full pointer-events-none"></div>

      {/* Контейнер */}
      <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row gap-3 sm:gap-6 lg:gap-12 items-center justify-center min-h-full">

        {/* Текстовая часть (на мобилке идет вторым блоком после тарелки) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full lg:w-[48%] text-center lg:text-left relative z-20 flex flex-col items-center lg:items-start order-2 lg:order-1"
        >
          {/* Badge */}
          <div className="mb-2 sm:mb-4">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 sm:py-1.5 sm:px-4 rounded-full bg-white/90 backdrop-blur-sm border border-brand-orange/25 text-brand-orange text-xs sm:text-sm font-bold shadow-xs">
              🔥 {dict.hero.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-brand-dark leading-[1.12] sm:leading-[1.1] mb-2 sm:mb-4 tracking-tight">
            {dict.hero.title}{' '}
            <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
              <del className="text-xl sm:text-3xl lg:text-5xl text-gray-400 font-semibold decoration-brand-orange/50">45 zł</del>
              <span className="text-brand-orange text-3xl sm:text-4xl lg:text-6xl font-black">36 zł</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 lg:mb-8 max-w-md lg:max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
            {dict.hero.subtitle}
          </p>

          {/* CTA Buttons — одна под другой, оранжевая сверху, вторая снизу, заполняют ширину */}
          <div className="flex flex-col gap-2 sm:gap-2.5 w-full max-w-sm sm:max-w-md">
            <Button
              size="md"
              variant="primary"
              onClick={() => {
                setIsOrderModalOpen(true)
                trackEvent('hero_cta_click', { target: 'quick_order_modal' })
              }}
              className="w-full text-sm sm:text-base py-3 sm:py-3.5 px-6 shadow-brand-orange/40 shadow-lg font-bold"
            >
              {dict.hero.cta_main}
            </Button>
            <a
              href="#menu"
              className="w-full"
              onClick={() => trackEvent('hero_cta_click', { target: 'menu' })}
            >
              <Button
                size="md"
                variant="outline"
                className="w-full text-sm sm:text-base py-3 sm:py-3.5 px-6 bg-white/80 backdrop-blur-sm font-semibold border-gray-300 hover:bg-gray-100"
              >
                {dict.hero.cta_menu}
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Визуальная часть (ЕДА НА МОБИЛКЕ НАВЕРХУ) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full lg:w-[52%] relative flex justify-center items-center order-1 lg:order-2"
        >
          {/* Контейнер для картинки: Мобилка адаптивно 220px-280px (или 32-38vh), Десктоп до 680px */}
          <div className="relative w-[210px] h-[210px] sm:w-[300px] sm:h-[300px] md:w-[380px] md:h-[380px] lg:w-[580px] lg:h-[580px] xl:w-[680px] xl:h-[680px]">

            {/* Плашка цены (плавает) */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute top-1 -left-2 sm:top-6 sm:-left-4 lg:top-14 lg:-left-6 bg-white/95 backdrop-blur-md py-1.5 px-3 sm:py-3 sm:px-5 rounded-2xl sm:rounded-3xl shadow-xl z-20 border border-white/80"
            >
              <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
                {dict.hero.trial_price_label}
              </p>
              <p className="text-xl sm:text-3xl lg:text-4xl font-black text-brand-orange tracking-tight leading-none">
                36 zł
              </p>
            </motion.div>

            <Image
              src="/hero-dish.webp"
              alt="GoodLunch Catering Dietetyczny Wrocław – Świeży zbilansowany posiłek"
              fill
              priority
              sizes="(max-width: 640px) 240px, (max-width: 1024px) 380px, 680px"
              className="object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>

      </div>

      {/* Модалка оформления заказа с выбором калорийности */}
      <QuickOrderModal
        isOpen={isOrderModalOpen}
        onCloseAction={() => setIsOrderModalOpen(false)}
        dict={dict}
        lang={lang}
        initialPackage="meals3"
      />
    </section>
  )
}