'use client'
import { useState, useEffect } from 'react'
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
  { id: 'pl', label: 'PL', flag: '🇵🇱' },
  { id: 'ua', label: 'UA', flag: '🇺🇦' },
  { id: 'ru', label: 'RU', flag: '🇷🇺' },
  { id: 'en', label: 'EN', flag: '🇬🇧' },
]
const LANG_FLAGS: Record<string, string> = { pl: '🇵🇱', ua: '🇺🇦', ru: '🇷🇺', en: '🇬🇧', unknown: '❓' }
const MESSENGER_STYLES: Record<string, string> = {
  telegram: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  whatsapp: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  viber: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
}

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

// ─── SVG Icons ───
const IconOrders = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="2"/>
    <path d="M9 12h6M9 16h4"/>
  </svg>
)
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 010 2h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 010-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z"/>
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
const IconChevron = ({ dir }: { dir: 'down' | 'left' | 'right' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: dir === 'left' ? 'rotate(0deg)' : dir === 'right' ? 'rotate(180deg)' : 'rotate(-90deg)' }}>
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
)

// ─── Stat Card ───
function StatCard({ label, value, icon, gradient, delay }: { label: string; value: number; icon: React.ReactNode; gradient: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-6 group hover:border-white/[0.15] transition-all duration-300"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient} opacity-[0.07]`} />
      <div className="relative z-10">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg mb-4`}>
          {icon}
        </div>
        <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-black text-white">{value}</p>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Редактор меню</h1>
          <p className="text-white/40 text-sm mt-1">Мультимовне керування стравами</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 ${
            saved
              ? 'bg-emerald-500 text-white shadow-emerald-500/30'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50'
          }`}
        >
          <IconSave />
          {saved ? '✓ Збережено!' : 'Зберегти зміни'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Left: week + days */}
        <div className="space-y-4">
          {/* Week selector */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-1.5 flex gap-1.5">
            {([1, 2] as const).map(w => (
              <button key={w} onClick={() => setWeekNum(w)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  weekNum === w ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60'
                }`}
              >
                Тиждень {w}
              </button>
            ))}
          </div>

          {/* Day list */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
            {DAY_NAMES_FULL.map((name, idx) => (
              <button key={idx} onClick={() => setSelectedDay(idx)}
                className={`w-full px-4 py-3.5 text-left font-semibold text-sm transition-all flex items-center gap-3 border-b border-white/[0.05] last:border-0 ${
                  selectedDay === idx
                    ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/20 text-white'
                    : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                  selectedDay === idx ? 'bg-violet-500 text-white' : 'bg-white/10 text-white/30'
                }`}>{DAY_SHORT[idx]}</span>
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Right: dish editor */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
          {/* Lang tabs */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-1.5">
              {LANGUAGES.map(lang => (
                <button key={lang.id} onClick={() => setActiveLang(lang.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    activeLang === lang.id
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-transparent border-transparent text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
            <span className="text-white/20 text-[11px] font-bold uppercase tracking-widest">
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
                    <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">
                      {DISH_TYPE_LABELS[dish.type]}
                    </label>
                  </div>
                  <button onClick={() => autoTranslate(i)}
                    className="text-[10px] font-bold text-violet-400 hover:text-violet-300 uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <span>✨</span> Автоперекладач
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={dish.titles[activeLang]}
                    onChange={e => handleDishChange(i, activeLang, e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white font-semibold text-base focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] transition-all placeholder-white/20"
                    placeholder="Назва страви..."
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-lg opacity-25 pointer-events-none">
                    {LANGUAGES.find(l => l.id === activeLang)?.flag}
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

// ─── Orders Section ───
function OrdersSection({ orders, onDelete, onUpdateStatus }: { orders: any[]; onDelete: (id: string) => void; onUpdateStatus: (id: string, status: string) => void }) {
  const stats = [
    { label: 'Всього', value: orders.length, gradient: 'from-slate-400 to-slate-600', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
    { label: 'Нові', value: orders.filter(o => o.status === 'New').length, gradient: 'from-sky-400 to-blue-600', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg> },
    { label: 'В процесі', value: orders.filter(o => o.status === 'In Progress').length, gradient: 'from-amber-400 to-orange-600', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: 'Оплачено', value: orders.filter(o => o.status === 'Paid').length, gradient: 'from-emerald-400 to-green-600', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
  ]

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.08} />)}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden"
      >
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-3xl mb-4">📭</div>
            <p className="text-white/40 font-semibold">Замовлень поки немає</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  {['Дата', 'Клієнт', 'Адреса', 'Замовлення', 'Мова', 'Статус', ''].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-[10px] font-black text-white/25 uppercase tracking-[0.2em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {orders.map((order: any, idx) => {
                  const statusConfig: Record<string, { label: string; cls: string }> = {
                    'New':         { label: 'Новий',         cls: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
                    'In Progress': { label: 'В процесі',     cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
                    'Paid':        { label: 'Оплачено',      cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
                    'No Answer':   { label: 'Без відповіді', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
                    'Cancelled':   { label: 'Скасовано',     cls: 'bg-white/[0.06] text-white/30 border-white/10' },
                  }
                  const sc = statusConfig[order.status] || statusConfig['New']

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.04 }}
                      className="group hover:bg-white/[0.03] transition-colors duration-200"
                    >
                      {/* Date */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <div className="text-white/80 font-bold text-sm">{new Date(order.createdAt).toLocaleDateString('uk-UA')}</div>
                        <div className="text-white/25 text-[10px] font-semibold mt-0.5">{new Date(order.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>

                      {/* Client */}
                      <td className="px-5 py-5">
                        <div className="font-bold text-white text-sm">{order.name || 'Анонім'}</div>
                        <div className="text-white/40 text-[12px] font-medium mt-0.5">{order.phone}</div>
                        {order.messenger && (
                          <span className={`mt-1.5 inline-flex px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${MESSENGER_STYLES[order.messenger] || 'bg-white/[0.06] text-white/30 border-white/10'}`}>
                            {order.messenger}
                          </span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="px-5 py-5">
                        <div className="text-white/70 text-sm font-medium max-w-[180px] leading-snug">
                          вул. {order.street || '–'}, {order.house || '–'}
                        </div>
                        <div className="text-white/25 text-[11px] mt-0.5">кв. {order.apt || '–'} · пов. {order.floor || '–'}</div>
                        <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[9px] font-black uppercase tracking-widest">
                          {order.deliveryDay === 'tomorrow' ? '📦 Завтра' : '📦 Післязавтра'}
                        </span>
                      </td>

                      {/* Order */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                          <span className="text-white font-bold text-sm">{order.package === 'meals3' ? '3 Страви' : '4 Страви'}</span>
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-white/[0.06] text-white/50 text-[10px] font-black border border-white/[0.08]">
                          {order.calories} kcal · {order.price} zł
                        </span>
                      </td>

                      {/* Lang */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <span className="text-xl">{LANG_FLAGS[order.lang || 'unknown']}</span>
                        <div className="text-white/25 text-[10px] font-black uppercase tracking-widest mt-0.5">{order.lang || '?'}</div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => onUpdateStatus(order.id, e.target.value)}
                            className={`appearance-none cursor-pointer pl-3 pr-8 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border outline-none transition-all ${sc.cls}`}
                          >
                            <option value="New">Новий</option>
                            <option value="In Progress">В процесі</option>
                            <option value="Paid">Оплачено</option>
                            <option value="No Answer">Без відповіді</option>
                            <option value="Cancelled">Скасовано</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-current opacity-60">
                            <IconChevron dir="down" />
                          </div>
                        </div>
                      </td>

                      {/* Delete */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <button
                          onClick={() => onDelete(order.id)}
                          className="w-9 h-9 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 active:scale-90"
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
        setAuthHeader(h); setIsAuthenticated(true); fetchOrders(h)
      } else { setError('Невірний логін або пароль') }
    } catch { setError('Помилка сервера.') } finally { setIsLoading(false) }
  }

  const fetchOrders = async (header = authHeader) => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/admin/orders', { headers: { 'Authorization': header } })
      if (res.ok) setOrders(await res.json())
      else if (res.status === 401) setIsAuthenticated(false)
    } catch (e) { console.error(e) } finally { setIsRefreshing(false) }
  }

  const deleteOrder = async (id: string) => {
    if (!window.confirm('Видалити замовлення?')) return
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify({ id })
      })
      if (res.ok) setOrders(orders.filter((o: any) => o.id !== id))
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 60% 40%, #1a0a2e 0%, #0d0d1a 60%, #060609 100%)' }}>
        {/* Ambient glows */}
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-sm w-full mx-4 relative z-10"
        >
          {/* Card */}
          <div className="rounded-3xl border border-white/[0.1] backdrop-blur-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {/* Purple top bar */}
            <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />

            <div className="p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.7, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-violet-500/30 mb-5"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
                <h2 className="text-2xl font-black text-white tracking-tight">GoodLunch Admin</h2>
                <p className="text-white/35 text-sm mt-1.5">Введіть дані для входу</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {[
                  { label: 'Логін', type: 'text', val: login, set: setLogin, placeholder: 'username' },
                  { label: 'Пароль', type: 'password', val: password, set: setPassword, placeholder: '••••••••' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-[11px] font-bold text-white/35 uppercase tracking-widest mb-1.5">{f.label}</label>
                    <input
                      type={f.type} required value={f.val} placeholder={f.placeholder}
                      onChange={e => f.set(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                ))}

                <AnimatePresence>
                  {error && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-sm font-medium text-center">
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  type="submit" disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all mt-2 disabled:opacity-60"
                >
                  {isLoading
                    ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                    : 'Увійти'}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Dashboard Layout ───
  return (
    <div className="min-h-screen flex" style={{ background: '#0e0e16' }}>
      {/* Ambient background glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-900/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 z-[60] lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        className="fixed top-0 left-0 h-full z-[70] flex flex-col border-r shrink-0"
        style={{
          background: 'rgba(15, 15, 25, 0.95)',
          borderColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex flex-col h-full py-5">
          {/* Logo */}
          <div className={`flex items-center overflow-hidden mb-8 ${isCollapsed ? 'px-3 justify-center' : 'px-5 justify-between'}`}>
            <AnimatePresence mode="wait">
              {isCollapsed ? (
                <motion.div key="icon"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-500/30"
                >G</motion.div>
              ) : (
                <motion.div key="full"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <div className="text-white font-black text-lg tracking-tight">GoodLunch</div>
                  <div className="text-white/25 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">Admin Panel</div>
                </motion.div>
              )}
            </AnimatePresence>
            {!isCollapsed && (
              <button onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg hover:bg-white/[0.08] text-white/20 hover:text-white/60 transition-all"
              >
                <IconChevron dir="left" />
              </button>
            )}
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 space-y-1">
            {([
              { id: 'orders' as SidebarSection, label: 'Замовлення', Icon: IconOrders, badge: newCount },
              { id: 'menu' as SidebarSection, label: 'Меню', Icon: IconMenu, badge: 0 },
            ]).map(item => {
              const isActive = activeSection === item.id
              return (
                <button key={item.id}
                  onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/20 text-white border border-violet-500/20'
                      : 'text-white/35 hover:bg-white/[0.05] hover:text-white/70 border border-transparent'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet-400 rounded-r-full" />}
                  <span className={`shrink-0 ${isActive ? 'text-violet-300' : ''}`}><item.Icon /></span>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                        className="flex-1 text-left whitespace-nowrap overflow-hidden">
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.badge > 0 && (
                    <span className={`shrink-0 min-w-[20px] h-5 flex items-center justify-center text-[10px] font-black rounded-full px-1.5 ${
                      isActive ? 'bg-violet-400/30 text-violet-200' : 'bg-violet-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {/* Tooltip when collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#1a1a2e] border border-white/10 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-[100] uppercase tracking-widest">
                      {item.label}
                    </div>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Expand button when collapsed */}
          {isCollapsed && (
            <div className="px-3 mb-2">
              <button onClick={() => setIsCollapsed(false)}
                className="hidden lg:flex w-full justify-center py-2 rounded-xl hover:bg-white/[0.05] text-white/20 hover:text-white/60 transition-all"
              >
                <IconChevron dir="right" />
              </button>
            </div>
          )}

          {/* Footer */}
          {!isCollapsed && (
            <div className="px-5 mt-2">
              <div className="text-white/15 text-[9px] font-bold uppercase tracking-widest">© 2026 GoodLunch</div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.div
        animate={{ marginLeft: isCollapsed ? 72 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col min-w-0 relative z-10"
      >
        {/* Topbar */}
        <header className="sticky top-0 z-50 px-6 py-4 flex items-center gap-4 border-b"
          style={{ background: 'rgba(14,14,22,0.85)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
          {/* Mobile menu */}
          <button onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 flex items-center gap-3">
            <h1 className="text-base font-bold text-white">
              {activeSection === 'orders' ? 'Замовлення' : 'Редактор меню'}
            </h1>
            {activeSection === 'orders' && orders.length > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/40 text-[11px] font-bold">
                {orders.length} записів
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeSection === 'orders' && (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => fetchOrders()}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all text-sm font-semibold disabled:opacity-50"
              >
                <IconRefresh spinning={isRefreshing} />
                <span className="hidden sm:inline">Оновити</span>
              </motion.button>
            )}

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold text-xs">
              YU
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              {activeSection === 'orders'
                ? <OrdersSection orders={orders} onDelete={deleteOrder} onUpdateStatus={updateStatus} />
                : <MenuEditorSection />
              }
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  )
}
