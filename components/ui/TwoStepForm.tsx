'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent, trackLead } from '@/lib/tracking'
import { AppleCalendarPicker } from '@/components/ui/apple-calendar-picker'

const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
};

const formatDateValue = (date: Date) => {
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
};

const parseDeliveryDay = (val: string) => {
    if (!val || val === 'tomorrow') {
        return formatDateValue(getTomorrowDate());
    }
    if (val === 'day_after') {
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);
        return formatDateValue(dayAfter);
    }
    return val;
};

const parseDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
};

const getReadableDate = (dateStr: string, dict: any) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    const weekdays = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    const months = [
        'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
        'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
    ];
    
    const dayName = weekdays[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    const dateFormatted = `${dayName}, ${day} ${monthName} ${year}`;
    
    if (diffDays === 1) {
        return `${dict.form.tomorrow} (${dateFormatted})`;
    } else if (diffDays === 2) {
        return `${dict.form.day_after} (${dateFormatted})`;
    }
    
    return dateFormatted;
};

export function TwoStepForm({ dict, defaultData = {}, lang = 'unknown', onSuccessAction }: { dict: any, defaultData?: any, lang?: string, onSuccessAction?: () => void }) {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        messenger: 'telegram',
        street: '',
        house: '',
        floor: '',
        apt: '',
        intercom: '',
        deliveryDay: parseDeliveryDay('tomorrow')
    })

    // Load existing order from localStorage if it exists, to support single-order persistence & seamless correction
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedId = localStorage.getItem('goodlunch_order_id')
            if (storedId) {
                setOrderId(storedId)
                fetch(`/api/orders?id=${storedId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.order) {
                            setFormData({
                                name: data.order.name || '',
                                phone: data.order.phone || '',
                                messenger: data.order.messenger || 'telegram',
                                street: data.order.street || '',
                                house: data.order.house || '',
                                floor: data.order.floor || '',
                                apt: data.order.apt || '',
                                intercom: data.order.intercom || '',
                                deliveryDay: parseDeliveryDay(data.order.deliveryDay)
                            })
                        }
                    })
                    .catch(err => console.error('Failed to load existing order:', err))
            }
        }
    }, [])

    const handleStep1 = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const bodyPayload: any = { ...formData, ...defaultData, lang, step: 1 }
            if (orderId) {
                bodyPayload.id = orderId
            }
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload)
            })
            const data = await res.json()
            if (data.orderId) {
                setOrderId(data.orderId)
                localStorage.setItem('goodlunch_order_id', data.orderId)
            }
            trackEvent('begin_checkout', { items: [{ item_name: 'Meal Plan' }] })
            setStep(2)
        } catch (err) {
            setStep(2)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleStep2 = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const bodyPayload: any = { ...formData, ...defaultData, lang, step: 2 }
            if (orderId) {
                bodyPayload.id = orderId
            }
            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload)
            })
            trackLead({
                event_category: 'form',
                event_label: 'TwoStepForm'
            })
            if (onSuccessAction) onSuccessAction()
        } catch (err) {
            if (onSuccessAction) onSuccessAction()
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full relative min-h-[400px]">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.form
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleStep1}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{dict.form.name_label}</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                type="text"
                                placeholder="Ivan Ivanov"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{dict.form.phone_label}</label>
                            <input
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                type="tel"
                                placeholder={dict.form.phone_placeholder}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{dict.form.messenger_label}</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['telegram', 'whatsapp', 'viber'].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, messenger: method })}
                                        className={`py-3 px-2 rounded-xl text-sm font-bold capitalize transition-colors border ${formData.messenger === method
                                            ? 'bg-brand-orange border-brand-orange text-white shadow-md shadow-brand-orange/30'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 active:scale-[0.98] transition-all flex justify-center items-center mt-6 disabled:opacity-75"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                dict.form.step2_btn
                            )}
                        </button>
                    </motion.form>
                )}

                {step === 2 && (
                    <motion.form
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleStep2}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">{dict.form.street}</label>
                                <input
                                    required
                                    value={formData.street}
                                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                                    type="text"
                                    placeholder="np. Krakowska"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{dict.form.house}</label>
                                <input
                                    required
                                    value={formData.house}
                                    onChange={e => setFormData({ ...formData, house: e.target.value })}
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{dict.form.apt}</label>
                                <input
                                    value={formData.apt}
                                    onChange={e => setFormData({ ...formData, apt: e.target.value })}
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{dict.form.floor}</label>
                                <input
                                    value={formData.floor}
                                    onChange={e => setFormData({ ...formData, floor: e.target.value })}
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{dict.form.intercom}</label>
                                <input
                                    value={formData.intercom}
                                    onChange={e => setFormData({ ...formData, intercom: e.target.value })}
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{dict.form.delivery_day}</label>
                            <button
                                type="button"
                                onClick={() => setIsCalendarOpen(true)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-gray-900 flex items-center justify-between group"
                            >
                                <span className="text-gray-900 font-semibold">
                                    {getReadableDate(formData.deliveryDay, dict)}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-5 h-5 text-gray-400 group-hover:text-brand-orange transition-colors"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                                    />
                                </svg>
                            </button>

                            <AppleCalendarPicker
                                isOpen={isCalendarOpen}
                                onClose={() => setIsCalendarOpen(false)}
                                initialDate={parseDate(formData.deliveryDay)}
                                onDateTimeSelect={(data: { date: Date }) => {
                                    setFormData({ ...formData, deliveryDay: formatDateValue(data.date) });
                                    setIsCalendarOpen(false);
                                }}
                            />
                        </div>

                        <p className="text-xs text-gray-500 text-center px-4 mt-4">
                            {dict.form.delivery_note}
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all flex justify-center items-center"
                            >
                                {dict.advisor.back_btn || 'Back'}
                            </button>
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="flex-[2] bg-brand-orange text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-600 active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-75"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    dict.form.submit_btn
                                )}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}
