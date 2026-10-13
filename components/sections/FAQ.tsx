'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQ({ dict }: { dict: any }) {
  const [open, setOpen] = useState<number | null>(null)

  const questions = [
    { id: 1, q: dict.faq.q1, a: dict.faq.a1 },
    { id: 2, q: dict.faq.q2, a: dict.faq.a2 },
    { id: 3, q: dict.faq.q3, a: dict.faq.a3 },
    ...(dict.faq.q4 ? [{ id: 4, q: dict.faq.q4, a: dict.faq.a4 }] : []),
    ...(dict.faq.q5 ? [{ id: 5, q: dict.faq.q5, a: dict.faq.a5 }] : []),
  ]

  return (
    <section id="faq" className="py-20 sm:py-24 bg-brand-bg">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-10 sm:mb-12 text-brand-dark">
          {dict.faq.title}
        </h2>

        <div className="space-y-3.5 sm:space-y-4">
          {questions.map((item) => {
            const isOpen = open === item.id
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-colors duration-200 ${
                  isOpen ? 'border-brand-orange/30 shadow-md shadow-brand-orange/5' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="w-full flex justify-between items-center p-5 sm:p-6 text-left gap-4 group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-brand-dark text-base sm:text-lg leading-snug group-hover:text-brand-orange transition-colors">
                    {item.q}
                  </span>

                  {/* Стильная кастомная стрелочка-бейдж */}
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-brand-orange text-white shadow-sm shadow-brand-orange/30 rotate-180'
                        : 'bg-orange-50 text-brand-orange border border-brand-orange/20 group-hover:bg-brand-orange group-hover:text-white group-hover:border-transparent'
                    }`}
                  >
                    <svg
                      className="w-4 h-4 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100/80">
                        <div className="pt-4">
                          {item.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}