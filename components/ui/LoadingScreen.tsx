'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ text = 'Gotujemy...' }: { text?: string }) {
    // Eliminated blocking splash screen to ensure instantaneous FCP & LCP for mobile users and search crawlers
    return null;
}