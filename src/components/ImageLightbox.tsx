import { useState } from 'react'

interface ImageLightboxProps {
  src: string
  alt: string
  className?: string
}

export default function ImageLightbox({ src, alt, className = '' }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Thumbnail with hover overlay */}
      <div
        onClick={() => setOpen(true)}
        className="relative group cursor-zoom-in"
      >
        <img src={src} alt={alt} className={className} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 rounded-lg flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full">
            <svg width="14" height="14" fill="none" stroke="#334155" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
            <span className="text-[11px] font-semibold text-slate-700">클릭하여 확대</span>
          </div>
        </div>
      </div>

      {/* Lightbox modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2">
              <path d="M5 5l10 10M5 15L15 5" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
