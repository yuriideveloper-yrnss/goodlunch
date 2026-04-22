'use client'
import Image from 'next/image'
import { trackEvent } from '@/lib/tracking'

export default function Footer({ lang }: { lang: string }) {
    const currentYear = new Date().getFullYear();

    const text: Record<string, string> = {
        pl: 'Wszelkie prawa zastrzeżone.',
        ua: 'Всі права захищені.',
        ru: 'Все права защищены.',
        en: 'All rights reserved.'
    };

    const copyText = text[lang] || text.en;

    return (
        <footer className="bg-brand-dark text-white py-12 border-t border-brand-orange/20">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* LOGO */}
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-orange opacity-90">
                        <Image
                            src="/logo.png"
                            alt="GoodLunch Logo"
                            fill
                            sizes="40px"
                            loading="lazy"
                            className="object-cover"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">
                        Good<span className="text-brand-orange">Lunch</span>
                    </span>
                </div>

                {/* COPYRIGHT */}
                <div className="text-sm text-gray-400 font-medium text-center">
                    &copy; {currentYear} GoodLunch. {copyText}
                </div>

                {/* SOCIALS */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://www.instagram.com/goodlunch1/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('click_footer_instagram')}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-brand-orange hover:text-white transition-all duration-300"
                        aria-label="Instagram"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    )
}
