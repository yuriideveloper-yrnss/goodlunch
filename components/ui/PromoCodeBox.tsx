'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '@/lib/tracking'
import { PRICING } from '@/lib/constants'

interface PromoCodeBoxProps {
  code?: string
  discountText?: string
  dict?: any
  variant?: 'compact' | 'box' | 'hero'
  className?: string
  source?: string
}

export function PromoCodeBox({
  code = PRICING.promoCode || 'Jesień',
  discountText = '-25%',
  dict,
  variant = 'box',
  className = '',
  source = 'general',
}: PromoCodeBoxProps) {
  const [copied, setCopied] = useState(false)

  const copyLabel = dict?.promo?.copy_btn || 'Kopiuj kod'
  const copiedLabel = dict?.promo?.copied || 'Skopiowano!'
  const helperText = dict?.promo?.helper || 'Wpisz kod w koszyku, aby otrzymać rabat -25% na całe zamówienie!'
  const titleText = dict?.promo?.label || 'Kod rabatowy na 1. zamówienie:'

  const handleCopy = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = code
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }

      setCopied(true)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(40)
        } catch {
          // ignore if vibration is blocked
        }
      }

      trackEvent('promo_code_copied', { code, discount: discountText, source })

      setTimeout(() => {
        setCopied(false)
      }, 2500)
    } catch (err) {
      console.error('Failed to copy promo code:', err)
    }
  }

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-brand-orange/30 rounded-xl px-3 py-1.5 shadow-xs ${className}`}
      >
        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-brand-dark">
          <span className="text-brand-orange font-black">{discountText}</span>
          <span className="text-gray-400 font-normal">kod:</span>
          <span className="bg-white px-2 py-0.5 rounded-md border border-brand-orange/20 font-mono tracking-wider font-extrabold text-brand-dark select-all">
            {code}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copyLabel}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none active:scale-95 ${
            copied
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-brand-orange hover:bg-orange-600 text-white shadow-xs'
          }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{copiedLabel}</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{copyLabel}</span>
            </>
          )}
        </button>
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className={`w-full max-w-sm sm:max-w-md bg-gradient-to-r from-orange-50/95 via-white/95 to-amber-50/95 backdrop-blur-md border-2 border-dashed border-brand-orange/40 rounded-2xl p-2.5 sm:p-3 shadow-md shadow-brand-orange/10 flex items-center justify-between gap-2 sm:gap-3 ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center font-black text-lg flex-shrink-0 shadow-inner">
            🏷️
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
              {titleText}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-base sm:text-lg font-black text-brand-dark tracking-wide select-all">
                {code}
              </span>
              <span className="text-xs font-extrabold text-brand-orange whitespace-nowrap">
                ({discountText})
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copyLabel}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-sm active:scale-95 ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-orange hover:bg-orange-600 text-white'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {copiedLabel}
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {copyLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    )
  }

  // Default 'box' variant (used in modals and checkout lead forms)
  return (
    <div
      className={`bg-gradient-to-br from-orange-50/90 to-amber-50/80 border border-brand-orange/30 rounded-2xl p-3.5 sm:p-4 text-left ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <span>🏷️</span>
          <span>{titleText}</span>
        </span>
        <span className="bg-brand-orange text-white text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
          {discountText}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 pl-3 border border-brand-orange/20 shadow-xs">
        <span className="font-mono text-lg font-black text-brand-dark tracking-wider flex-1 select-all">
          {code}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copyLabel}
          className={`py-2 px-3.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 flex-shrink-0 ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-orange hover:bg-orange-600 text-white shadow-xs'
          }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{copiedLabel}</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{copyLabel}</span>
            </>
          )}
        </button>
      </div>

      {helperText && (
        <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  )
}
