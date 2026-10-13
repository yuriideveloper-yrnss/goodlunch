'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '@/lib/tracking'
import { QuickOrderModal } from '@/components/ui/QuickOrderModal'

export default function StickyBottomCTA({ 
  lang, 
  dict,
  ctaText = 'Zamów dzień próbny 36 zł',
  isOld = false,
}: { 
  lang: string
  dict: any
  ctaText?: string
  isOld?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Trigger appearance once scrolled past 75% of window height (leaving hero)
      const threshold = window.innerHeight * 0.75
      setVisible(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleButtonClick = () => {
    trackEvent('sticky_bottom_cta_click', { lang, target: 'quick_order_modal' })
    setIsModalOpen(true)
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none md:hidden"
          >
            <div className="container mx-auto max-w-md pointer-events-auto pb-[env(safe-area-inset-bottom,0px)]">
              <button
                type="button"
                onClick={handleButtonClick}
                className="group flex items-center justify-between w-full bg-brand-orange hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-3.5 px-5 rounded-2xl shadow-xl shadow-brand-orange/40 transition-all duration-200 border border-orange-400/30"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                  <span className="text-base font-extrabold tracking-tight">{ctaText}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-xl text-sm font-black whitespace-nowrap flex-shrink-0">
                  <span className="whitespace-nowrap">36&nbsp;zł</span>
                  <span className="text-xs">➔</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickOrderModal
        isOpen={isModalOpen}
        onCloseAction={() => setIsModalOpen(false)}
        dict={dict}
        lang={lang}
        initialPackage="meals3"
        isOld={isOld}
      />
    </>
  )
}
