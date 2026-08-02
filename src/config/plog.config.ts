type LocalizedText = { en: string; zh: string }

export type PlogSoundtrack = {
  src: string
  title: string
  artist: string
}

// Reusable music presets for Plog entries. All tracks are covered by the
// Mixkit Stock Music Free License; provenance is recorded beside the files.
export const plogSoundtracks = {
  sereneView: {
    src: '/plog/music/serene-view.mp3',
    title: 'Serene View',
    artist: 'Arulo',
  },
  forestWalk: {
    src: '/plog/music/forest-walk.mp3',
    title: 'Forest Walk',
    artist: 'Eugenio Mininni',
  },
  valleySunset: {
    src: '/plog/music/valley-sunset.mp3',
    title: 'Valley Sunset',
    artist: 'Alejandro Magaña (A. M.)',
  },
} satisfies Record<string, PlogSoundtrack>

type PlogSoundtrackKey = keyof typeof plogSoundtracks

export type PlogSlide = {
  id: string
  image: string
  alt: LocalizedText
  time?: LocalizedText
  title?: LocalizedText
  caption?: LocalizedText
  fit?: 'cover' | 'contain'
}

export type PlogEntry = {
  slug: string
  title: LocalizedText
  description?: LocalizedText
  date: string
  location?: LocalizedText
  soundtracks?: PlogSoundtrackKey[]
  slides: PlogSlide[]
}

// Add future photos to public/plog/, then group them into an entry here.
// A Plog can opt into one or more of the soundtrack presets above.
export const plogEntries: PlogEntry[] = [
  {
    slug: 'a-day-in-kuala-lumpur',
    title: { en: 'A Day in Kuala Lumpur · Sample', zh: '吉隆坡的一天 · 样例' },
    description: {
      en: 'Rain, streets, lunch, and blue hour.',
      zh: '一场雨、几条街、一顿午餐和入夜时分。',
    },
    date: '2026-07-26',
    location: { en: 'Kuala Lumpur, Malaysia', zh: '马来西亚吉隆坡' },
    soundtracks: ['sereneView', 'forestWalk', 'valleySunset'],
    slides: [
      {
        id: 'arrival',
        image: '/plog/sample-kuala-lumpur/01-arrival.jpg',
        alt: {
          en: 'Kuala Lumpur through a rain-covered car window',
          zh: '隔着雨中的车窗看吉隆坡',
        },
        time: { en: '08:40 · Arrival', zh: '08:40 · 抵达' },
        title: {
          en: 'The city, through the rain.',
          zh: '隔着雨，看见这座城市。',
        },
        caption: {
          en: 'The skyline appeared between raindrops and tropical green.',
          zh: '雨滴和热带绿意之间，城市的轮廓慢慢出现。',
        },
      },
      {
        id: 'streets',
        image: '/plog/sample-kuala-lumpur/02-streets.jpg',
        alt: {
          en: 'A quiet heritage street after rain',
          zh: '雨后一条安静的老街',
        },
        time: { en: '10:30 · Old streets', zh: '10:30 · 老街' },
        title: { en: 'After the rain.', zh: '雨停以后。' },
        caption: {
          en: 'Wet pavement, old facades, and plants spilling into the lane.',
          zh: '湿漉漉的路面、旧建筑，还有一路蔓延的绿植。',
        },
      },
      {
        id: 'lunch',
        image: '/plog/sample-kuala-lumpur/03-lunch.jpg',
        alt: {
          en: 'A simple lunch at a street food table',
          zh: '街边小桌上的一顿简单午餐',
        },
        time: { en: '13:10 · Lunch', zh: '13:10 · 午餐' },
        title: { en: 'A table by the street.', zh: '街边的一张小桌。' },
        caption: {
          en: 'Nothing elaborate—just rice, roast meat, and an iced drink.',
          zh: '没有复杂的安排，一份饭、一杯冰饮，刚刚好。',
        },
      },
      {
        id: 'blue-hour',
        image: '/plog/sample-kuala-lumpur/04-blue-hour.jpg',
        alt: {
          en: 'Kuala Lumpur skyline at blue hour',
          zh: '蓝调时刻的吉隆坡天际线',
        },
        time: { en: '19:25 · Blue hour', zh: '19:25 · 入夜' },
        title: { en: 'The lights came on.', zh: '灯亮起来了。' },
        caption: {
          en: 'The rain moved on. The city settled into the evening.',
          zh: '雨已经走远，城市慢慢进入夜晚。',
        },
      },
    ],
  },
]

const languageFor = (locale: string) => (locale === 'zh' ? 'zh' : 'en')

export function getLocalizedPlogEntries(locale: string) {
  const language = languageFor(locale)
  return plogEntries
    .map((entry) => ({
      slug: entry.slug,
      title: entry.title[language],
      description: entry.description?.[language],
      date: entry.date,
      location: entry.location?.[language],
      soundtracks: entry.soundtracks?.map((key) => plogSoundtracks[key]),
      cover: entry.slides[0]?.image,
      photoCount: entry.slides.length,
      slides: entry.slides.map((slide) => ({
        id: slide.id,
        image: slide.image,
        alt: slide.alt[language],
        time: slide.time?.[language],
        title: slide.title?.[language],
        caption: slide.caption?.[language],
        fit: slide.fit ?? 'cover',
      })),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getLocalizedPlogEntry(slug: string, locale: string) {
  return getLocalizedPlogEntries(locale).find((entry) => entry.slug === slug)
}
