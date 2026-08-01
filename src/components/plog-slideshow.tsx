'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'

const AUTOPLAY_DELAY = 7000

type Slide = {
  id: string
  image: string
  alt: string
  time?: string
  title?: string
  caption?: string
  fit: 'cover' | 'contain'
}

type PlogSlideshowProps = {
  slides: Slide[]
  previousLabel: string
  nextLabel: string
  timelineLabel: string
  playLabel: string
  pauseLabel: string
  enterSlideshowLabel: string
  exitSlideshowLabel: string
  playMusicLabel: string
  pauseMusicLabel: string
  nextMusicLabel: string
  soundtracks?: Array<{
    src: string
    title: string
    artist: string
  }>
}

export function PlogSlideshow({
  slides,
  previousLabel,
  nextLabel,
  timelineLabel,
  playLabel,
  pauseLabel,
  enterSlideshowLabel,
  exitSlideshowLabel,
  playMusicLabel,
  pauseMusicLabel,
  nextMusicLabel,
  soundtracks = [],
}: PlogSlideshowProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const resumeMusicAfterTrackChangeRef = useRef(false)
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY,
      playOnInit: slides.length > 1,
      stopOnInteraction: false,
      stopOnFocusIn: false,
    }),
  )
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', loop: slides.length > 1, skipSnaps: false },
    [autoplay.current],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(slides.length > 1)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [activeSoundtrackIndex, setActiveSoundtrackIndex] = useState(0)
  const [isPresentation, setIsPresentation] = useState(false)
  const activeSlide = slides[activeIndex]
  const activeSoundtrack = soundtracks[activeSoundtrackIndex]

  const goTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi],
  )

  const goPrevious = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const goNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const togglePlayback = useCallback(() => {
    const player = emblaApi?.plugins().autoplay
    if (!player) return
    if (isPlaying) {
      player.stop()
      setIsPlaying(false)
    } else {
      player.play()
      setIsPlaying(true)
    }
  }, [emblaApi, isPlaying])

  const togglePresentation = useCallback(async () => {
    if (!sectionRef.current) return
    if (document.fullscreenElement) {
      audioRef.current?.pause()
      await document.exitFullscreen()
      return
    }

    try {
      const fullscreenRequest = sectionRef.current.requestFullscreen()
      if (activeSoundtrack && audioRef.current) {
        audioRef.current.volume = 0.35
        void audioRef.current.play().catch(() => setIsMusicPlaying(false))
      }
      await fullscreenRequest
    } catch {
      audioRef.current?.pause()
    }
  }, [activeSoundtrack])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play().catch(() => setIsMusicPlaying(false))
    else audio.pause()
  }, [])

  const playNextSoundtrack = useCallback(
    (resume = false) => {
      if (soundtracks.length < 2) return
      resumeMusicAfterTrackChangeRef.current =
        resume || (audioRef.current ? !audioRef.current.paused : false)
      setActiveSoundtrackIndex((index) => (index + 1) % soundtracks.length)
    },
    [soundtracks.length],
  )

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    if (resumeMusicAfterTrackChangeRef.current) {
      void audio.play().catch(() => setIsMusicPlaying(false))
    }
    resumeMusicAfterTrackChangeRef.current = false
  }, [activeSoundtrackIndex])

  useEffect(() => {
    if (!emblaApi) return
    const updateSelection = () => setActiveIndex(emblaApi.selectedScrollSnap())
    updateSelection()
    emblaApi.on('select', updateSelection)
    emblaApi.on('reInit', updateSelection)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      emblaApi.plugins().autoplay.stop()
      setIsPlaying(false)
    }

    return () => {
      emblaApi.off('select', updateSelection)
      emblaApi.off('reInit', updateSelection)
    }
  }, [emblaApi])

  useEffect(() => {
    const updateFullscreen = () => {
      const active = document.fullscreenElement === sectionRef.current
      setIsPresentation(active)
      if (!active) audioRef.current?.pause()
    }
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () =>
      document.removeEventListener('fullscreenchange', updateFullscreen)
  }, [])

  useEffect(() => {
    emblaApi?.reInit()
  }, [emblaApi, isPresentation])

  if (!activeSlide) return null

  const controlClass =
    'inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white shadow-sm backdrop-blur-xl transition group-hover:scale-105 group-hover:bg-black/65 disabled:opacity-25'

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden border border-foreground/[0.07] shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition-colors dark:shadow-none ${
        isPresentation
          ? 'h-screen w-screen rounded-none border-0 bg-black text-white shadow-none'
          : 'rounded-[1.75rem] bg-background'
      }`}
    >
      {activeSoundtrack && (
        <audio
          ref={audioRef}
          src={activeSoundtrack.src}
          preload="metadata"
          loop={soundtracks.length === 1}
          onPlay={() => setIsMusicPlaying(true)}
          onPause={() => setIsMusicPlaying(false)}
          onEnded={() => {
            playNextSoundtrack(true)
          }}
        />
      )}
      <div className="relative">
        <div
          ref={emblaRef}
          className={`overflow-hidden ${isPresentation ? 'h-screen bg-black' : 'bg-[#f5f5f7] dark:bg-[#1d1d1f]'}`}
          tabIndex={0}
          role="region"
          aria-label={timelineLabel}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') goPrevious()
            if (event.key === 'ArrowRight') goNext()
            if (event.key === ' ') {
              event.preventDefault()
              togglePlayback()
            }
          }}
        >
          <div className="flex h-full touch-pan-y">
            {slides.map((slide, index) => (
              <figure
                key={slide.id}
                className={`relative w-full min-w-0 shrink-0 overflow-hidden ${isPresentation ? 'h-screen' : 'h-[min(58vh,34rem)] min-h-[24rem]'}`}
                aria-hidden={index !== activeIndex}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-[-3%] h-[106%] w-[106%] scale-110 object-cover blur-3xl ${isPresentation ? 'opacity-45' : 'opacity-30 dark:opacity-20'}`}
                />
                <div
                  className={
                    isPresentation ? 'absolute inset-0 bg-black/20' : ''
                  }
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  style={{
                    transitionDuration:
                      isPresentation && isPlaying && index === activeIndex
                        ? `${AUTOPLAY_DELAY}ms`
                        : '700ms',
                  }}
                  className={`absolute inset-0 h-full w-full transition-transform ease-linear ${
                    slide.fit === 'contain'
                      ? isPresentation
                        ? 'object-contain p-8 sm:p-14'
                        : 'object-contain p-8 sm:p-12'
                      : 'object-cover'
                  } ${isPresentation && isPlaying && index === activeIndex ? 'scale-[1.035]' : 'scale-100'}`}
                />

                {isPresentation && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/35" />
                    <figcaption className="absolute inset-x-0 bottom-0 z-10 px-6 pb-20 pt-32 sm:px-12 sm:pb-24 lg:px-[8vw]">
                      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
                        <span className="tabular-nums">
                          {String(index + 1).padStart(2, '0')} /{' '}
                          {String(slides.length).padStart(2, '0')}
                        </span>
                        {slide.time && <span>{slide.time}</span>}
                      </div>
                      {slide.title && (
                        <h2 className="mt-3 max-w-5xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                          {slide.title}
                        </h2>
                      )}
                      {slide.caption && (
                        <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 sm:text-xl sm:leading-8">
                          {slide.caption}
                        </p>
                      )}
                    </figcaption>
                  </>
                )}
              </figure>
            ))}
          </div>
        </div>

        <div
          className={`absolute z-30 flex items-center gap-2 ${isPresentation ? 'right-5 top-5 sm:right-8 sm:top-8' : 'right-3 top-3 sm:right-5 sm:top-5'}`}
        >
          {slides.length > 1 && (
            <button
              type="button"
              onClick={togglePlayback}
              className={`group ${controlClass}`}
              aria-label={isPlaying ? pauseLabel : playLabel}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 translate-x-px" />
              )}
            </button>
          )}
          {activeSoundtrack && (
            <button
              type="button"
              onClick={toggleMusic}
              className={`group ${controlClass}`}
              aria-label={isMusicPlaying ? pauseMusicLabel : playMusicLabel}
              title={`${activeSoundtrack.title} · ${activeSoundtrack.artist}`}
            >
              {isMusicPlaying ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
          )}
          {activeSoundtrack && soundtracks.length > 1 && isPresentation && (
            <button
              type="button"
              onClick={() => playNextSoundtrack()}
              className={`group ${controlClass}`}
              aria-label={nextMusicLabel}
              title={nextMusicLabel}
            >
              <SkipForward className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={togglePresentation}
            className={`group ${controlClass}`}
            aria-label={
              isPresentation ? exitSlideshowLabel : enterSlideshowLabel
            }
          >
            {isPresentation ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {isPresentation && activeSoundtrack && isMusicPlaying && (
          <div
            className="pointer-events-none absolute right-5 top-[4.75rem] z-30 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/75 backdrop-blur-xl sm:right-8 sm:top-[5.25rem]"
            aria-live="polite"
          >
            {activeSoundtrack.title} · {activeSoundtrack.artist}
          </div>
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrevious}
              className="group absolute inset-y-0 left-0 z-20 flex w-20 cursor-w-resize items-center justify-start pl-3 outline-none sm:w-1/2 sm:pl-5"
              aria-label={previousLabel}
            >
              <span
                className={`${controlClass} sm:opacity-65 sm:group-hover:-translate-x-0.5 sm:group-hover:opacity-100`}
              >
                <ChevronLeft className="h-5 w-5" />
              </span>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="group absolute inset-y-0 right-0 z-20 flex w-20 cursor-e-resize items-center justify-end pr-3 outline-none sm:w-1/2 sm:pr-5"
              aria-label={nextLabel}
            >
              <span
                className={`${controlClass} sm:opacity-65 sm:group-hover:translate-x-0.5 sm:group-hover:opacity-100`}
              >
                <ChevronRight className="h-5 w-5" />
              </span>
            </button>
          </>
        )}

        {isPresentation && (
          <Timeline
            slides={slides}
            activeIndex={activeIndex}
            isPlaying={isPlaying}
            isPresentation
            label={timelineLabel}
            onSelect={goTo}
          />
        )}
      </div>

      {!isPresentation && (
        <div
          className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(slides.length).padStart(2, '0')}
            </span>
            {activeSlide.time && <span>{activeSlide.time}</span>}
          </div>
          {activeSlide.title && (
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
              {activeSlide.title}
            </h2>
          )}
          {activeSlide.caption && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {activeSlide.caption}
            </p>
          )}
          <Timeline
            slides={slides}
            activeIndex={activeIndex}
            isPlaying={isPlaying}
            label={timelineLabel}
            onSelect={goTo}
          />
        </div>
      )}
    </section>
  )
}

