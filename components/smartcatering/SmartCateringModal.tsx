'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { SmartCateringForm } from '@/components/smartcatering/SmartCateringForm'

export function SmartCateringModal({
    isOpen,
    onCloseAction,
    dict,
    selectedPackage,
    selectedCalories,
    price,
    lang
}: {
    isOpen: boolean
    onCloseAction: () => void
    dict: any
    selectedPackage: string
    selectedCalories: number
    price: string
    lang?: string
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="smartcatering-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                >
                    <div
                        onClick={onCloseAction}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl"
                    >
                        <button
                            aria-label="Close modal"
                            onClick={onCloseAction}
                            className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        <h3 className="text-2xl font-bold text-brand-dark mb-2">{dict.form.title}</h3>
                        <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">
                            {dict.form.subtitle}
                            <br />
                            <span className="font-bold text-brand-dark">
                                {selectedPackage === 'meals3' ? '3 Posiłki' : '4 Posiłki'} • {selectedCalories} kcal • {price} zł
                            </span>
                        </p>

                        <SmartCateringForm
                            dict={dict}
                            defaultData={{ package: selectedPackage, calories: selectedCalories, price }}
                            lang={lang}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
