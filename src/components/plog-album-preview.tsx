'use client'

import { useEffect, useState } from 'react'
import { Images } from 'lucide-react'

const SWAP_INTERVAL = 3600

type PreviewSlide = {
  id: string
  image: string
  alt: string
}

export function PlogAlbumPreview({
  slides,
  photoLabel,
}: {
  slides: PreviewSlide[]
  photoLabel: string
}) {
  const [offset, setOffset] = useState(0)
  const [hasAdvanced, setHasAdvanced] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const cellCount = Math.min(4, slides.length)

  useEffect(() => {
    if (slides.length < 2 || isPaused) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const timer = window.setInterval(() => {
      setHasAdvanced(true)
      setOffset((current) => (current + 1) % slides.length)
    }, SWAP_INTERVAL)

    return () => window.clearInterval(timer)
  }, [isPaused, slides.length])

  if (cellCount === 0) return null

  const gridClass =
    cellCount === 1
      ? 'h-full'
      : cellCount === 2
        ? 'grid h-full grid-cols-2 gap-px bg-background'
        : 'grid h-full grid-cols-2 grid-rows-2 gap-px bg-background'

  return (
    <div
      data-plog-album-preview
      className="relative aspect-square overflow-hidden rounded-[1.15rem] bg-[#f5f5f7] dark:bg-[#1d1d1f]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={gridClass}>
        {Array.from({ length: cellCount }, (_, index) => {
          const slide = slides[(index + offset) % slides.length]
          const previousSlide =
            slides[(index + offset - 1 + slides.length) % slides.length]

          return (
            <div key={index} className="relative min-h-0 overflow-hidden">
              {hasAdvanced && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previousSlide.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`${offset}-${slide.id}`}
                src={slide.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] ${hasAdvanced ? 'plog-grid-image-swap' : ''}`}
                style={{ animationDelay: `${index * 85}ms` }}
              />
            </div>
          )
        })}
      </div>
      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
        <Images className="h-3 w-3" />
        {photoLabel}
      </span>
    </div>
  )
}
