'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { week1Menu, week2Menu } from '@/lib/menuData'
import { menuTranslations } from '@/lib/menuTranslations'

// ─────────────────── Types ───────────────────
type SidebarSection = 'orders' | 'menu'
type Language = 'pl' | 'ua' | 'ru' | 'en'

const STORAGE_KEY_W1_TRANSLATED = 'admin_menu_week1_multilang'
const STORAGE_KEY_W2_TRANSLATED = 'admin_menu_week2_multilang'

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
const DAY_NAMES_FULL = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя']
const DISH_TYPE_LABELS = {
    breakfast: '🍳 Сніданок',
    soup: '🍲 Суп',
    main1: '🍽️ Основне 1',
    main2: '🥘 Основне 2',
}

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
    { id: 'pl', label: 'Polski', flag: '🇵🇱' },
    { id: 'ua', label: 'Українська', flag: '🇺🇦' },
    { id: 'ru', label: 'Русский', flag: '🇷🇺' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
]

// ─────────────────── Helpers ───────────────────
function initMultilangMenu(defaultMenu: any[]) {
    return defaultMenu.map(day => ({
        ...day,
        dishes: day.dishes.map((dish: any) => {
            // Try to find translations in our dictionary
            const dictEntry = menuTranslations[dish.title]
            return {
                type: dish.type,
                titles: {
                    pl: dictEntry?.pl || dish.title,
                    ua: dictEntry?.ua || dish.title,
                    ru: dictEntry?.ru || dish.title,
                    en: dictEntry?.en || dish.title,
                }
            }
        })
    }))
}

function loadMenuFromStorage(weekKey: string, defaultMenu: any[]) {
    if (typeof window === 'undefined') return initMultilangMenu(defaultMenu)
    try {
        const stored = localStorage.getItem(weekKey)
        if (stored) return JSON.parse(stored)
    } catch {}
    return initMultilangMenu(defaultMenu)
}

