import { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site.config'
import { ContactLinks } from '@/components/contact-links'
import { MapPin } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} | ${siteConfig.name}`,
      description: t('description'),
      type: 'website',
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <div className="mx-auto max-w-5xl px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-7">
      <header className="grid items-center gap-6 border-b border-black/[0.08] pb-8 dark:border-white/10 sm:grid-cols-[auto_1fr] sm:gap-8 sm:pb-9">
        <div className="relative h-28 w-28 overflow-hidden rounded-[2rem] bg-[#f5f5f7] dark:bg-[#1d1d1f]">
          {siteConfig.author.avatar ? (
            <Image
              src={siteConfig.author.avatar}
              alt={siteConfig.author.name}
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-semibold">
              {siteConfig.author.name[0]}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('title')}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{siteConfig.author.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{t('description')}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" strokeWidth={1.7} aria-hidden="true" />
            <span>{t('location')}</span>
          </div>
        </div>
      </header>

      <div className="grid gap-4 pt-8 md:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.75rem] bg-[#f5f5f7] p-7 dark:bg-[#1d1d1f] sm:p-9">
          <p className="text-lg font-medium leading-8 text-foreground">{t('intro')}</p>
          <p className="mt-5 text-base leading-7 text-muted-foreground">{t('bio')}</p>
        </section>

        <section className="rounded-[1.75rem] bg-[#f5f5f7] p-7 dark:bg-[#1d1d1f] sm:p-9">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">{t('connectTitle')}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('connect')}</p>
          <ContactLinks />
        </section>
      </div>
    </div>
  )
}
