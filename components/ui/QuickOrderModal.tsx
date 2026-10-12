'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRICING } from '@/lib/constants'
import { TwoStepForm } from '@/components/ui/TwoStepForm'
import { trackEvent } from '@/lib/tracking'

export function QuickOrderModal({
  isOpen,
  onCloseAction,
  dict,
  lang,
  initialPackage = 'meals3',
}: {
  isOpen: boolean
  onCloseAction: () => void
  dict: any
  lang: string
  initialPackage?: 'meals3' | 'meals4'
}) {
  const [mealPackage, setMealPackage] = useState<'meals3' | 'meals4'>(initialPackage)
  const currentOptions = PRICING[mealPackage]
  const [calories, setCalories] = useState<number>(currentOptions[0].value)
  const [isSuccess, setIsSuccess] = useState(false)

  // Ensure valid calories when package toggles
  const safeCalories = currentOptions.some((c) => c.value === calories)
    ? calories
    : currentOptions[0].value

  const currentTier = currentOptions.find((c) => c.value === safeCalories) || currentOptions[0]
  const trialPrice = (currentTier.price * (1 - PRICING.trialDiscount)).toFixed(2)
  const fullPrice = currentTier.price.toFixed(2)

  const handlePackageToggle = (pkg: 'meals3' | 'meals4') => {
    setMealPackage(pkg)
    const newOptions = PRICING[pkg]
    setCalories(newOptions[0].value)
    trackEvent('quick_order_package_change', { package: pkg })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="quick-order-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          {/* Backdrop */}
          <div
            onClick={onCloseAction}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white rounded-3xl p-5 sm:p-7 w-full max-w-md shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              aria-label="Close modal"
              onClick={onCloseAction}
              className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors z-20"
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
                  className="mt-6 w-full bg-brand-orange text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-orange-600 transition-colors"
                >
                  OK
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-4 pr-8">
                  <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold mb-2">
                    🔥 {dict.hero.badge || 'Wrocław'} • -20%
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight leading-tight">
                    {dict.calc.title || 'Wybierz swój zestaw'}
                  </h3>
                </div>

                {/* 1. Выбор пакета (3 / 4 Posiłki) */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-3.5 relative">
                  <button
                    type="button"
                    onClick={() => handlePackageToggle('meals3')}
                    className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-colors z-10 relative ${
                      mealPackage === 'meals3'
                        ? 'text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mealPackage === 'meals3' && (
                      <motion.div
                        layoutId="quickPackageTab"
                        className="absolute inset-0 bg-brand-orange rounded-lg shadow-sm z-[-1]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {dict.calc.meals3_label}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePackageToggle('meals4')}
                    className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-colors z-10 relative ${
                      mealPackage === 'meals4'
                        ? 'text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mealPackage === 'meals4' && (
                      <motion.div
                        layoutId="quickPackageTab"
                        className="absolute inset-0 bg-brand-orange rounded-lg shadow-sm z-[-1]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {dict.calc.meals4_label}
                  </button>
                </div>

                {/* 2. Выбор калорийности (в один ряд без переносов) */}
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
                          className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-bold transition-all relative z-10 text-center whitespace-nowrap ${
                            isActive
                              ? 'text-white'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="quickCalorieTab"
                              className="absolute inset-0 bg-brand-dark rounded-lg shadow-sm z-[-1]"
                              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                            />
                          )}
                          {tier.value}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Плашка с ценой */}
                <div className="flex items-center justify-between bg-orange-50/70 border border-brand-orange/20 px-3.5 py-2.5 rounded-xl mb-4">
                  <span className="text-xs text-gray-600 font-medium">
                    {dict.calc.price_label}
                  </span>
                  <div className="flex items-baseline gap-2 whitespace-nowrap">
                    <span className="text-xl sm:text-2xl font-black text-brand-dark">
                      {trialPrice} zł
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 font-semibold line-through">
                      {fullPrice} zł
                    </span>
                  </div>
                </div>

                {/* 4. Форма контактов и адреса */}
                <TwoStepForm
                  dict={dict}
                  defaultData={{
                    package: mealPackage,
                    calories: safeCalories,
                    price: trialPrice,
                  }}
                  lang={lang}
                  onSuccessAction={() => setIsSuccess(true)}
                />
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
