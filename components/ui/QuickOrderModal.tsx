'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { PRICING, GLOBAL_PRICING } from '@/lib/constants'
import { SmartCateringForm } from '@/components/smartcatering/SmartCateringForm'
import { trackEvent } from '@/lib/tracking'
import { useOrder } from '@/components/providers/OrderProvider'
import { PromoCodeBox } from '@/components/ui/PromoCodeBox'

const TwoStepForm = dynamic(
  () => import('@/components/ui/TwoStepForm').then((mod) => mod.TwoStepForm),
  { ssr: false }
)

export function QuickOrderModal({
  isOpen,
  onCloseAction,
  dict,
  lang,
  initialPackage = 'meals3',
  isOld = false,
  isGlobal = false,
}: {
  isOpen: boolean
  onCloseAction: () => void
  dict: any
  lang: string
  initialPackage?: 'meals3' | 'meals4'
  isOld?: boolean
  isGlobal?: boolean
}) {
  const pricingTiers = isGlobal ? GLOBAL_PRICING : PRICING
  const [mounted, setMounted] = useState(false)
  const [mealPackage, setMealPackage] = useState<'meals3' | 'meals4'>(initialPackage)
  const currentOptions = pricingTiers[mealPackage]
  const [calories, setCalories] = useState<number>(currentOptions[0].value)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update meal package if initialPackage prop changes
  useEffect(() => {
    if (isOpen) {
      setMealPackage(initialPackage)
      const options = PRICING[initialPackage]
      setCalories(options[0].value)
      setIsSuccess(false)
    }
  }, [isOpen, initialPackage])

  // Scroll lock and Escape key listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCloseAction()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen, onCloseAction])

  // Ensure valid calories when package toggles
  const safeCalories = currentOptions.some((c) => c.value === calories)
    ? calories
    : currentOptions[0].value

  const currentTier = currentOptions.find((c) => c.value === safeCalories) || currentOptions[0]
  const trialPrice = (currentTier.price * (1 - pricingTiers.trialDiscount)).toFixed(2)
  const fullPrice = currentTier.price.toFixed(2)

  const handlePackageToggle = (pkg: 'meals3' | 'meals4') => {
    setMealPackage(pkg)
    const newOptions = PRICING[pkg]
    setCalories(newOptions[0].value)
    trackEvent('quick_order_package_change', { package: pkg })
  }

  if (!mounted) return null

  const modalNode = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="quick-order-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
          className={`fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 overflow-y-auto ${
            !isOpen ? 'pointer-events-none' : ''
          }`}
        >
          {/* Backdrop */}
          <div
            onClick={onCloseAction}
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${
              !isOpen ? 'pointer-events-none' : ''
            }`}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white rounded-3xl p-5 sm:p-7 w-full max-w-md shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              aria-label="Close modal"
              onClick={onCloseAction}
              className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors z-20 cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M13 1L1 13M1 1L13 13"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {isSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-2">
                  {dict.form.success_title}
                </h3>
                <p className="text-gray-500">{dict.form.success_desc}</p>
                <button
                  onClick={onCloseAction}
                  className="mt-6 w-full bg-brand-orange text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  OK
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-4 pr-8">
                  <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold mb-2">
                    🔥 {isGlobal ? 'Polska' : (dict.hero.badge || 'Wrocław')} • -25% z kodem Jesień
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight leading-tight">
                    {dict.calc.title || 'Wybierz swój zestaw'}
                  </h3>
                </div>

                {/* 1. Wybor pakietu (3 / 4 Posiłki) */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-3.5 relative">
                  <button
                    type="button"
                    onClick={() => handlePackageToggle('meals3')}
                    className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all z-10 relative cursor-pointer ${
                      mealPackage === 'meals3'
                        ? 'bg-brand-orange text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {dict.calc.meals3_label}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePackageToggle('meals4')}
                    className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all z-10 relative cursor-pointer ${
                      mealPackage === 'meals4'
                        ? 'bg-brand-orange text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {dict.calc.meals4_label}
                  </button>
                </div>

                {/* 2. Wybor kalorycznosci */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
                    <span className="font-semibold text-gray-700">
                      {dict.calc.choose_kcal}
                    </span>
                    <span className="font-extrabold text-brand-orange">
                      {safeCalories} kcal
                    </span>
                  </div>

                  <div
                    className={`grid gap-1.5 p-1 bg-gray-50 border border-gray-200/70 rounded-xl ${
                      mealPackage === 'meals4' ? 'grid-cols-4' : 'grid-cols-3'
                    }`}
                  >
                    {currentOptions.map((tier) => {
                      const isActive = safeCalories === tier.value
                      return (
                        <button
                          key={tier.value}
                          type="button"
                          onClick={() => setCalories(tier.value)}
                          className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-bold transition-all relative z-10 text-center whitespace-nowrap cursor-pointer ${
                            isActive
                              ? 'bg-brand-dark text-white shadow-sm'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {tier.value}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Płytka z cena */}
                <div className="flex items-center justify-between bg-orange-50/70 border border-brand-orange/20 px-3.5 py-2.5 rounded-xl mb-4">
                  <span className="text-xs text-gray-600 font-medium">
                    {dict.calc.price_label}
                  </span>
                  <div className="flex items-baseline gap-2 whitespace-nowrap flex-nowrap">
                    <span className="text-xl sm:text-2xl font-black text-brand-dark whitespace-nowrap">
                      {trialPrice}&nbsp;zł
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 font-semibold line-through whitespace-nowrap">
                      {fullPrice}&nbsp;zł
                    </span>
                  </div>
                </div>

                {/* Promo Code Callout */}
                <div className="mb-4">
                  <PromoCodeBox dict={dict} variant="box" source="quick_order_modal" />
                </div>

                {/* 4. Formularz */}
                {isOld || isGlobal ? (
                  <TwoStepForm
                    dict={dict}
                    defaultData={{
                      package: mealPackage,
                      calories: safeCalories,
                      price: trialPrice,
                      isGlobal,
                    }}
                    lang={lang}
                    isGlobal={isGlobal}
                    onSuccessAction={() => setIsSuccess(true)}
                  />
                ) : (
                  <SmartCateringForm
                    dict={dict}
                    defaultData={{
                      package: mealPackage,
                      calories: safeCalories,
                      price: trialPrice,
                    }}
                    lang={lang}
                    onSuccessAction={() => setIsSuccess(true)}
                  />
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalNode, document.body)
}

/**
 * Global QuickOrderModal connected directly to OrderProvider context.
 * Mount this once in the root localized layout.
 */
export function GlobalQuickOrderModal({ dict, lang }: { dict: any; lang: string }) {
  const { isQuickOrderOpen, closeQuickOrder, quickOrderConfig } = useOrder()
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const isGlobalRoute = quickOrderConfig.isGlobal || pathname?.includes('/global')

  return (
    <QuickOrderModal
      isOpen={isQuickOrderOpen}
      onCloseAction={closeQuickOrder}
      dict={dict}
      lang={lang}
      initialPackage={quickOrderConfig.package || 'meals3'}
      isOld={quickOrderConfig.isOld || isGlobalRoute}
      isGlobal={isGlobalRoute}
    />
  )
}
