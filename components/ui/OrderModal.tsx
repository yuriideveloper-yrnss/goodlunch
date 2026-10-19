'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TwoStepForm } from '@/components/ui/TwoStepForm'

export function OrderModal({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: any
    selectedPackage: string
    selectedCalories: number
    price: string
    lang?: string
}) {
    const [mounted, setMounted] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onCloseAction()
            }
            window.addEventListener('keydown', handleKeyDown)
            return () => {
                document.body.style.overflow = ''
                window.removeEventListener('keydown', handleKeyDown)
            }
        } else {
            document.body.style.overflow = ''
            setIsSuccess(false)
        }
    }, [isOpen, onCloseAction])

    if (!mounted) return null

    const modalNode = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                    className={`fixed inset-0 z-[200] flex items-center justify-center p-4 ${
                        !isOpen ? 'pointer-events-none' : ''
                    }`}
                >
                    <div
                        onClick={onCloseAction}
                        className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${
                            !isOpen ? 'pointer-events-none' : ''
                        }`}
                    />

                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20, transition: { duration: 0.15 } }}
                        className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
                    >
                        <button
                            aria-label="Close modal"
                            onClick={onCloseAction}
                            className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors cursor-pointer z-20"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        {isSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-brand-dark mb-2">{dict.form.success_title}</h3>
                                <p className="text-gray-500">{dict.form.success_desc}</p>
                                <button
                                    onClick={onCloseAction}
                                    className="mt-6 w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 cursor-pointer"
                                >
                                    Ok
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-brand-dark mb-2">{dict.form.title}</h3>
                                <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">
                                    {dict.form.subtitle}
                                    <br />{' '}
                                    <span className="font-bold text-brand-dark whitespace-nowrap">
                                        {selectedPackage === 'meals3' ? '3 Posiłki' : '4 Posiłki'} • {selectedCalories}&nbsp;kcal • {price}&nbsp;zł
                                    </span>
                                </p>

                                <TwoStepForm
                                    dict={dict}
                                    defaultData={{ package: selectedPackage, calories: selectedCalories, price }}
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

    return createPortal(modalNode, document.body)
}
