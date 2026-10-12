'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/tracking'

export default function Header({ lang }: { lang: string }) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Эффект: если проскроллили, добавляем тень и фон
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Перевод ссылок навигации (можно было бы передать через props, но для простоты сделаем локально или вынесем)
  const navText: Record<string, any> = {
    pl: { menu: 'Menu', price: 'Cennik', reviews: 'Opinie', faq: 'FAQ' },
    ua: { menu: 'Меню', price: 'Ціни', reviews: 'Відгуки', faq: 'Питання' },
    ru: { menu: 'Меню', price: 'Цены', reviews: 'Отзывы', faq: 'Частые вопросы' },
    en: { menu: 'Menu', price: 'Pricing', reviews: 'Reviews', faq: 'FAQ' },
  }
  const txt = navText[lang] || navText.en;

  // Смена языка в URL (заменяем первую часть пути)
  const getLangUrl = (newLang: string) => {
    if (!pathname) return `/${newLang}`
    const segments = pathname.split('/')
    segments[1] = newLang
    return segments.join('/') || '/'
  }

  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/` || pathname?.includes('/external/smartcatering') || pathname?.includes('/old')
  const getNavHref = (target: string) => {
    return isHomePage ? `#${target}` : `/${lang}#${target}`
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-2.5 sm:py-3.5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center gap-3">

        {/* ЛОГОТИП -> Инстаграм */}
        <a 
          href="https://www.instagram.com/goodlunch1/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 flex-shrink-0 cursor-pointer group"
          onClick={() => trackEvent('click_instagram_logo')}
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-brand-orange group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="GoodLunch Logo"
              fill
              sizes="40px"
              loading="lazy"
              className="object-cover"
            />
          </div>
          <span className="hidden sm:inline-block font-bold text-base sm:text-lg tracking-tight text-brand-dark">
            Good<span className="text-brand-orange">Lunch</span>
          </span>
        </a>

        {/* НАВИГАЦИЯ (Только на больших экранах) */}
        <nav className="hidden lg:flex gap-6 xl:gap-8 font-medium text-sm text-gray-600">
          <a href={getNavHref('menu')} className="hover:text-brand-orange transition-colors" onClick={() => trackEvent('nav_click', { target: 'menu' })}>{txt.menu}</a>
          <a href={getNavHref('cennik')} className="hover:text-brand-orange transition-colors" onClick={() => trackEvent('nav_click', { target: 'cennik' })}>{txt.price}</a>
          <a href={getNavHref('opinie')} className="hover:text-brand-orange transition-colors" onClick={() => trackEvent('nav_click', { target: 'opinie' })}>{txt.reviews}</a>
          <a href={getNavHref('faq')} className="hover:text-brand-orange transition-colors" onClick={() => trackEvent('nav_click', { target: 'faq' })}>{txt.faq}</a>
        </nav>

        {/* Переключатель языка (Флаги) — ВСЕГДА ВИДНО И НА МОБИЛКЕ, И НА ПК */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-lg sm:text-xl flex-shrink-0 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-200/50 shadow-sm">
          <Link 
            href={getLangUrl('pl')} 
            title="Polski" 
            className={`p-1 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-full hover:scale-115 transition-transform ${lang === 'pl' ? 'ring-2 ring-brand-orange bg-white shadow-xs' : 'opacity-55 grayscale hover:grayscale-0 hover:opacity-100'}`}
          >
            🇵🇱
          </Link>
          <Link 
            href={getLangUrl('ua')} 
            title="Українська" 
            className={`p-1 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-full hover:scale-115 transition-transform ${lang === 'ua' ? 'ring-2 ring-brand-orange bg-white shadow-xs' : 'opacity-55 grayscale hover:grayscale-0 hover:opacity-100'}`}
          >
            🇺🇦
          </Link>
          <Link 
            href={getLangUrl('ru')} 
            title="Русский" 
            className={`p-1 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-full hover:scale-115 transition-transform ${lang === 'ru' ? 'ring-2 ring-brand-orange bg-white shadow-xs' : 'opacity-55 grayscale hover:grayscale-0 hover:opacity-100'}`}
          >
            🇷🇺
          </Link>
          <Link 
            href={getLangUrl('en')} 
            title="English" 
            className={`p-1 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-full hover:scale-115 transition-transform ${lang === 'en' ? 'ring-2 ring-brand-orange bg-white shadow-xs' : 'opacity-55 grayscale hover:grayscale-0 hover:opacity-100'}`}
          >
            🇬🇧
          </Link>
        </div>

      </div>
    </header>
  )
}