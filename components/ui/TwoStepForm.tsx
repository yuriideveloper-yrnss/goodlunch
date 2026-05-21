'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent, trackLead } from '@/lib/tracking'

export function TwoStepForm({ dict, defaultData = {}, lang = 'unknown', onSuccessAction }: { dict: any, defaultData?: any, lang?: string, onSuccessAction?: () => void }) {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderId, setOrderId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        messenger: 'telegram',
        street: '',
        house: '',
        floor: '',
        apt: '',
        intercom: '',
        deliveryDay: 'tomorrow'
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
                                deliveryDay: data.order.deliveryDay || 'tomorrow'
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
                            <select
                                value={formData.deliveryDay}
                                onChange={e => setFormData({ ...formData, deliveryDay: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-gray-900 appearance-none"
                            >
                                <option value="tomorrow">{dict.form.tomorrow}</option>
                                <option value="day_after">{dict.form.day_after}</option>
                            </select>
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
