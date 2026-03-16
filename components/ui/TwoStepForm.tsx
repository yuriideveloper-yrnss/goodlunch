'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

    const handleStep1 = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, ...defaultData, lang, step: 1 })
            })
            const data = await res.json()
            if (data.orderId) {
                setOrderId(data.orderId)
            }
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
            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, ...defaultData, lang, id: orderId, step: 2 })
            })
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Lead')
            }
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

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-600 active:scale-[0.98] transition-all flex justify-center items-center mt-6 disabled:opacity-75"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                dict.form.submit_btn
                            )}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}
