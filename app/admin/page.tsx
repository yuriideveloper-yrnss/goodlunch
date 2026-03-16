'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { week1Menu, week2Menu } from '@/lib/menuData'
import { menuTranslations } from '@/lib/menuTranslations'

type SidebarSection = 'orders' | 'menu'
type Language = 'pl' | 'ua' | 'ru' | 'en'

const STORAGE_KEY_W1 = 'admin_menu_week1_multilang'
const STORAGE_KEY_W2 = 'admin_menu_week2_multilang'
const DAY_NAMES_FULL = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя']
const DAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
const DISH_TYPE_LABELS: Record<string, string> = {
  breakfast: 'Сніданок', soup: 'Суп', main1: 'Основне 1', main2: 'Основне 2',
}
const DISH_TYPE_ICONS: Record<string, string> = {
  breakfast: '🍳', soup: '🍲', main1: '🍽️', main2: '🥘',
}
const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: 'pl', label: 'Polski', flag: '🇵🇱' },
  { id: 'ua', label: 'Українська', flag: '🇺🇦' },
  { id: 'ru', label: 'Русский', flag: '🇷🇺' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
]

// ─── SVG Country Flags (actual images, work on all OS) ───
function FlagSVG({ lang, size = 20 }: { lang: string; size?: number }) {
  const flags: Record<string, React.ReactNode> = {
    pl: (
      <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" rx="3" fill="#fff"/>
        <rect y="10" width="20" height="10" rx="0" fill="#DC143C"/>
        <rect y="17" width="20" height="3" rx="3" fill="#DC143C"/>
      </svg>
    ),
    ua: (
      <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" rx="3" fill="#FFD700"/>
        <rect width="20" height="10" rx="0" fill="#005BBB"/>
        <rect width="20" height="3" rx="3" fill="#005BBB"/>
      </svg>
    ),
    ru: (
      <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" rx="3" fill="#0039A6"/>
        <rect y="7" width="20" height="6" fill="#fff"/>
        <rect width="20" height="7" rx="3" ry="0" fill="#fff"/>
        <rect width="20" height="3" rx="3" fill="#fff"/>
        <rect y="7" width="20" height="6" fill="#fff"/>
        <rect y="14" width="20" height="6" rx="3" fill="#D52B1E"/>
        <rect y="17" width="20" height="3" rx="3" fill="#D52B1E"/>
      </svg>
    ),
    en: (
      <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" rx="3" fill="#012169"/>
        <path d="M0,0 L20,20 M20,0 L0,20" stroke="#fff" strokeWidth="3"/>
        <path d="M0,0 L20,20 M20,0 L0,20" stroke="#C8102E" strokeWidth="1.5"/>
        <path d="M10,0 V20 M0,10 H20" stroke="#fff" strokeWidth="5"/>
        <path d="M10,0 V20 M0,10 H20" stroke="#C8102E" strokeWidth="3"/>
      </svg>
    ),
  }
  return (
    <span className="inline-flex shrink-0 rounded-sm overflow-hidden" style={{ width: size, height: size }}>
      {flags[lang] || <span className="text-xs text-white/40">?</span>}
    </span>
  )
}

// ─── Better Flag SVGs ───
function CountryFlag({ lang, size = 22 }: { lang: string; size?: number }) {
  const countryMap: Record<string, string> = {
    pl: 'https://flagcdn.com/w40/pl.png',
    ua: 'https://flagcdn.com/w40/ua.png',
    ru: 'https://flagcdn.com/w40/ru.png',
    en: 'https://flagcdn.com/w40/gb.png',
  }
  const url = countryMap[lang]
  if (!url) return <span className="text-xs text-white/40">?</span>
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={lang}
      width={size}
      height={Math.round(size * 0.67)}
      style={{ borderRadius: 3, objectFit: 'cover', display: 'inline-block' }}
    />
  )
}

// ─── Helpers ───
function initMultilangMenu(defaultMenu: any[]) {
  return defaultMenu.map(day => ({
    ...day,
    dishes: day.dishes.map((dish: any) => {
      const e = menuTranslations[dish.title]
      return {
        type: dish.type,
        titles: {
          pl: e?.pl || dish.title, ua: e?.ua || dish.title,
          ru: e?.ru || dish.title, en: e?.en || dish.title,
        }
      }
    })
  }))
}

function loadMenuFromStorage(key: string, def: any[]) {
  if (typeof window === 'undefined') return initMultilangMenu(def)
  try { const s = localStorage.getItem(key); if (s) return JSON.parse(s) } catch {}
  return initMultilangMenu(def)
}

