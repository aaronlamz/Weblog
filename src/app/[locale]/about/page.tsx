import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site.config'
import { ContactLinks } from '@/components/contact-links'
import { Quote } from 'lucide-react'
import Image from 'next/image'

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
    twitter: {
      card: siteConfig.seo.twitterCard,
      title: `${t('title')} | ${siteConfig.name}`,
      description: t('description'),
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── 头像 ── */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-25 bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-400 scale-150" />
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden"
              style={{
                boxShadow: [
                  'inset 0 1px 0 rgba(255,255,255,0.7)',
                  '0 0 0 3px rgba(255,255,255,0.55)',
                  '0 0 0 5px rgba(100,160,240,0.22)',
                  '0 8px 28px rgba(56,130,246,0.30)',
                ].join(', '),
              }}
            >
              {siteConfig.author.avatar ? (
                <Image
                  src={siteConfig.author.avatar}
                  alt={siteConfig.author.name}
                  width={80}
                  height={80}
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {siteConfig.author.name[0]}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 简介卡 ── */}
        <div className="lg-card rounded-2xl p-6 space-y-3">
          <p className="text-base leading-relaxed text-foreground">{t('intro')}</p>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-base leading-relaxed text-muted-foreground">{t('bio')}</p>
        </div>

        {/* ── 联系方式卡 ── */}
        <div className="lg-card rounded-2xl p-6 space-y-1">
          <h2 className="text-base font-semibold mb-1">{t('connectTitle')}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t('connect')}</p>
          <ContactLinks />
        </div>

        {/* ── 引言卡 ── */}
        <div
          className="lg-card rounded-2xl p-8 text-center space-y-4"
          style={{
            background: 'linear-gradient(145deg, rgba(251,191,36,0.08) 0%, rgba(249,115,22,0.06) 50%, rgba(234,179,8,0.08) 100%)',
          }}
        >
          <Quote
            className="w-7 h-7 mx-auto"
            style={{ color: 'rgba(217,119,6,0.55)' }}
          />
          <p className="text-base italic leading-relaxed text-foreground/85">
            &ldquo;{t('quote')}&rdquo;
          </p>
        </div>

      </div>
    </div>
  )
}
