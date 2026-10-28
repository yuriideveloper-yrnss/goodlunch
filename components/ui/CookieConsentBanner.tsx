'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface CookieConsentBannerProps {
  lang: string
}

const COOKIE_CONTENT: Record<string, {
  title: string
  text: string
  policyLinkText: string
  acceptBtn: string
  rejectBtn: string
}> = {
  pl: {
    title: 'Dbamy o Twoją prywatność 🍪',
    text: 'Używamy plików cookies (własnych i zaufanych partnerów) w celach statystycznych, analitycznych i marketingowych, aby stale ulepszać jakość naszych usług i dopasowywać treści. Zgodnie z RODO możesz zaakceptować wszystkie cookies lub wybrać tylko niezbędne do działania serwisu.',
    policyLinkText: 'Polityka prywatności i cookies',
    acceptBtn: 'Zaakceptuj wszystkie',
    rejectBtn: 'Tylko niezbędne'
  },
  ua: {
    title: 'Ми поважаємо вашу приватність 🍪',
    text: 'Ми використовуємо файли cookie (власні та партнерські) для аналітики, статистики та маркетингу відповідно до стандартів ЄС (GDPR/RODO). Ви можете прийняти всі файли cookie або дозволити лише технічно необхідні для роботи сайту.',
    policyLinkText: 'Політика конфіденційності та cookies',
    acceptBtn: 'Прийняти всі',
    rejectBtn: 'Тільки необхідні'
  },
  en: {
    title: 'We value your privacy 🍪',
    text: 'We use cookies (first-party and trusted third-party) for statistical, analytical, and marketing purposes in full compliance with EU GDPR regulations. You can choose to accept all cookies or allow only strictly necessary ones.',
    policyLinkText: 'Privacy & Cookie Policy',
    acceptBtn: 'Accept all',
    rejectBtn: 'Only necessary'
  },
  ru: {
    title: 'Мы уважаем вашу конфиденциальность 🍪',
    text: 'Мы используем файлы cookie для веб-аналитики, статистики и персонализации в соответствии с регламентом ЕС (GDPR/RODO). Вы можете принять все файлы cookie или ограничиться только технически необходимыми.',
    policyLinkText: 'Политика конфиденциальности и cookies',
    acceptBtn: 'Принять все',
    rejectBtn: 'Только необходимые'
  },
  be: {
    title: 'Мы паважаем вашу прыватнасць 🍪',
    text: 'Мы выкарыстоўваем файлы cookie для аналітыкі, статыстыкі і маркетынгу ў адпаведнасці з патрабаваннямі GDPR (ЕС). Вы можаце прыняць усе файлы cookie альбо пакінуць толькі тэхнічна неабходныя.',
    policyLinkText: 'Палітыка прыватнасці і cookies',
    acceptBtn: 'Прыняць усе',
    rejectBtn: 'Толькі неабходныя'
  }
}

export default function CookieConsentBanner({ lang }: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const t = COOKIE_CONTENT[lang] || COOKIE_CONTENT.pl

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gl_cookie_consent')
      if (!stored) {
        // Small delay to prevent layout shift during initial hydration
        const timer = setTimeout(() => {
          setShowBanner(true)
        }, 600)
        return () => clearTimeout(timer)
      }
    } catch {
      // Storage unavailable
    }
  }, [])

  const applyConsent = (choice: 'all' | 'necessary') => {
    try {
      localStorage.setItem('gl_cookie_consent', choice)
      document.cookie = `gl_cookie_consent=${choice}; path=/; max-age=31536000; SameSite=Lax`

      if (typeof window !== 'undefined' && (window as any).gtag) {
        if (choice === 'all') {
          (window as any).gtag('consent', 'update', {
            ad_storage: 'granted',
            analytics_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted'
          })
        } else {
          (window as any).gtag('consent', 'update', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          })
        }
      }
    } catch (e) {
      console.error('Error saving cookie consent:', e)
    }

    setShowBanner(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={t.title}
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-lg z-50 pointer-events-auto"
        >
          <div className="bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/15 text-brand-dark">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 text-brand-orange rounded-2xl shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01" />
                  <path d="M16 15.5v.01" />
                  <path d="M12 12v.01" />
                  <path d="M11 17v.01" />
                  <path d="M7 13v.01" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-950 tracking-tight">
                  {t.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mt-1.5">
                  {t.text}{' '}
                  <Link
                    href={`/${lang}/privacy-policy`}
                    className="text-brand-orange hover:text-orange-700 underline font-medium transition-colors"
                  >
                    {t.policyLinkText}
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* GDPR / EDPB Compliant Equal-Prominence Action Buttons */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => applyConsent('necessary')}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border-2 border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 active:scale-[0.98] transition-all text-center flex items-center justify-center cursor-pointer min-h-[44px]"
              >
                {t.rejectBtn}
              </button>
              <button
                type="button"
                onClick={() => applyConsent('all')}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-brand-orange hover:bg-orange-600 text-white shadow-md shadow-brand-orange/25 active:scale-[0.98] transition-all text-center flex items-center justify-center cursor-pointer min-h-[44px]"
              >
                {t.acceptBtn}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
