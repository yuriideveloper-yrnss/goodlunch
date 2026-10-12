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
    <section id="faq" className="py-24 bg-brand-bg">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-brand-dark">{dict.faq.title}</h2>

        <div className="space-y-4">
          {questions.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpen(open === item.id ? null : item.id)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="font-bold text-brand-dark">{item.q}</span>
                <span className={`transform transition-transform ${open === item.id ? 'rotate-180' : ''}`}>
                  🔽
                </span>
              </button>

              <AnimatePresence>
                {open === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 border-t border-gray-100">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}