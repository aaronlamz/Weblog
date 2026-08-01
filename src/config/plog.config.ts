type LocalizedText = { en: string; zh: string }

export type PlogSlide = {
  id: string
  image: string
  alt: LocalizedText
  caption?: LocalizedText
  fit?: 'cover' | 'contain'
}

export type PlogEntry = {
  slug: string
  title: LocalizedText
  description?: LocalizedText
  date?: string
  location?: LocalizedText
  slides: PlogSlide[]
}

// Add future photos to public/plog/, then group them into an entry here.
export const plogEntries: PlogEntry[] = [
  {
    slug: 'first-frame',
    title: { en: 'First frame.', zh: '第一帧。' },
    description: { en: 'From the archive.', zh: '来自相册。' },
    slides: [
      {
        id: 'dogs-by-the-cabin',
        image: '/avatar.png',
        alt: { en: 'Two dogs outside a cabin', zh: '木屋外的两只狗' },
        fit: 'contain',
      },
    ],
  },
]

const languageFor = (locale: string) => (locale === 'zh' ? 'zh' : 'en')

export function getLocalizedPlogEntries(locale: string) {
  const language = languageFor(locale)
  return plogEntries.map((entry) => ({
    slug: entry.slug,
    title: entry.title[language],
    description: entry.description?.[language],
    date: entry.date,
    location: entry.location?.[language],
    cover: entry.slides[0]?.image,
    photoCount: entry.slides.length,
    slides: entry.slides.map((slide) => ({
      id: slide.id,
      image: slide.image,
      alt: slide.alt[language],
      caption: slide.caption?.[language],
      fit: slide.fit ?? 'cover',
    })),
  }))
}

export function getLocalizedPlogEntry(slug: string, locale: string) {
  return getLocalizedPlogEntries(locale).find((entry) => entry.slug === slug)
}