function Timeline({
  slides,
  activeIndex,
  isPlaying,
  isPresentation = false,
  label,
  onSelect,
}: {
  slides: Slide[]
  activeIndex: number
  isPlaying: boolean
  isPresentation?: boolean
  label: string
  onSelect: (index: number) => void
}) {
  return (
    <div
      className={`${isPresentation ? 'absolute inset-x-6 bottom-7 z-30 sm:inset-x-12 lg:inset-x-[8vw]' : 'mt-5'} grid grid-flow-col gap-1.5`}
      aria-label={label}
    >
      {slides.map((slide, index) => {
        const complete = index < activeIndex
        const active = index === activeIndex
        return (
          <button
            key={slide.id}
            type="button"
            onClick={() => onSelect(index)}
            className="group relative h-7 outline-none"
            aria-label={slide.title || `${index + 1}`}
            aria-current={active ? 'step' : undefined}
          >
            <span
              className={`absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full transition-[height] group-hover:h-1.5 ${isPresentation ? 'bg-white/25' : 'bg-foreground/15'}`}
            >
              {(complete || (active && !isPlaying)) && (
                <span
                  className={`absolute inset-0 ${isPresentation ? 'bg-white' : 'bg-foreground'}`}
                />
              )}
              {active && isPlaying && (
                <span
                  key={`${activeIndex}-${isPlaying}`}
                  className={`plog-autoplay-progress absolute inset-0 ${isPresentation ? 'bg-white' : 'bg-foreground'}`}
                  style={{ animationDuration: `${AUTOPLAY_DELAY}ms` }}
                />
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
