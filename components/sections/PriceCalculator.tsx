'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRICING, GLOBAL_PRICING } from '@/lib/constants'
import { useOrder } from '@/components/providers/OrderProvider'
import { OrderModal } from '@/components/ui/OrderModal'
import { CalorieAdvisor } from '@/components/ui/CalorieAdvisor'
import { PromoCodeBox } from '@/components/ui/PromoCodeBox'
import { trackEvent } from '@/lib/tracking'

export default function PriceCalculator({ dict, lang = 'pl', isGlobal = false }: { dict: any; lang?: string; isGlobal?: boolean }) {
  const pricingTiers = isGlobal ? GLOBAL_PRICING : PRICING
  const { mealPackage, setMealPackage } = useOrder()

  const currentOptions = pricingTiers[mealPackage];
  const [calories, setCalories] = useState(currentOptions[0].value)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false)

  // Since mealPackage can change from outside (or on mount), ensure calories is valid
  useEffect(() => {
    if (!currentOptions.find(c => c.value === calories)) {
      setCalories(currentOptions[0].value)
    }
  }, [mealPackage, currentOptions, calories])

  const handlePackageChange = (pkg: 'meals3' | 'meals4') => {
    setMealPackage(pkg);
    trackEvent('calculator_package_change', { package: pkg });
  }

  const currentTier = currentOptions.find(c => c.value === calories) || currentOptions[0]
  const fullPrice = currentTier.price.toFixed(2)
  const trialPrice = (currentTier.price * (1 - pricingTiers.trialDiscount)).toFixed(2)

  const handleAdvisorSelectPackageAndCalories = (pkg: 'meals3' | 'meals4', selectedCalories: number) => {
    setMealPackage(pkg)
    setCalories(selectedCalories)
  }

  return (
    <section id="cennik" className="py-20 bg-white relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{dict.calc.title}</h2>

        <div className="max-w-3xl mx-auto bg-brand-bg rounded-3xl p-8 shadow-sm border border-gray-100">

          {/* Wybór pakietu */}
          <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm relative">
            <button
              onClick={() => handlePackageChange('meals3')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-colors z-10 relative ${mealPackage === 'meals3' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {mealPackage === 'meals3' && (
                <motion.div
                  layoutId="packageTab"
                  className="absolute inset-0 bg-brand-orange rounded-lg shadow-md z-[-1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {dict.calc.meals3_label}
            </button>
            <button
              onClick={() => handlePackageChange('meals4')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-colors z-10 relative ${mealPackage === 'meals4' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {mealPackage === 'meals4' && (
                <motion.div
                  layoutId="packageTab"
                  className="absolute inset-0 bg-brand-orange rounded-lg shadow-md z-[-1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {dict.calc.meals4_label}
            </button>
          </div>

          {/* Opis dań w wybranym pakiecie */}
          <div className="mb-6 -mt-4 text-center">
            <span className="inline-flex items-center gap-1.5 bg-orange-100/80 text-brand-orange text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-full border border-brand-orange/20">
              {mealPackage === 'meals3'
                ? `🥣 ${dict.calc?.meals3_desc || 'Śniadanie + zupa + danie główne'}`
                : `🍴 ${dict.calc?.meals4_desc || 'Śniadanie + zupa + 2 dania główne'}`}
            </span>
          </div>

          {/* Вибір ккал */}
          <div className="mb-10">
            <div className="flex justify-between mb-4">
              <label className="font-semibold text-gray-700">{dict.calc.choose_kcal}</label>
              <span className="text-brand-orange font-bold text-lg">{calories} kcal</span>
            </div>

            <div className={`grid gap-1.5 sm:gap-2 p-1 bg-white rounded-xl shadow-sm relative ${mealPackage === 'meals4' ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {currentOptions.map((tier) => {
                const isActive = calories === tier.value;
                return (
                  <button
                    key={tier.value}
                    onClick={() => setCalories(tier.value)}
                    className={`py-2.5 sm:py-3 px-1 rounded-lg text-xs sm:text-sm font-bold transition-colors relative z-10 text-center whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="calorieTab"
                        className="absolute inset-0 bg-brand-dark rounded-lg shadow-md z-[-1]"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    {tier.value}
                  </button>
                )
              })}
            </div>

            {/* "Не впевнений" button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAdvisorOpen(true)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-brand-orange/40 text-brand-orange text-sm font-semibold hover:bg-orange-50 transition-colors"
            >
              <span>🤔</span>
              {dict.calc.unknown_btn}
            </motion.button>
          </div>

          {/* Підсумкова ціна з анімацією */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white p-5 sm:p-6 rounded-2xl border border-brand-orange/20">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <p className="text-gray-500 text-xs sm:text-sm mb-1">{dict.calc.price_label}</p>
              <div className="flex items-baseline justify-center sm:justify-start gap-2.5 sm:gap-3 flex-nowrap whitespace-nowrap">
                <span className="text-3xl min-[380px]:text-4xl font-black text-brand-dark tracking-tight whitespace-nowrap">{trialPrice}&nbsp;zł</span>
                <span className="text-lg min-[380px]:text-xl text-gray-400 font-semibold line-through decoration-brand-orange whitespace-nowrap">{fullPrice}&nbsp;zł</span>
              </div>
              <p className="text-xs text-brand-green font-semibold mt-1 whitespace-nowrap">{dict.calc.discount_tag}</p>
              <div className="mt-2.5">
                <PromoCodeBox dict={dict} variant="compact" source="price_calculator" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setIsModalOpen(true);
                trackEvent('calculator_order_click', { package: mealPackage, calories: calories, price: trialPrice });
              }}
              className="w-full sm:w-auto bg-brand-orange hover:bg-orange-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold shadow-lg shadow-brand-orange/30 whitespace-nowrap text-base"
            >
              {dict.calc.order_btn}
            </motion.button>
          </div>

          {/* Dodatkowe korzyści: chleb + bezpłatna dostawa */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-gray-600">
            <span className="flex items-center gap-1.5">
              <span>🥖</span>
              <span>{dict.calc?.bread_included || 'Do diety dodajemy świeży chleb'}</span>
            </span>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-brand-green">
              <span>🚐</span>
              <span>{dict.calc?.free_delivery || 'Bezpłatna dostawa'}</span>
            </span>
          </div>

        </div>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onCloseAction={() => setIsModalOpen(false)}
        dict={dict}
        selectedPackage={mealPackage}
        selectedCalories={calories}
        price={trialPrice}
        lang={lang}
        isGlobal={isGlobal}
      />

      <CalorieAdvisor
        isOpen={isAdvisorOpen}
        onCloseAction={() => setIsAdvisorOpen(false)}
        onSelectPackageAndCaloriesAction={handleAdvisorSelectPackageAndCalories}
        dict={dict}
      />
    </section>
  )
}