// ─── Icons ───
const IconOrders = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="2"/>
    <path d="M9 12h6M9 16h4"/>
  </svg>
)
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M3 12h18M3 18h18"/>
  </svg>
)
const IconRefresh = ({ spinning }: { spinning: boolean }) => (
  <svg className={spinning ? 'animate-spin' : ''} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
  </svg>
)
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)
const IconChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const IconChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
)

// ─── Toast Notification ───
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t) }, [onClose])
  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.9 }}
      className="fixed top-4 right-4 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl border border-violet-500/40 bg-[#1a1030] shadow-2xl shadow-violet-900/50 max-w-sm"
    >
      <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300 shrink-0 animate-bounce">
        <IconBell />
      </div>
      <div>
        <div className="text-white font-bold text-sm">Нове замовлення!</div>
        <div className="text-white/60 text-xs mt-0.5">{message}</div>
      </div>
      <button onClick={onClose} className="ml-2 text-white/30 hover:text-white/60 shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </motion.div>
  )
}

// ─── Stat Card ───
function StatCard({ label, value, gradient, icon, delay }: { label: string; value: number; gradient: string; icon: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 p-6 group"
      style={{ background: 'rgba(255,255,255,0.06)' }}
    >
      <div className="relative z-10">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg mb-4`}>
          {icon}
        </div>
        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-5xl font-black text-white">{value}</p>
      </div>
    </motion.div>
  )
}

// ─── Menu Editor ───
function MenuEditorSection() {
  const [weekNum, setWeekNum] = useState<1 | 2>(1)
  const [selectedDay, setSelectedDay] = useState(0)
  const [activeLang, setActiveLang] = useState<Language>('ua')
  const [w1, setW1] = useState(() => loadMenuFromStorage(STORAGE_KEY_W1, week1Menu))
  const [w2, setW2] = useState(() => loadMenuFromStorage(STORAGE_KEY_W2, week2Menu))
  const [saved, setSaved] = useState(false)

  const currentMenu = weekNum === 1 ? w1 : w2
  const setCurrentMenu = weekNum === 1 ? setW1 : setW2
  const currentDay = currentMenu[selectedDay]

  const handleDishChange = (i: number, lang: Language, val: string) => {
    setCurrentMenu(currentMenu.map((day: any, dIdx: number) => {
      if (dIdx !== selectedDay) return day
      const dishes = [...day.dishes]
      dishes[i] = { ...dishes[i], titles: { ...dishes[i].titles, [lang]: val } }
      return { ...day, dishes }
    }))
  }

  const autoTranslate = (i: number) => {
    const sourceTitle = currentDay.dishes[i].titles[activeLang]
    let found = null
    for (const key in menuTranslations) {
      const e = menuTranslations[key]
      if (Object.values(e).some((v: any) => v.toLowerCase() === sourceTitle.toLowerCase())) { found = e; break }
    }
    if (found) {
      setCurrentMenu(currentMenu.map((day: any, dIdx: number) => {
        if (dIdx !== selectedDay) return day
        const dishes = [...day.dishes]
        dishes[i] = { ...dishes[i], titles: found }
        return { ...day, dishes }
      }))
    } else {
      alert('Переклад не знайдено.')
    }
  }

  const handleSave = () => {
    localStorage.setItem(weekNum === 1 ? STORAGE_KEY_W1 : STORAGE_KEY_W2, JSON.stringify(currentMenu))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Редактор меню</h1>
          <p className="text-white/50 text-sm mt-1">Мультимовне керування стравами на тиждень</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 ${
            saved ? 'bg-emerald-500 text-white shadow-emerald-500/30'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50'
          }`}
        >
          <IconSave />
          {saved ? '✓ Збережено!' : 'Зберегти зміни'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Left sidebar */}
        <div className="space-y-3">
          {/* Week selector */}
          <div className="border border-white/10 rounded-xl p-1.5 flex gap-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {([1, 2] as const).map(w => (
              <button key={w} onClick={() => setWeekNum(w)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  weekNum === w ? 'bg-white/15 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
                }`}
              >
                Тиждень {w}
              </button>
            ))}
          </div>

          {/* Day list */}
          <div className="border border-white/10 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {DAY_NAMES_FULL.map((name, idx) => (
              <button key={idx} onClick={() => setSelectedDay(idx)}
                className={`w-full px-4 py-3.5 text-left text-sm transition-all flex items-center gap-3 border-b border-white/[0.06] last:border-0 ${
                  selectedDay === idx ? 'bg-gradient-to-r from-violet-600/40 to-indigo-600/20 text-white font-bold'
                    : 'text-white/60 hover:bg-white/[0.06] hover:text-white font-medium'
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black transition-all shrink-0 ${
                  selectedDay === idx ? 'bg-violet-500 text-white' : 'bg-white/10 text-white/40'
                }`}>{DAY_SHORT[idx]}</span>
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="border border-white/10 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {/* Lang tabs */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex gap-2">
              {LANGUAGES.map(lang => (
                <button key={lang.id} onClick={() => setActiveLang(lang.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    activeLang === lang.id
                      ? 'bg-white/15 border-white/25 text-white shadow-sm'
                      : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
                  }`}
                >
                  <CountryFlag lang={lang.id} size={18} />
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
            <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest">
              {DAY_NAMES_FULL[selectedDay]} · Тиждень {weekNum}
            </span>
          </div>

          {/* Dishes */}
          <div className="p-6 space-y-5">
            {currentDay.dishes.map((dish: any, i: number) => (
              <div key={i} className="group relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{DISH_TYPE_ICONS[dish.type]}</span>
                    <label className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">
                      {DISH_TYPE_LABELS[dish.type]}
                    </label>
                  </div>
                  <button onClick={() => autoTranslate(i)}
                    className="text-[11px] font-bold text-violet-300 hover:text-violet-200 uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all px-2 py-1 rounded-lg hover:bg-violet-500/10"
                  >
                    ✨ Автоперекладач
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={dish.titles[activeLang]}
                    onChange={e => handleDishChange(i, activeLang, e.target.value)}
                    className="w-full border border-white/15 rounded-xl px-4 py-3.5 text-white font-semibold text-base focus:outline-none focus:border-violet-500/70 transition-all placeholder-white/20"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    placeholder="Назва страви..."
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <CountryFlag lang={activeLang} size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Status config
const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string; select: string }> = {
  'New':         { label: 'Новий',         dot: 'bg-sky-400',     badge: 'bg-sky-400/20 text-sky-200 border-sky-400/40',     select: 'bg-[#0d2035] text-sky-200 border-sky-400/50' },
  'In Progress': { label: 'В процесі',     dot: 'bg-amber-400',   badge: 'bg-amber-400/20 text-amber-200 border-amber-400/40',   select: 'bg-[#231a06] text-amber-200 border-amber-400/50' },
  'Paid':        { label: 'Оплачено',      dot: 'bg-emerald-400', badge: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/40', select: 'bg-[#082017] text-emerald-200 border-emerald-400/50' },
  'No Answer':   { label: 'Без відповіді', dot: 'bg-red-400',     badge: 'bg-red-400/20 text-red-200 border-red-400/40',     select: 'bg-[#200d0d] text-red-200 border-red-400/50' },
  'Cancelled':   { label: 'Скасовано',     dot: 'bg-white/30',    badge: 'bg-white/10 text-white/50 border-white/20',     select: 'bg-white/[0.07] text-white/50 border-white/20' },
}

// ─── Orders Section ───
function OrdersSection({ orders, onDelete, onUpdateOrder, lastRefresh, isRefreshing, onRefresh, autoRefresh, setAutoRefresh, onSearchChange }: {
  orders: any[]; onDelete: (id: string) => void; onUpdateOrder: (id: string, updates: any) => void
  lastRefresh: Date | null; isRefreshing: boolean; onRefresh: () => void; autoRefresh: boolean; setAutoRefresh: (v: boolean) => void
  onSearchChange: (val: string) => void
}) {
  const getDeliveryDate = (order: any) => {
    if (order.deliveryDate) return order.deliveryDate
    const created = new Date(order.createdAt)
    const daysToAdd = order.deliveryDay === 'day_after' ? 2 : 1
    created.setDate(created.getDate() + daysToAdd)
    const d = created.getDate().toString().padStart(2, '0')
    const m = (created.getMonth() + 1).toString().padStart(2, '0')
    return `${d}.${m}`
  }
  const stats = [
    { label: 'Всього',    value: orders.length,                                        gradient: 'from-slate-400 to-slate-600',   icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
    { label: 'Нові',      value: orders.filter(o => o.status === 'New').length,        gradient: 'from-sky-400 to-blue-600',      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg> },
    { label: 'В процесі', value: orders.filter(o => o.status === 'In Progress').length, gradient: 'from-amber-400 to-orange-600', icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: 'Оплачено',  value: orders.filter(o => o.status === 'Paid').length,       gradient: 'from-emerald-400 to-green-600', icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
  ]

  const MESSENGER_CLS: Record<string, string> = {
    telegram: 'bg-sky-400/20 text-sky-200 border-sky-400/30',
    whatsapp: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30',
    viber:    'bg-violet-400/20 text-violet-200 border-violet-400/30',
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.07} />)}
      </div>

      {/* CRM Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-violet-400 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
          <input
            type="text"
            placeholder="Пошук за ім'ям, телефоном або адресою..."
            className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white font-medium focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] transition-all"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onRefresh} disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <IconRefresh spinning={isRefreshing} />
            {isRefreshing ? 'Оновлення...' : 'Оновити'}
          </motion.button>

          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              autoRefresh ? 'bg-violet-500/20 border-violet-500/40 text-violet-200' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-violet-400 animate-pulse' : 'bg-white/20'}`} />
            Автооновлення 30с
          </button>
        </div>

        {lastRefresh && (
          <span className="text-white/30 text-xs">
            Оновлено: {lastRefresh.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-2xl border border-white/10 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center text-3xl mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>📭</div>
            <p className="text-white/50 font-semibold">Замовлень поки немає</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Дата', 'Клієнт', 'Адреса', 'Замовлення', 'Мова', 'Статус', ''].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-[10px] font-black text-white/35 uppercase tracking-[0.18em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any, idx) => {
                  const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG['New']
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + idx * 0.03 }}
                      className="group border-b border-white/[0.06] last:border-0 hover:bg-white/[0.04] transition-colors duration-200"
                    >
                      {/* Date */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <div className="text-white font-bold text-sm">{new Date(order.createdAt).toLocaleDateString('uk-UA')}</div>
                        <div className="text-white/40 text-[11px] mt-0.5">{new Date(order.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>

                      {/* Client */}
                      <td className="px-5 py-5">
                        <div className="font-bold text-white text-sm">{order.name || 'Анонім'}</div>
                        <div className="text-white/50 text-xs font-medium mt-0.5 font-mono">{order.phone}</div>
                        {order.messenger && (
                          <span className={`mt-2 inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${MESSENGER_CLS[order.messenger] || 'bg-white/10 text-white/40 border-white/15'}`}>
                            {order.messenger}
                          </span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="px-5 py-5">
                        <div className="text-white/80 text-sm font-semibold max-w-[180px]">
                          вул. {order.street || '–'}, {order.house || '–'}
                        </div>
                        <div className="text-white/35 text-[11px] mt-0.5">кв. {order.apt || '–'} · пов. {order.floor || '–'}</div>
                        <div className="mt-2.5 flex items-center gap-2">
                          <div className="flex items-center bg-white/[0.07] border border-white/10 rounded-xl p-1 gap-1">
                            <input
                              type="text"
                              defaultValue={getDeliveryDate(order)}
                              onBlur={(e) => {
                                if (e.target.value !== getDeliveryDate(order)) {
                                  onUpdateOrder(order.id, { deliveryDate: e.target.value })
                                }
                              }}
                              className="w-[50px] bg-transparent text-[11px] font-black text-white text-center focus:outline-none focus:text-violet-300 transition-all font-mono"
                            />
                            <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                              order.deliveryDay === 'tomorrow'
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}>
                              {order.deliveryDay === 'tomorrow' ? 'Завтра' : 'Після'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Order */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                          <span className="text-white font-bold text-sm">{order.package === 'meals3' ? '3 Страви' : '4 Страви'}</span>
                        </div>
                        <span className="inline-flex px-2.5 py-1.5 rounded-lg border border-white/15 text-white/70 text-[11px] font-bold" style={{ background: 'rgba(255,255,255,0.07)' }}>
                          {order.calories} kcal · <span className="text-emerald-300 ml-1">{order.price} zł</span>
                        </span>
                      </td>

                      {/* Language */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1.5">
                          <CountryFlag lang={order.lang || 'unknown'} size={24} />
                          <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">{order.lang || '?'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => onUpdateOrder(order.id, { status: e.target.value })}
                            className={`appearance-none cursor-pointer pl-3.5 pr-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border outline-none transition-all ${sc.select}`}
                          >
                            {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                              <option key={val} value={val}>{cfg.label}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center opacity-70">
                            <IconChevronDown />
                          </div>
                        </div>
                      </td>

                      {/* Delete */}
                      <td className="px-5 py-5">
                        <button
                          onClick={() => onDelete(order.id)}
                          className="w-9 h-9 flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all active:scale-90"
                        >
                          <IconTrash />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ─── Main Admin Page ───
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [authHeader, setAuthHeader] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeSection, setActiveSection] = useState<SidebarSection>('orders')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const prevOrderIdsRef = useRef<Set<string>>(new Set())
  const authRef = useRef('')

  useEffect(() => { if (error) setError('') }, [login, password])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      })
      if (res.ok) {
        const h = `Basic ${btoa(`${login}:${password}`)}`
        authRef.current = h
        setAuthHeader(h); setIsAuthenticated(true); fetchOrders(h)
        // Request browser notification permission
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
          Notification.requestPermission()
        }
      } else { setError('Невірний логін або пароль') }
    } catch { setError('Помилка сервера.') } finally { setIsLoading(false) }
  }

  const fetchOrders = useCallback(async (header?: string) => {
    const h = header || authRef.current
    if (!h) return
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/admin/orders', { headers: { 'Authorization': h } })
      if (res.ok) {
        const data = await res.json()
        setOrders(prev => {
          // Detect new orders
          const prevIds = prevOrderIdsRef.current
          const newOnes = data.filter((o: any) => !prevIds.has(o.id))
          if (prevIds.size > 0 && newOnes.length > 0) {
            const msg = `${newOnes[0].name || 'Анонім'} · ${newOnes[0].package === 'meals3' ? '3 страви' : '4 страви'}`
            setToast(msg)
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification('🔔 GoodLunch: Нове замовлення!', { body: msg, icon: '/favicon.ico' })
            }
          }
          prevOrderIdsRef.current = new Set(data.map((o: any) => o.id))
          return data
        })
        setLastRefresh(new Date())
      } else if (res.status === 401) {
        setIsAuthenticated(false)
      }
    } catch (e) { console.error(e) } finally { setIsRefreshing(false) }
  }, [])

  // Auto-refresh
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return
    const interval = setInterval(() => fetchOrders(), 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, autoRefresh, fetchOrders])

  // Update ref when authHeader changes
  useEffect(() => { authRef.current = authHeader }, [authHeader])

  const deleteOrder = async (id: string) => {
    if (!window.confirm('Видалити замовлення?')) return
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setOrders(prev => prev.filter((o: any) => o.id !== id))
        prevOrderIdsRef.current.delete(id)
      }
    } catch (e) { console.error(e) }
  }

  const updateOrder = async (id: string, updates: any) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify({ id, ...updates })
      })
      setOrders(orders.map((o: any) => o.id === id ? { ...o, ...updates } : o))
    } catch (e) { console.error(e) }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify({ id, status })
      })
      setOrders(orders.map((o: any) => o.id === id ? { ...o, status } : o))
    } catch (e) { console.error(e) }
  }

  const newCount = orders.filter(o => o.status === 'New').length

  // ─── Login Screen ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
        style={{ background: 'radial-gradient(ellipse at 60% 30%, #1a0a2e 0%, #0d0d1a 60%, #060609 100%)' }}>
        <div className="absolute top-[-15%] right-[10%] w-[500px] h-[500px] rounded-full bg-violet-700/20 blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-700/15 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="rounded-3xl border border-white/[0.12] overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)' }}>
            <div className="h-[3px] bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600" />
            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.7, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-700 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-violet-500/40 mb-6"
                >
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
                <h2 className="text-3xl font-black text-white tracking-tight">GoodLunch</h2>
                <p className="text-white/40 text-sm mt-2">Панель адміністратора</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {[
                  { label: 'Логін', type: 'text', val: login, set: setLogin, placeholder: 'Введіть логін' },
                  { label: 'Пароль', type: 'password', val: password, set: setPassword, placeholder: '••••••••••••' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">{f.label}</label>
                    <input
                      type={f.type} required value={f.val} placeholder={f.placeholder}
                      onChange={e => f.set(e.target.value)}
                      className="w-full border border-white/15 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/70 transition-all"
                      style={{ background: 'rgba(255,255,255,0.07)' }}
                    />
                  </div>
                ))}

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-red-300 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  type="submit" disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold text-white text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-500/30 transition-all mt-2 disabled:opacity-60"
                >
                  {isLoading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    : 'Увійти до панелі'}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Dashboard ───
  const SIDEBAR_W = isCollapsed ? 80 : 260

  const filteredOrders = orders.filter(o => {
    const s = searchTerm.toLowerCase()
    return (
      (o.name || '').toLowerCase().includes(s) ||
      (o.phone || '').toLowerCase().includes(s) ||
      (o.street || '').toLowerCase().includes(s) ||
      (o.house || '').toLowerCase().includes(s)
    )
  })

  return (
    <div className="min-h-screen flex" style={{ background: '#0c0c15' }}>
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-100" style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 70%)' }} />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-[60] lg:hidden" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: SIDEBAR_W }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full z-[70] flex flex-col border-r shrink-0"
        style={{ background: 'rgba(12,10,24,0.97)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}
      >
        <div className="flex flex-col h-full py-6 overflow-hidden">
          {/* Logo area */}
          <div className="flex items-center px-5 mb-8 gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-violet-500/30 shrink-0">
              G
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div key="logo-text" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="overflow-hidden">
                  <div className="text-white font-black text-lg tracking-tight whitespace-nowrap">GoodLunch</div>
                  <div className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">Admin Panel</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-1.5">
            {[
              { id: 'orders' as SidebarSection, label: 'Замовлення',  Icon: IconOrders, badge: newCount },
              { id: 'menu'   as SidebarSection, label: 'Меню',         Icon: IconMenu,   badge: 0 },
            ].map(item => {
              const isActive = activeSection === item.id
              return (
                <button key={item.id}
                  onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3.5 py-3.5 rounded-xl text-sm font-semibold transition-all relative group ${
                    isCollapsed ? 'justify-center px-2' : 'px-4'
                  } ${isActive
                    ? 'bg-gradient-to-r from-violet-600/40 to-indigo-600/20 text-white border border-violet-500/25'
                    : 'text-white/55 hover:bg-white/[0.07] hover:text-white border border-transparent'
                  }`}
                >
                  {isActive && !isCollapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-violet-400 rounded-r-full" />}
                  <span className={`shrink-0 ${isActive ? 'text-violet-300' : ''}`}><item.Icon /></span>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 text-left whitespace-nowrap">
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* New orders badge */}
                  {item.badge > 0 && (
                    <span className="shrink-0 min-w-[24px] h-6 flex items-center justify-center px-1.5 text-[11px] font-black rounded-full bg-violet-500 text-white shadow-lg shadow-violet-500/50 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {/* Tooltip */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#1a1530] border border-white/15 text-white text-[11px] font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-[100]">
                      {item.label} {item.badge > 0 && `(${item.badge})`}
                    </div>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Collapse toggle */}
          <div className="px-3 pt-4 border-t border-white/[0.08]">
            <button onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-full items-center gap-3 px-4 py-3 rounded-xl text-white/35 hover:text-white/60 hover:bg-white/[0.06] transition-all text-xs font-semibold"
            >
              <span className="shrink-0">{isCollapsed ? <IconChevronRight /> : <IconChevronLeft />}</span>
              {!isCollapsed && <span>Згорнути</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <motion.div
        animate={{ marginLeft: SIDEBAR_W }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col min-w-0 relative z-10"
      >
        {/* Topbar */}
        <header className="sticky top-0 z-50 px-6 py-4 flex items-center gap-4 border-b"
          style={{ background: 'rgba(12,12,21,0.90)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 flex items-center gap-3">
            <h1 className="text-base font-bold text-white">
              {activeSection === 'orders' ? 'Замовлення' : 'Редактор меню'}
            </h1>
            {activeSection === 'orders' && orders.length > 0 && (
              <span className="px-2.5 py-1 rounded-lg text-white/50 text-xs font-bold border border-white/10" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {orders.length} записів
              </span>
            )}
            {/* Live indicator if auto-refresh on */}
            {autoRefresh && activeSection === 'orders' && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-emerald-300 text-xs font-bold border border-emerald-500/20" style={{ background: 'rgba(52,211,153,0.08)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            )}
          </div>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-600/30 border border-violet-500/30 flex items-center justify-center text-violet-200 font-bold text-xs">
            YU
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {activeSection === 'orders' ? (
                <OrdersSection
                  orders={filteredOrders}
                  onDelete={deleteOrder}
                  onUpdateOrder={updateOrder}
                  lastRefresh={lastRefresh}
                  isRefreshing={isRefreshing}
                  onRefresh={() => fetchOrders()}
                  autoRefresh={autoRefresh}
                  setAutoRefresh={setAutoRefresh}
                  onSearchChange={setSearchTerm}
                />
              ) : (
                <MenuEditorSection />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  )
}
