'use client'
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type MealPackage = 'meals3' | 'meals4'

export interface QuickOrderConfig {
    package?: MealPackage
    isOld?: boolean
    isGlobal?: boolean
}

interface OrderContextType {
    mealPackage: MealPackage
    setMealPackage: (pkg: MealPackage) => void
    isQuickOrderOpen: boolean
    quickOrderConfig: QuickOrderConfig
    openQuickOrder: (config?: QuickOrderConfig) => void
    closeQuickOrder: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
    const [mealPackage, setMealPackage] = useState<MealPackage>('meals3')
    const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false)
    const [quickOrderConfig, setQuickOrderConfig] = useState<QuickOrderConfig>({
        package: 'meals3',
        isOld: false,
    })

    const openQuickOrder = useCallback((config?: QuickOrderConfig) => {
        if (config) {
            setQuickOrderConfig((prev) => ({
                ...prev,
                ...config,
            }))
            if (config.package) {
                setMealPackage(config.package)
            }
        }
        setIsQuickOrderOpen(true)
    }, [])

    const closeQuickOrder = useCallback(() => {
        setIsQuickOrderOpen(false)
    }, [])

    return (
        <OrderContext.Provider
            value={{
                mealPackage,
                setMealPackage,
                isQuickOrderOpen,
                quickOrderConfig,
                openQuickOrder,
                closeQuickOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    )
}

export function useOrder() {
    const context = useContext(OrderContext)
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider')
    }
    return context
}

