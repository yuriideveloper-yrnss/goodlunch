'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMenuForDate, generateUpcomingDays } from '@/lib/menuData'
import { getTranslatedTitle } from '@/lib/menuTranslations'
import { useOrder } from '@/components/providers/OrderProvider'

export default function MenuCalendar({ dict, lang }: { dict: any, lang: string }) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [dates, setDates] = useState<Date[]>([])

    // Global State for Meal Package
    const { mealPackage } = useOrder()

    useEffect(() => {
        // Generate dates on client to avoid hydration mismatch
        const today = new Date()
        const upcoming = generateUpcomingDays(today, 14) // Two weeks
        setDates(upcoming)
        setSelectedDate(upcoming[0])
    }, [])

    if (!selectedDate || dates.length === 0) return null;

    const { weekNumber, menu } = getMenuForDate(selectedDate);
    const getLocale = (l: string) => {
        if (l === 'pl') return 'pl-PL';
        if (l === 'ua') return 'uk-UA';
        if (l === 'ru') return 'ru-RU';
        return 'en-US';
    }
    const locale = getLocale(lang);
    const formatter = new Intl.DateTimeFormat(locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });

    return (
        <section id="menu" className="py-24 bg-brand-bg overflow-hidden relative">
            <div className="container mx-auto px-4 mb-4">
                <h2 className="text-4xl font-bold text-brand-dark mb-2 text-center md:text-left">{dict.menu.title}</h2>
                <p className="text-gray-500 text-center md:text-left">{dict.menu.subtitle} ({lang === 'pl' ? 'Tydzień' : lang === 'ua' ? 'Тиждень' : lang === 'ru' ? 'Неделя' : 'Week'} {weekNumber})</p>
            </div>

            {/* Календарь (Скролл) */}
            <div className="container mx-auto px-4 mb-12 relative">
                {/* Scroll Wrapper */}
                <div className="relative flex items-center group">
                    {/* Left Arrow */}
                    <button
                        aria-label={lang === 'pl' ? 'Przewiń w lewo' : lang === 'ua' ? 'Прокрутити вліво' : lang === 'ru' ? 'Прокрутить влево' : 'Scroll left'}
                        onClick={() => {
                            const container = document.getElementById('calendar-scroll');
                            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                        }}
                        className="absolute left-0 z-10 -ml-4 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-brand-orange opacity-0 md:group-hover:opacity-100 transition-opacity disabled:opacity-0"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>

                    <div id="calendar-scroll" className="flex gap-3 overflow-x-auto pb-4 pt-2 px-2 scrollbar-hide snap-x w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {dates.map((date, idx) => {
                            const isSelected = selectedDate.toDateString() === date.toDateString();
                            const dateStr = formatter.format(date).toUpperCase();
                            const [weekday, dayMonth] = dateStr.split(' ');

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDate(date)}
                                    className={`flex-shrink-0 snap-start px-6 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[100px] border shadow-sm transition-all duration-300 ${isSelected
                                        ? 'bg-brand-orange border-brand-orange text-white scale-105 shadow-md shadow-brand-orange/40'
                                        : 'bg-white border-gray-100 text-gray-500 hover:border-brand-orange/30 hover:bg-orange-50/50'
                                        }`}
                                >
                                    <span className={`text-xs font-bold mb-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                                        {weekday}
                                    </span>
                                    <span className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-brand-dark'}`}>
                                        {date.getDate()}
                                    </span>
                                    <span className={`text-xs mt-1 ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                        {date.toLocaleString(locale, { month: 'short' })}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Right Arrow */}
                    <button
                        aria-label={lang === 'pl' ? 'Przewiń w prawo' : lang === 'ua' ? 'Прокрутити вправо' : lang === 'ru' ? 'Прокрутить вправо' : 'Scroll right'}
                        onClick={() => {
                            const container = document.getElementById('calendar-scroll');
                            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                        }}
                        className="absolute right-0 z-10 -mr-4 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-brand-orange opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>

            {/* Меню на выбранный день */}
            <div className="container mx-auto px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedDate.toDateString()}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {menu.dishes.map((dish, i) => {
                            return (
                                <motion.div
                                    key={dish.id}
                                    className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-50 flex flex-col h-full group pb-6"
                                    whileHover={{ y: -5 }}
                                >
                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col items-center text-center">
                                        <span className="text-[10px] font-extrabold tracking-widest text-brand-orange uppercase bg-brand-orange/10 px-3 py-1.5 rounded-full mb-4">
                                            {dict.menu[dish.type] || dish.type}
                                        </span>

                                        <h3 className="text-lg font-bold text-brand-dark flex-1">
                                            {getTranslatedTitle(dish.title, lang)}
                                        </h3>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}
