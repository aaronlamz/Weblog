'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Slide = {
  id: string
  image: string
  alt: string
  caption?: string
  fit: 'cover' | 'contain'
}

export function PlogSlideshow({ slides }: { slides: Slide[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = (index: number) => {
    const viewport = viewportRef.current
    if (!viewport || slides.length === 0) return
    const next = Math.max(0, Math.min(index, slides.length - 1))
    viewport.scrollTo({ left: viewport.clientWidth * next, behavior: 'smooth' })
  }

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const update = () => {
      const width = Math.max(1, viewport.clientWidth)
      setActiveIndex(Math.max(0, Math.min(Math.round(viewport.scrollLeft / width), slides.length - 1)))
    }
    viewport.addEventListener('scroll', update, { passive: true })
    return () => viewport.removeEventListener('scroll', update)
  }, [slides.length])

  return (
    <div className="relative">
      <div
        ref={viewportRef}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-[1.75rem] bg-[#f5f5f7] [scrollbar-width:none] dark:bg-[#1d1d1f] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <article key={slide.id} className="relative h-[min(62vh,36rem)] min-h-[28rem] w-full shrink-0 snap-center overflow-hidden">
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-[-3%] h-[106%] w-[106%] scale-110 object-cover opacity-35 blur-3xl dark:opacity-25"
            />
            <img
              src={slide.image}
              alt={slide.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              className={`absolute inset-0 h-full w-full ${slide.fit === 'contain' ? 'object-contain p-12 sm:p-16' : 'object-cover'}`}
            />
            {slide.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-6 pb-6 pt-24 text-white sm:px-8 sm:pb-8">
                <p className="text-sm text-white/80 sm:text-base">{slide.caption}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55 disabled:opacity-25 sm:left-5"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === slides.length - 1}
            className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55 disabled:opacity-25 sm:right-5"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute right-5 top-5 rounded-full bg-black/30 px-3 py-1.5 text-xs tabular-nums text-white/80 backdrop-blur-md">
            {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </div>
        </>
      )}
    </div>
  )
}
