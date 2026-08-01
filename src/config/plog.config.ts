export type PlogItem = {
  id: string
  image: string
  alt: { en: string; zh: string }
  title: { en: string; zh: string }
  caption?: { en: string; zh: string }
  date?: string
  location?: { en: string; zh: string }
  fit?: 'cover' | 'contain'
}

// Add future photos to public/plog/ and register them here.
export const plogItems: PlogItem[] = [
  {
    id: 'hello',
    image: '/avatar.png',
    alt: { en: 'Two dogs outside a cabin', zh: '木屋外的两只狗' },
    title: { en: 'First frame.', zh: '第一帧。' },
    caption: { en: 'From the archive.', zh: '来自相册。' },
    fit: 'contain',
  },
]

export function getLocalizedPlogItems(locale: string) {
  const language = locale === 'zh' ? 'zh' : 'en'
  return plogItems.map((item) => ({
    id: item.id,
    image: item.image,
    alt: item.alt[language],
    title: item.title[language],
    caption: item.caption?.[language],
    date: item.date,
    location: item.location?.[language],
    fit: item.fit ?? 'cover',
  }))
}
