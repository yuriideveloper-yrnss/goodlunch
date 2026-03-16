'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export default function MenuGallery({ dict }: { dict: any }) {
  const containerRef = useRef(null)

  // Фейковые данные (потом подставим реальные фото)
  const items = [
    { id: 1, type: dict.menu.breakfast, img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80", kcal: 450, title: dict.menu.items.owsianka },
    { id: 2, type: dict.menu.lunch, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80", kcal: 600, title: dict.menu.items.kurczak },
    { id: 3, type: dict.menu.dinner, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80", kcal: 400, title: dict.menu.items.pasta },
    { id: 4, type: dict.menu.breakfast, img: "https://images.unsplash.com/photo-1484723091791-c0e7e14c4456?auto=format&fit=crop&w=600&q=80", kcal: 450, title: dict.menu.items.nalesniki },
  ]

  return (
    <section className="py-24 bg-brand-bg overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-4xl font-bold text-brand-dark mb-2">{dict.menu.title}</h2>
        <p className="text-gray-500">{dict.menu.subtitle}</p>
      </div>

      {/* Слайдер с возможностью перетаскивания */}
      <motion.div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing px-4"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -600 }} // Ограничение прокрутки
          className="flex gap-6 w-max"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="relative w-[300px] h-[400px] rounded-3xl overflow-hidden bg-white shadow-lg group select-none"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Картинка */}
              <div className="relative h-2/3 w-full bg-gray-200">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 640px) 300px, 300px"
                />
              </div>

              {/* Инфо */}
              <div className="p-6 h-1/3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold tracking-wider text-brand-orange uppercase bg-brand-orange/10 px-2 py-1 rounded-md">
                    {item.type}
                  </span>
                  <h3 className="text-lg font-bold text-brand-dark mt-2">{item.title}</h3>
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  🔥 {item.kcal} {dict.menu.kcal}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}