// ─────────────────── Menu Editor Section ───────────────────
function MenuEditorSection() {
    const [weekNum, setWeekNum] = useState<1 | 2>(1)
    const [selectedDay, setSelectedDay] = useState(0)
    const [activeLang, setActiveLang] = useState<Language>('ua')
    const [w1, setW1] = useState(() => loadMenuFromStorage(STORAGE_KEY_W1_TRANSLATED, week1Menu))
    const [w2, setW2] = useState(() => loadMenuFromStorage(STORAGE_KEY_W2_TRANSLATED, week2Menu))
    const [saved, setSaved] = useState(false)

    const currentMenu = weekNum === 1 ? w1 : w2
    const setCurrentMenu = weekNum === 1 ? setW1 : setW2
    const currentDay = currentMenu[selectedDay]

    const handleDishChange = (dishIndex: number, lang: Language, newVal: string) => {
        const updated = currentMenu.map((day: any, dIdx: number) => {
            if (dIdx !== selectedDay) return day
            const newDishes = [...day.dishes]
            newDishes[dishIndex] = {
                ...newDishes[dishIndex],
                titles: { ...newDishes[dishIndex].titles, [lang]: newVal }
            }
            return { ...day, dishes: newDishes }
        })
        setCurrentMenu(updated)
    }

    const autoTranslate = (dishIndex: number) => {
        const dish = currentDay.dishes[dishIndex]
        const sourceTitle = dish.titles[activeLang] || dish.titles.pl
        
        // Find in dictionary
        let foundEntry = null
        for (const key in menuTranslations) {
            const entry = menuTranslations[key]
            if (Object.values(entry).some(v => v.toLowerCase() === sourceTitle.toLowerCase())) {
                foundEntry = entry
                break
            }
        }

        if (foundEntry) {
            const updated = currentMenu.map((day: any, dIdx: number) => {
                if (dIdx !== selectedDay) return day
                const newDishes = [...day.dishes]
                newDishes[dishIndex] = {
                    ...newDishes[dishIndex],
                    titles: {
                        pl: foundEntry.pl,
                        ua: foundEntry.ua,
                        ru: foundEntry.ru,
                        en: foundEntry.en,
                    }
                }
                return { ...day, dishes: newDishes }
            })
            setCurrentMenu(updated)
        } else {
            alert('Переклад для цієї страви не знайдено в базі даних.')
        }
    }

    const handleSave = () => {
        const key = weekNum === 1 ? STORAGE_KEY_W1_TRANSLATED : STORAGE_KEY_W2_TRANSLATED
        localStorage.setItem(key, JSON.stringify(currentMenu))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                        Редактор <span className="text-brand-orange">Меню</span>
                    </h1>
                    <p className="text-zinc-500 mt-1">Керування мультиязичними стравами</p>
                </div>
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className={`px-6 py-3 rounded-2xl shadow-lg shadow-brand-orange/20 text-sm font-bold transition-all ${saved ? 'bg-green-500 text-white' : 'bg-brand-orange text-white hover:bg-orange-500'}`}
                    >
                        {saved ? '✓ Збережено!' : 'Зберегти зміни'}
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
                {/* Left col: Week & Day sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-zinc-200">
                        <div className="grid grid-cols-2 gap-1">
                            {([1, 2] as const).map(w => (
                                <button
                                    key={w}
                                    onClick={() => setWeekNum(w)}
                                    className={`py-2 rounded-xl text-xs font-bold transition-all ${weekNum === w ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}
                                >
                                    Тиждень {w}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                        {DAY_NAMES.map((name, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedDay(idx)}
                                className={`w-full px-5 py-3.5 text-left font-bold text-sm transition-all border-b border-zinc-100 last:border-0 ${selectedDay === idx ? 'bg-brand-orange/10 text-brand-orange' : 'text-zinc-600 hover:bg-zinc-50'}`}
                            >
                                <span className="mr-3 text-xs opacity-40">{idx + 1}</span>
                                {DAY_NAMES_FULL[idx]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right col: Dish Editor */}
                <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.id}
                                    onClick={() => setActiveLang(lang.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${activeLang === lang.id ? 'bg-white border-zinc-300 shadow-sm text-zinc-900' : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-600'}`}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            {DAY_NAMES_FULL[selectedDay]} • Тиждень {weekNum}
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {currentDay.dishes.map((dish: any, i: number) => (
                            <div key={i} className="group relative">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">
                                        {DISH_TYPE_LABELS[dish.type as keyof typeof DISH_TYPE_LABELS]}
                                    </label>
                                    <button 
                                        onClick={() => autoTranslate(i)}
                                        className="text-[10px] font-bold text-brand-orange hover:text-orange-600 uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span>✨</span> Автоматичний переклад
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={dish.titles[activeLang]}
                                        onChange={e => handleDishChange(i, activeLang, e.target.value)}
                                        className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:outline-none focus:border-brand-orange/30 focus:bg-white transition-all text-lg"
                                        placeholder="Введіть назву страви..."
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-30 pointer-events-none">
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

// ─────────────────── Lang Badge ───────────────────
const LANG_COLORS: Record<string, string> = {
    pl: 'bg-red-100 text-red-700 border-red-200',
    ua: 'bg-blue-100 text-blue-700 border-blue-200',
    ru: 'bg-green-100 text-green-700 border-green-200',
    en: 'bg-purple-100 text-purple-700 border-purple-200',
    unknown: 'bg-zinc-100 text-zinc-500 border-zinc-200',
}
const LANG_FLAGS: Record<string, string> = { pl: '🇵🇱', ua: '🇺🇦', ru: '🇷🇺', en: '🇬🇧', unknown: '❓' }

// ─────────────────── Main Admin Page ───────────────────
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false) // for mobile
    const [isCollapsed, setIsCollapsed] = useState(false) // for desktop

    useEffect(() => {
        if (error) setError('')
    }, [login, password])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password })
            })
            if (res.ok) {
                const token = btoa(`${login}:${password}`)
                const headerValue = `Basic ${token}`
                setAuthHeader(headerValue)
                setIsAuthenticated(true)
                fetchOrders(headerValue)
            } else {
                setError('Невірний логін або пароль')
            }
        } catch (e) {
            setError('Помилка сервера. Спробуйте ще раз.')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchOrders = async (header = authHeader) => {
        setIsRefreshing(true)
        try {
            const res = await fetch('/api/admin/orders', { headers: { 'Authorization': header } })
            if (res.ok) {
                setOrders(await res.json())
            } else if (res.status === 401) {
                setIsAuthenticated(false)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsRefreshing(false)
        }
    }

    const deleteOrder = async (id: string) => {
        if (!window.confirm('Ви впевнені, що хочете назавжди видалити це замовлення?')) return
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify({ id })
            })
            if (res.ok) setOrders(orders.filter((o: any) => o.id !== id))
        } catch (e) {
            console.error(e)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify({ id, status })
            })
            setOrders(orders.map((o: any) => o.id === id ? { ...o, status } : o))
        } catch (e) {
            console.error(e)
        }
    }

    const sidebarItems = [
        { id: 'orders' as SidebarSection, label: 'Замовлення', icon: '📦', badge: orders.filter(o => o.status === 'New').length },
        { id: 'menu' as SidebarSection, label: 'Меню', icon: '🍽️', badge: null },
    ]

    // ─────────── Login Screen ───────────
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden px-4">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-orange/30 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-md w-full relative z-10"
                >
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="w-16 h-16 bg-gradient-to-tr from-brand-orange to-orange-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-brand-orange/40 mb-6"
                            >
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </motion.div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h2>
                            <p className="text-zinc-400 mt-2 text-sm">Введіть свої системні дані доступу</p>
                        </div>
                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Логін</label>
                                <input
                                    type="text" required
                                    className="appearance-none bg-black/40 border border-white/10 rounded-xl block w-full px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-transparent transition-all"
                                    placeholder="admin_username" value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Пароль</label>
                                <input
                                    type="password" required
                                    className="appearance-none bg-black/40 border border-white/10 rounded-xl block w-full px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-transparent transition-all"
                                    placeholder="••••••••••••" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="text-red-400 text-sm text-center font-medium"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            <button
                                type="submit" disabled={isLoading}
                                className="w-full relative flex justify-center py-4 px-4 font-bold rounded-xl text-white bg-brand-orange hover:bg-orange-500 hover:shadow-lg hover:shadow-brand-orange/25 active:scale-[0.98] transition-all disabled:opacity-75 overflow-hidden group"
                            >
                                {isLoading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Увійти'}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 font-sans flex overflow-x-hidden">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ 
                    width: isCollapsed ? 84 : 280,
                    x: isSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
                }}
                className={`fixed top-0 left-0 h-full bg-zinc-950 z-[70] flex flex-col transition-all border-r border-white/5 lg:translate-x-0 lg:static`}
            >
                <div className="flex flex-col h-full py-6">
                    {/* Header */}
                    <div className="px-6 mb-10 flex items-center justify-between overflow-hidden">
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                    className="whitespace-nowrap"
                                >
                                    <div className="text-white font-black text-2xl tracking-tighter">GoodLunch</div>
                                    <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Адмін панель</div>
                                </motion.div>
                            )}
                            {isCollapsed && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white font-black text-xl"
                                >
                                    G
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Collapse Toggle (Desktop) */}
                        <button 
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors ml-4"
                        >
                            <svg className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-4 space-y-2">
                        {sidebarItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false) }}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all relative group ${activeSection === item.id
                                    ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/30'
                                    : 'text-zinc-500 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className={`text-2xl transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                                            className="flex-1 text-left whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                
                                {item.badge !== null && item.badge > 0 && (
                                    <span className={`min-w-[20px] h-5 flex items-center justify-center text-[10px] font-black rounded-full ${activeSection === item.id ? 'bg-white/20 text-white' : 'bg-brand-orange text-white'}`}>
                                        {item.badge}
                                    </span>
                                )}

                                {/* Hover tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-zinc-800 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-xl border border-white/5 uppercase tracking-widest">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="px-6 mt-auto">
                        <div className={`text-zinc-700 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden transition-all ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                            © 2026 Admin
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-5 flex items-center gap-4 sticky top-0 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2.5 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    
                    <div className="flex-1 flex items-center gap-3">
                        <div className="hidden lg:block h-6 w-[1px] bg-zinc-200 mr-2" />
                        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                            {sidebarItems.find(i => i.id === activeSection)?.label}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {activeSection === 'orders' && (
                            <button
                                onClick={() => fetchOrders()}
                                disabled={isRefreshing}
                                className="px-4 py-2 bg-white border border-zinc-200 rounded-xl shadow-sm hover:border-zinc-300 text-sm font-bold text-zinc-700 transition-all flex items-center gap-2 disabled:opacity-75 group active:scale-95"
                            >
                                <svg className={`w-4 h-4 text-zinc-400 group-hover:text-brand-orange transition-colors ${isRefreshing ? 'animate-spin text-brand-orange' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="hidden sm:inline">Оновити</span>
                            </button>
                        )}
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-xs select-none">
                            YU
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6 md:p-10 flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        >
                            {activeSection === 'orders' ? (
                                <OrdersSection orders={orders} onDelete={deleteOrder} onUpdateStatus={updateStatus} />
                            ) : (
                                <MenuEditorSection />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `@keyframes shimmer { 100% { transform: translateX(100%); } }` }} />
        </div>
    )
}

// ─────────────────── Orders Section ───────────────────
function OrdersSection({
    orders,
    onDelete,
    onUpdateStatus
}: {
    orders: any[]
    onDelete: (id: string) => void
    onUpdateStatus: (id: string, status: string) => void
}) {
    return (
        <div className="max-w-[1600px] mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Всього', value: orders.length, color: 'text-zinc-900', bg: 'bg-white', icon: '📊' },
                    { label: 'Нові', value: orders.filter(o => o.status === 'New').length, color: 'text-blue-600', bg: 'bg-blue-50/50', icon: '✨' },
                    { label: 'Оплачено', value: orders.filter(o => o.status === 'Paid').length, color: 'text-green-600', bg: 'bg-green-50/50', icon: '✅' },
                    { label: 'В процесі', value: orders.filter(o => o.status === 'In Progress').length, color: 'text-orange-600', bg: 'bg-orange-50/50', icon: '🔥' },
                ].map(s => (
                    <div key={s.label} className={`p-6 rounded-3xl border border-zinc-200 shadow-sm ${s.bg}`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xl">{s.icon}</span>
                        </div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div className="bg-white shadow-2xl shadow-zinc-200/50 border border-zinc-200 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-200">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-100">
                                {['Дата', 'Клієнт', 'Адреса', 'Замовлення', 'Мова', 'Статус', 'Дії'].map(h => (
                                    <th key={h} className="px-6 py-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {orders.map((order: any, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={order.id}
                                    className="group hover:bg-zinc-50/50 transition-colors"
                                >
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="font-bold text-zinc-900 text-sm">{new Date(order.createdAt).toLocaleDateString('uk-UA')}</div>
                                        <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mt-1">{new Date(order.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="font-black text-zinc-900 text-base leading-tight mb-1">{order.name || 'Анонім'}</div>
                                        <div className="text-zinc-500 font-bold text-sm tracking-tight">{order.phone}</div>
                                        <div className="mt-2 flex">
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${order.messenger === 'telegram' ? 'bg-blue-50 text-blue-600 border-blue-100' : order.messenger === 'whatsapp' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-zinc-50 text-zinc-600 border-zinc-100'}`}>
                                                {order.messenger || 'no messenger'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-zinc-800 text-sm font-bold leading-relaxed max-w-[200px]">
                                            Вул. {order.street || '-'}, будинок {order.house || '-'}
                                        </div>
                                        <div className="text-zinc-400 text-[11px] font-semibold mt-1">
                                            кв. {order.apt || '-'}, пов. {order.floor || '-'}
                                        </div>
                                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black border border-indigo-100 uppercase tracking-wider">
                                            {order.deliveryDay === 'tomorrow' ? '📦 Завтра' : '📦 Післязавтра'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                                                <span className="text-zinc-900 font-black text-sm">{order.package === 'meals3' ? '3 Страви' : '4 Страви'}</span>
                                            </div>
                                            <div className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-black w-fit uppercase tracking-tighter">
                                                {order.calories} kcal • {order.price} zł
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${LANG_COLORS[order.lang || 'unknown']}`}>
                                            <span className="text-sm grayscale-0">{LANG_FLAGS[order.lang || 'unknown']}</span>
                                            <span>{order.lang || '?'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="relative group/select">
                                            <select
                                                value={order.status}
                                                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                                                className={`appearance-none block w-full pl-4 pr-10 py-2.5 text-xs font-black uppercase tracking-[0.1em] outline-none ring-2 ring-inset focus:ring-brand-orange/50 rounded-2xl transition-all cursor-pointer shadow-sm
                                                    ${order.status === 'New' ? 'text-blue-700 bg-blue-50 ring-blue-200' :
                                                    order.status === 'Paid' ? 'text-green-700 bg-green-50 ring-green-200' :
                                                    order.status === 'No Answer' ? 'text-red-700 bg-red-50 ring-red-200' :
                                                    order.status === 'Cancelled' ? 'text-zinc-500 bg-zinc-100 ring-zinc-200' :
                                                    'text-orange-700 bg-orange-50 ring-orange-200'}`}
                                            >
                                                <option value="New">Новий</option>
                                                <option value="In Progress">В процесі</option>
                                                <option value="Paid">Оплачено</option>
                                                <option value="No Answer">Немає відповіді</option>
                                                <option value="Cancelled">Скасовано</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 group-hover/select:text-zinc-600">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <button
                                            onClick={() => onDelete(order.id)}
                                            className="w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                                            title="Видалити"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
