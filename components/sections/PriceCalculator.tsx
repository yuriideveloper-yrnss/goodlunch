'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRICING } from '@/lib/constants'
import { useOrder } from '@/components/providers/OrderProvider'
import { OrderModal } from '@/components/ui/OrderModal'
import { CalorieAdvisor } from '@/components/ui/CalorieAdvisor'

export default function PriceCalculator({ dict, lang }: { dict: any; lang?: string }) {
  const { mealPackage, setMealPackage } = useOrder()

  const currentOptions = PRICING[mealPackage];
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
  }

  const currentTier = currentOptions.find(c => c.value === calories) || currentOptions[0]
  const fullPrice = currentTier.price.toFixed(2)
  const trialPrice = (currentTier.price * (1 - PRICING.trialDiscount)).toFixed(2)

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

          {/* Вибір ккал */}
          <div className="mb-10">
            <div className="flex justify-between mb-4">
              <label className="font-semibold text-gray-700">{dict.calc.choose_kcal}</label>
              <span className="text-brand-orange font-bold text-lg">{calories} kcal</span>
            </div>

            <div className="flex gap-2 flex-wrap sm:flex-nowrap bg-white p-1 rounded-xl shadow-sm relative">
              {currentOptions.map((tier) => {
                const isActive = calories === tier.value;
                return (
                  <button
                    key={tier.value}
                    onClick={() => setCalories(tier.value)}
                    className={`flex-1 min-w-[80px] py-3 rounded-lg text-sm font-bold transition-colors relative z-10 ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-800'
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-brand-orange/20">
            <div className="text-center sm:text-left">
              <p className="text-gray-500 text-sm mb-1">{dict.calc.price_label}</p>
              <div className="flex items-baseline justify-center sm:justify-start gap-3">
                <span className="text-4xl font-bold text-brand-dark">{trialPrice} zł</span>
                <span className="text-xl text-gray-500 line-through decoration-brand-orange">{fullPrice} zł</span>
              </div>
              <p className="text-xs text-brand-green mt-1">{dict.calc.discount_tag}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-brand-orange text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-brand-orange/30"
            >
              {dict.calc.order_btn}
            </motion.button>
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