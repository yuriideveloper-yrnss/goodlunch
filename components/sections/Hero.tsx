'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { trackEvent } from '@/lib/tracking'
import { QuickOrderModal } from '@/components/ui/QuickOrderModal'

export default function Hero({ lang, dict, isOld = false }: { lang: string, dict: any, isOld?: boolean }) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-brand-bg pt-14 pb-4 sm:pt-20 sm:pb-8 lg:py-0 lg:justify-center">

      {/* ГИГАНТСКОЕ Свечение справа сверху (Ambient Light) */}
      <div className="absolute -top-20 -right-20 w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] bg-brand-orange/20 blur-[120px] sm:blur-[150px] rounded-full pointer-events-none"></div>

      {/* Контейнер */}
      <div className="container mx-auto px-4 z-10 flex-1 flex flex-col lg:flex-row gap-2 sm:gap-6 lg:gap-12 items-center justify-between lg:justify-center w-full max-w-6xl">

        {/* Текстовая часть + кнопки (на мобилке занимает нижнюю часть и прижимает кнопки к низу) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full lg:w-[48%] text-center lg:text-left relative z-20 flex-1 lg:flex-initial flex flex-col justify-between lg:justify-start items-center lg:items-start order-2 lg:order-1"
        >
          {/* Текстовый блок */}
          <div className="flex flex-col items-center lg:items-start my-auto lg:my-0">
            {/* Badge */}
            <div className="mb-2 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 sm:py-1.5 sm:px-4 rounded-full bg-white/90 backdrop-blur-sm border border-brand-orange/25 text-brand-orange text-xs sm:text-sm font-bold shadow-xs">
                🔥 {dict.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-brand-dark leading-[1.12] sm:leading-[1.1] mb-2 sm:mb-4 tracking-tight">
              {dict.hero.title}{' '}
              <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
                <del className="text-xl sm:text-3xl lg:text-5xl text-gray-400 font-semibold decoration-brand-orange/50">45 zł</del>
                <span className="text-brand-orange text-3xl min-[380px]:text-4xl sm:text-5xl lg:text-6xl font-black">36 zł</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs min-[380px]:text-sm sm:text-base lg:text-lg text-gray-600 mb-2 sm:mb-6 lg:mb-8 max-w-md lg:max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              {dict.hero.subtitle}
            </p>
          </div>

          {/* CTA Buttons — прижаты к низу на мобилках */}
          <div className="flex flex-col gap-2 sm:gap-2.5 w-full max-w-sm sm:max-w-md mt-auto pt-2 pb-[env(safe-area-inset-bottom,0px)]">
            <Button
              size="md"
              variant="primary"
              onClick={() => {
                setIsOrderModalOpen(true)
                trackEvent('hero_cta_click', { target: 'quick_order_modal' })
              }}
              className="w-full text-base sm:text-lg py-3.5 sm:py-4 px-6 shadow-brand-orange/40 shadow-xl font-black active:scale-[0.98]"
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
                className="w-full text-sm sm:text-base py-3 sm:py-3.5 px-6 bg-white/90 backdrop-blur-sm font-bold border-gray-300 hover:bg-gray-100"
              >
                {dict.hero.cta_menu}
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Визуальная часть (ЕДА НА МОБИЛКЕ НАВЕРХУ - увеличенный масштаб) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full lg:w-[52%] relative flex justify-center items-center order-1 lg:order-2 flex-shrink-0 pt-2 lg:pt-0"
        >
          {/* Контейнер для картинки: Мобилка адаптивно 240px-330px, Десктоп до 680px */}
          <div className="relative w-[240px] h-[240px] min-[380px]:w-[270px] min-[380px]:h-[270px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] lg:w-[580px] lg:h-[580px] xl:w-[680px] xl:h-[680px]">

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
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 420px, 680px"
              className="object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.22)] hover:scale-105 transition-transform duration-700"
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
        isOld={isOld}
      />
    </section>
  )
}