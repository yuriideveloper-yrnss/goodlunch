export default function FloatingBackgrounds() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
            {/* Element 1: Leaf */}
            <div className="absolute top-[20%] left-[5%] opacity-10">
                <svg fill="currentColor" className="text-brand-orange w-32 h-32" viewBox="0 0 24 24">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22l1-2.3A4.49,4.49 0 0,0 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 7,11.5 7,11.5C7,11.5 10.9,9.54 13.9,7.6Z" />
                </svg>
            </div>

            {/* Element 2: Orange Circle / Tomato */}
            <div className="absolute top-[50%] right-[10%] opacity-10">
                <svg fill="currentColor" className="text-brand-dark w-40 h-40" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            </div>

            {/* Element 3: Abstract Shape */}
            <div className="absolute top-[80%] left-[15%] opacity-10">
                <svg fill="currentColor" className="text-brand-green w-48 h-48" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
            </div>
        </div>
    )
}
