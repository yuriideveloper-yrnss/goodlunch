"use client";
import React, { useState } from 'react';

// --- ICONS (Zero external packages needed, pure inline SVGs) ---
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const DropdownArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;

// --- TRANSLATIONS MATRIX ---
const TRANSLATIONS: Record<string, { months: string[]; weekdays: string[] }> = {
    pl: {
        months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
        weekdays: ["NIE", "PON", "WT", "ŚR", "CZW", "PT", "SOB"]
    },
    ua: {
        months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
        weekdays: ["НД", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]
    },
    ru: {
        months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        weekdays: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]
    },
    en: {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        weekdays: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    }
};

// --- HELPERS ---
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

// --- MAIN EXPORTED CALENDAR COMPONENT ---
export const AppleCalendarPicker = ({ isOpen, onClose, onDateTimeSelect, initialDate, lang = 'pl' }: any) => {
    const today = initialDate ? new Date(initialDate) : new Date(); // Defaults to current date
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    
    // Dropdown toggle state
    const [showDropdown, setShowDropdown] = useState(false);

    if (!isOpen) return null;

    // Load active locale translations
    const activeTranslation = TRANSLATIONS[lang] || TRANSLATIONS.pl || TRANSLATIONS.en;
    const MONTH_NAMES = activeTranslation.months;
    const WEEKDAYS = activeTranslation.weekdays;

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleSelectDay = (day: number) => {
        setSelectedDay(day);
        if (onDateTimeSelect) {
            const formattedDate = new Date(currentYear, currentMonth, day);
            onDateTimeSelect({
                date: formattedDate
            });
        }
    };

    // Calculate selectable date limits
    const isDayDisabled = (day: number) => {
        const cellDate = new Date(currentYear, currentMonth, day);
        cellDate.setHours(0, 0, 0, 0);

        // Tomorrow is the min allowed date (no today / past delivery)
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        minDate.setHours(0, 0, 0, 0);

        // 14 days from today is the max allowed date (2 weeks ahead)
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 14);
        maxDate.setHours(23, 59, 59, 999);

        return cellDate.getTime() < minDate.getTime() || cellDate.getTime() > maxDate.getTime();
    };

    // Render calendar grid days
    const renderDays = () => {
        const days = [];
        // Blank cells for alignment
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
        }
        // Month days
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = day === selectedDay;
            const disabled = isDayDisabled(day);
            days.push(
                <button
                    type="button"
                    key={`day-${day}`}
                    disabled={disabled}
                    onClick={() => handleSelectDay(day)}
                    className={`w-9 h-9 text-[15px] font-medium rounded-full flex items-center justify-center transition-all focus:outline-none relative ${
                        isSelected 
                            ? 'bg-[#FF3B30] text-white font-semibold shadow-md scale-105 z-10' 
                            : disabled
                                ? 'text-gray-300 opacity-40 cursor-not-allowed'
                                : 'text-[#FF3B30] hover:bg-black/5'
                    }`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 pointer-events-auto bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
            
            {/* Modal Card wrapper */}
            <div className="pointer-events-auto relative w-[310px] bg-white border border-black/5 rounded-[24px] shadow-2xl overflow-hidden p-[18px] animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    {/* Month/Year selector dropdown button */}
                    <button 
                        type="button"
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-1 text-[17px] font-semibold text-[#FF3B30] hover:opacity-75 transition-opacity focus:outline-none"
                    >
                        <span>{MONTH_NAMES[currentMonth]} {currentYear}</span>
                        <div className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : 'rotate-0'}`}>
                            <DropdownArrowIcon />
                        </div>
                    </button>

                    {/* Month Navigations */}
                    <div className="flex items-center gap-2">
                        {/* Navigation Chevron buttons */}
                        <button type="button" onClick={prevMonth} className="p-1.5 text-[#FF3B30] hover:bg-black/5 rounded-full transition-colors focus:outline-none">
                            <ChevronLeftIcon />
                        </button>
                        <button type="button" onClick={nextMonth} className="p-1.5 text-[#FF3B30] hover:bg-black/5 rounded-full transition-colors focus:outline-none">
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>

                {/* Weekdays indicator headers */}
                <div className="grid grid-cols-7 gap-y-1 mb-2 text-center">
                    {WEEKDAYS.map((day) => (
                        <div key={day} className="text-[10px] font-bold text-gray-400 tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid & Dropdown Container */}
                <div className="relative h-[216px]">
                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-y-1 justify-items-center absolute w-full z-10">
                        {renderDays()}
                    </div>

                    {/* Month/Year Selection Dropdown Overlay */}
                    {showDropdown && (
                        <div className="absolute inset-0 z-30 flex flex-col p-3 rounded-[18px] bg-white/95 backdrop-blur-md transition-all duration-200">
                            {/* Year Selector Header */}
                            <div className="flex items-center justify-between mb-3 border-b pb-2 border-black/5">
                                <button type="button" onClick={() => setCurrentYear(y => y - 1)} className="p-1.5 text-[#FF3B30] hover:bg-black/5 rounded-full transition-colors">
                                    <ChevronLeftIcon />
                                </button>
                                <span className="font-bold text-[16px] text-black">{currentYear}</span>
                                <button type="button" onClick={() => setCurrentYear(y => y + 1)} className="p-1.5 text-[#FF3B30] hover:bg-black/5 rounded-full transition-colors">
                                    <ChevronRightIcon />
                                </button>
                            </div>

                            {/* Month Selection Grid */}
                            <div className="grid grid-cols-3 gap-1.5 flex-1 overflow-y-auto">
                                {MONTH_NAMES.map((m, idx) => {
                                    const isSelected = idx === currentMonth;
                                    return (
                                        <button
                                            type="button"
                                            key={m}
                                            onClick={() => {
                                                setCurrentMonth(idx);
                                                setShowDropdown(false);
                                            }}
                                            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                isSelected
                                                    ? 'bg-[#FF3B30] text-white shadow-sm'
                                                    : 'text-black hover:bg-black/5'
                                            }`}
                                        >
                                            {m.slice(0, 3)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// Aliased export for compatibility with demo files
export { AppleCalendarPicker as Component };
