'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Reviews({ dict }: { dict: any }) {
  // Реальные медиа пользователя
  const clientReviews = [
    { id: 1, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1623.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTYyMy53ZWJtIiwiaWF0IjoxNzczMDc2NDkxLCJleHAiOjIwODg0MzY0OTF9.gs9PxnBPSenzPTI2whV7V6al4fae3OGk8KbqLDRqtcA", label: "Reels" },
    { id: 2, type: "photo", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/photo_2026-02-18_12-40-33.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9waG90b18yMDI2LTAyLTE4XzEyLTQwLTMzLmpwZyIsImlhdCI6MTc3MzA3NjcwOCwiZXhwIjoyMDg4Njk1OTA4fQ.qKvcXHKUfbYoP49oD75WFh_HePsLBY8fQr3ENNqM0qs", label: "Story" },
    { id: 3, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1682.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTY4Mi53ZWJtIiwiaWF0IjoxNzczMDc2NjE5LCJleHAiOjIwODg2OTU4MTl9.ZhkJKtBrFpikX9-jTPT8fPwYAQC2s_Yly63l85kVJN8", label: "Reels" },
    { id: 4, type: "photo", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/photo_2026-02-18_12-40-51.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9waG90b18yMDI2LTAyLTE4XzEyLTQwLTUxLmpwZyIsImlhdCI6MTc3MzA3Njc2MSwiZXhwIjoyMDg4Njk1OTYxfQ.VYPqHZ1-dXikWrc_9PABsmAvSQx25kLEHCWJ9kiIRvw", label: "Story" },
    { id: 5, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1601.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTYwMS53ZWJtIiwiaWF0IjoxNzczMDc2MDExLCJleHAiOjIwODg0MzYwMTF9.MwI2FFNOZfjrocGwaLDd15p9WEcfoii91KeoY_2dQYU", label: "Story" },
    { id: 6, type: "photo", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/photo_2026-02-18_12-40-34.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9waG90b18yMDI2LTAyLTE4XzEyLTQwLTM0LmpwZyIsImlhdCI6MTc3MzA3NjcxOSwiZXhwIjoyMDg4Njk1OTE5fQ.sOEzxU1vEboEj9DdMX40U4uPS1b14aW3FRNO23tP4qo", label: "Story" },
    { id: 7, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1626.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTYyNi53ZWJtIiwiaWF0IjoxNzczMDc2NTE4LCJleHAiOjIwODg0MzY1MTh9.hM7mDEd584O2FQkXLmRXFBiyHuqPt8E2leuzOMUpVt0", label: "Reels" },
    { id: 8, type: "photo", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/photo_2026-02-18_12-40-50.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9waG90b18yMDI2LTAyLTE4XzEyLTQwLTUwLmpwZyIsImlhdCI6MTc3MzA3Njc0MSwiZXhwIjoyMDg4Njk1OTQxfQ.q1PcMv517lDwc9I8MsbIl8fEnuS4jkrRs7OX9Il1CZA", label: "Story" },
    { id: 9, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1656.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTY1Ni53ZWJtIiwiaWF0IjoxNzczMDc2NTM3LCJleHAiOjIwODg0MzY1Mzd9.C0nfjib8xvI_4M1mYRDuFx-gey6GIUNQXh-yNeXrsfE", label: "Story" },
    { id: 10, type: "photo", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/photo_2026-02-18_12-40-52.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9waG90b18yMDI2LTAyLTE4XzEyLTQwLTUyLmpwZyIsImlhdCI6MTc3MzA3Njc3NSwiZXhwIjoyMDg4Njk1OTc1fQ.iMOBlsL-triLOS0AZvFAUdmHnQV9LV9G7Wyk2w4VvyU", label: "Story" },
    { id: 11, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1681.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTY4MS53ZWJtIiwiaWF0IjoxNzczMDc2NTkwLCJleHAiOjIwODg2OTU3OTB9.QhlG26lLQu2WzD0V4uasoHXSrTtbLM1WEm2rLSRhOW0", label: "Story" },
    { id: 12, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1685.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTY4NS53ZWJtIiwiaWF0IjoxNzczMDc2NjMzLCJleHAiOjIwODg2OTU4MzN9.zp8dnWnT-hopJ9lSIs2tW5VhWvNAi7SmWamgtrJB1zQ", label: "Story" },
    { id: 13, type: "photo", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/photo_2026-02-20_15-06-21.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9waG90b18yMDI2LTAyLTIwXzE1LTA2LTIxLmpwZyIsImlhdCI6MTc3MzA3Njc4OSwiZXhwIjoyMDg4Njk1OTg5fQ.a_rdNiKW7Dgf-eS0YELypZan0Dn5dyXpHt6m5ajLrn4", label: "Story" },
    { id: 14, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1686.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTY4Ni53ZWJtIiwiaWF0IjoxNzczMDc2NjQ1LCJleHAiOjIwODg2OTU4NDV9.Vl3DHKN4CYllc3XbQBw-nGVDLz8v_EvM22J-EUf6sS4", label: "Story" },
    { id: 15, type: "photo", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/photo_2026-02-18_12-40-33%20(2).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9waG90b18yMDI2LTAyLTE4XzEyLTQwLTMzICgyKS5qcGciLCJpYXQiOjE3NzMwNzY2OTMsImV4cCI6MjA4ODY5NTg5M30.NWwyBtnAkHf3q-LM0-A209m0ZSeotv8EkVbCe5cxJ7c", label: "Story" },
    { id: 16, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1687.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTY4Ny53ZWJtIiwiaWF0IjoxNzczMDc2NjYwLCJleHAiOjIwODg0MzY2NjB9.paF7LIZbvC8YlXqsVxWh1yZtHqH5lexlnxABxaG5Im4", label: "Story" },
    { id: 17, type: "photo", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/photo_2026-02-18_12-40-51%20(2).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9waG90b18yMDI2LTAyLTE4XzEyLTQwLTUxICgyKS5qcGciLCJpYXQiOjE3NzMwNzY3NTAsImV4cCI6MjA4ODY5NTk1MH0.KOV5KpE6I6uXd5YhrL-RewEIdD9uRYHtC2OZ0-NK1zM", label: "Story" },
    { id: 18, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1657.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTY1Ny53ZWJtIiwiaWF0IjoxNzczMDc2NTYwLCJleHAiOjIwODg0MzY1NjB9.hKIWuXcckjVgD5h2gVKVDD1grDCPP0UNqftWO4awkps", label: "Story" },
    { id: 19, type: "video", url: "https://gwoimelzacginflgccax.supabase.co/storage/v1/object/sign/goodlunch%20content/IMG_1660.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMzM5OTAxZC01ZTkwLTRiMmUtOTk4OC05ZmFkZGE4NDQ3MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnb29kbHVuY2ggY29udGVudC9JTUdfMTY2MC53ZWJtIiwiaWF0IjoxNzczMDc2NTc4LCJleHAiOjIwODg0MzY1Nzc4fQ.XKKOdpA1ydQT081z0WMUCnwWLCLX-ew3BukuGmJUVh8", label: "Story" }
  ]

  return (
    <section id="opinie" className="py-24 bg-brand-bg overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-dark mb-4">{dict.reviews.title}</h2>
          <p className="text-brand-orange text-lg font-medium">{dict.reviews.subtitle}</p>
        </div>

        {/* Сетка / Слайдер для вертикальных видео и фото */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory hide-scrollbar lg:grid lg:grid-cols-4 sm:overflow-visible">
          {clientReviews.map((media) => (
            <div
              key={media.id}
              className="relative w-[280px] sm:w-[320px] lg:w-full aspect-[9/16] bg-brand-dark rounded-3xl overflow-hidden flex-shrink-0 snap-center group cursor-pointer shadow-xl border border-white/10"
            >
              {media.type === 'video' ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster="/images/video-placeholder.jpg"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <source src={media.url} type="video/webm" />
                </video>
              ) : (
                <Image
                  src={media.url}
                  alt={media.label}
                  fill
                  loading="lazy"
                  className="object-cover opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 300px"
                  unoptimized // Из-за пробелов и кириллицы в исходниках лучше отключить оптимизацию на этапе MVP
                />
              )}

              {/* Метка "Reels / Story" */}
              <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                {media.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  )
}
