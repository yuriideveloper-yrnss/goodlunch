'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { trackEvent, trackLead } from '@/lib/tracking'
import { getSmartCateringUrl } from '@/lib/smartcatering'
import { useOrder } from '@/components/providers/OrderProvider'
import { PRICING } from '@/lib/constants'

export function SmartCateringForm({
    dict,
    defaultData = {},
    lang = 'unknown',
    showPackageSelector = false,
    onSuccessAction
}: {
    dict: any
    defaultData?: { package?: string; calories?: number; price?: string }
    lang?: string
    showPackageSelector?: boolean
    onSuccessAction?: () => void
}) {
    const { mealPackage, setMealPackage } = useOrder()
    const selectedPkg = defaultData.package || mealPackage || 'meals3'
    const [localPackage, setLocalPackage] = useState<'meals3' | 'meals4'>(selectedPkg as 'meals3' | 'meals4')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        messenger: 'telegram',
    })

    const handlePackageSelect = (pkg: 'meals3' | 'meals4') => {
        setLocalPackage(pkg)
        setMealPackage(pkg)
        trackEvent('calculator_package_change', { package: pkg })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const currentPkg: 'meals3' | 'meals4' = (showPackageSelector ? localPackage : (defaultData.package || localPackage)) as 'meals3' | 'meals4'
        const pricingTier = PRICING[currentPkg]?.[0]
        const calories = defaultData.calories || pricingTier?.value || (currentPkg === 'meals4' ? 1800 : 1500)
        const price = defaultData.price || (pricingTier ? (pricingTier.price * (1 - PRICING.trialDiscount)).toFixed(2) : (currentPkg === 'meals4' ? '44.00' : '36.00'))
        const targetUrl = getSmartCateringUrl(currentPkg)

        try {
            const bodyPayload = {
                name: formData.name,
                phone: formData.phone,
                messenger: formData.messenger,
                package: currentPkg,
                calories,
                price,
                lang,
                source: 'smartcatering',
                status: 'SmartCatering',
                targetUrl
            }

            // Save lead to Supabase & trigger Telegram notification
            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload)
            })

            // Track lead & analytics events
            trackLead({
                event_category: 'smartcatering',
                event_label: currentPkg,
                value: parseFloat(price) || 0
            })

            trackEvent('smartcatering_lead', {
                package: currentPkg,
                calories,
                price,
                target_url: targetUrl
            })

            trackEvent('InitiateCheckout', {
                content_name: currentPkg === 'meals4' ? '4 Posiłki' : '3 Posiłki',
                value: parseFloat(price) || 0,
                currency: 'PLN'
            })

            if (onSuccessAction) {
                onSuccessAction()
            }

            // Immediate seamless redirect to Mobilny Catering store
            window.location.href = targetUrl
        } catch (err) {
            console.error('Submission error, redirecting directly:', err)
            window.location.href = targetUrl
        } finally {
            // keep submitting state while browser redirects
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {showPackageSelector && (
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        {dict.calc.meals3_label ? `${dict.calc.meals3_label} / ${dict.calc.meals4_label}` : 'Wybierz zestaw'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handlePackageSelect('meals3')}
                            className={`py-3 px-3 rounded-xl text-sm font-bold transition-all border ${
                                localPackage === 'meals3'
                                    ? 'bg-brand-orange border-brand-orange text-white shadow-md shadow-brand-orange/30'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {dict.calc.meals3_label || '3 Posiłki'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePackageSelect('meals4')}
                            className={`py-3 px-3 rounded-xl text-sm font-bold transition-all border ${
                                localPackage === 'meals4'
                                    ? 'bg-brand-orange border-brand-orange text-white shadow-md shadow-brand-orange/30'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {dict.calc.meals4_label || '4 Posiłki'}
                        </button>
                    </div>
                </div>
            )}

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
                            className={`py-3 px-2 rounded-xl text-sm font-bold capitalize transition-colors border ${
                                formData.messenger === method
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
                className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-600 active:scale-[0.98] transition-all flex justify-center items-center mt-6 disabled:opacity-75 cursor-pointer"
            >
                {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    dict.calc.order_btn || dict.form.submit_btn || 'Zamów'
                )}
            </button>
        </form>
    )
}
