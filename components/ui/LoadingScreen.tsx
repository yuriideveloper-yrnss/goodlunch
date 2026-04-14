'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ text = 'Gotujemy...' }: { text?: string }) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Hide as soon as the component is mounted (hydration complete)
        // A tiny timeout ensures the animation starts smoothly
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    const loopTransition = {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const
    };

    const masterVariants = {
        initial: { x: 0, rotate: 0, scaleX: 1 },
        animate: { x: 0, rotate: 0, scaleX: 1 },
        exit: {
            x: [0, -30, 800],
            rotate: [0, -8, 15],
            scaleX: [1, 0.95, 1.3],
            transition: { duration: 0.6, ease: "easeInOut" }
        }
    };

    const tomatoVariants = {
        initial: { y: 0, x: 0, scale: 1 },
        animate: {
            y: [0, -8, 0],
            x: [0, -5, 0],
            scale: [1, 1.05, 1],
            transition: loopTransition
        }
    };

    const broccoliVariants = {
        initial: { y: 0, x: 0, scale: 1, rotate: 0 },
        animate: {
            y: [0, -5, 0],
            x: [0, 8, 0],
            scale: [1, 1.05, 1],
            rotate: [0, -8, 0],
            transition: { ...loopTransition, delay: 0.3 }
        }
    };

    const cheeseVariants = {
        initial: { y: 0, x: 0, rotate: 200 },
        animate: {
            y: [0, -6, 0],
            x: [0, 5, 0],
            rotate: [200, 215, 200],
            transition: { ...loopTransition, delay: 0.6 }
        }
    };

    const spoonVariants = {
        initial: { y: 0, x: 0, scale: 1, rotate: 15 },
        animate: {
            y: [0, 10, -10, 0],
            x: [0, -20, 15, 0],
            scale: [1, 1.05, 0.95, 1],
            rotate: [15, -5, 30, 15],
            transition: { duration: 2.5, ease: "easeInOut", repeat: Infinity }
        }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    className="fixed inset-0 z-[100] bg-brand-bg flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="relative w-56 h-56 flex items-center justify-center">
                        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">

                            <motion.g initial="initial" animate="animate" exit="exit" variants={masterVariants} style={{ transformOrigin: 'center' }}>

                                {/* 1. ЗАДНЯЯ СТЕНКА ТАРЕЛКИ */}
                                <ellipse cx="100" cy="110" rx="70" ry="14" fill="#C2410C" />

                                {/* 2. ЕДА */}
                                <motion.g variants={tomatoVariants} style={{ transformOrigin: '100px 105px' }}>
                                    <circle cx="85" cy="105" r="16" fill="#EF4444" />
                                    <circle cx="82" cy="102" r="6" fill="#FCA5A5" opacity="0.6" />
                                </motion.g>

                                <motion.g variants={broccoliVariants} style={{ transformOrigin: '100px 105px' }}>
                                    <path d="M 125 115 Q 145 90 155 110 Q 135 130 125 115 Z" fill="#22C55E" />
                                    <path d="M 115 105 Q 130 85 145 100 Q 125 120 115 105 Z" fill="#4ADE80" />
                                </motion.g>

                                <motion.g variants={cheeseVariants} style={{ transformOrigin: '100px 105px' }}>
                                    <rect x="95" y="90" width="16" height="16" rx="3" fill="#FBBF24" transform="rotate(15 103 98)" />
                                    <rect x="105" y="102" width="12" height="12" rx="2" fill="#FCD34D" transform="rotate(-10 111 108)" />
                                </motion.g>

                                {/* 3. БРЫЗГИ */}
                                <motion.circle cx="70" cy="105" r="4" fill="#FF7B00"
                                    initial={{ scale: 0, y: 0 }}
                                    animate={{
                                        y: [0, -30, 0],
                                        scale: [0, 1.5, 0]
                                    }}
                                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
                                />
                                <motion.circle cx="135" cy="110" r="5" fill="#FF7B00"
                                    initial={{ scale: 0, y: 0 }}
                                    animate={{
                                        y: [0, -35, 0],
                                        scale: [0, 1.5, 0]
                                    }}
                                    transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity, delay: 1 }}
                                />

                                {/* 4. ЛОЖКА */}
                                <motion.g variants={spoonVariants} style={{ transformOrigin: '100px 20px' }}>
                                    <rect x="96" y="10" width="8" height="110" rx="4" fill="#92400E" />
                                    <ellipse cx="100" cy="115" rx="15" ry="22" fill="#78350F" />
                                    <ellipse cx="100" cy="112" rx="10" ry="16" fill="#451A03" />
                                </motion.g>

                                {/* 5. ПЕРЕДНЯЯ СТЕНКА ТАРЕЛКИ */}
                                <path d="M30 110 C 30 180, 170 180, 170 110 Z" fill="#FF7B00" />
                                <path d="M45 120 C 50 160, 150 160, 155 120" stroke="rgba(255,255,255,0.3)" strokeWidth="6" strokeLinecap="round" />

                            </motion.g>

                        </svg>
                    </div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-xl font-bold text-brand-dark tracking-widest uppercase"
                    >
                        {text}
                    </motion.h2>

                </motion.div>
            )}
        </AnimatePresence>
    )
}