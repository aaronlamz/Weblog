import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site.config'
import { ContactLinks } from '@/components/contact-links'
import { Code2, Heart, Quote } from 'lucide-react'
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

        {/* ── 顶部 Hero 卡片 ── */}
        <div
          className="lg-card rounded-3xl p-8 flex flex-col items-center text-center gap-5"
        >
          {/* 头像 */}
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

          {/* 姓名 + 描述 */}
          <div className="space-y-2">
            <h1
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 40%, #22d3ee 100%)' }}
            >
              {t('title')}
            </h1>
            <p className="text-base text-muted-foreground max-w-md">{t('description')}</p>
          </div>
        </div>

        {/* ── 简介卡 ── */}
        <div className="lg-card rounded-2xl p-6 space-y-3">
          <p className="text-base leading-relaxed text-foreground">{t('intro')}</p>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-base leading-relaxed text-muted-foreground">{t('bio')}</p>
        </div>

        {/* ── 两列信息卡 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Working On */}
          <div className="lg-card rounded-2xl p-6 group space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.20) 0%, rgba(37,99,235,0.18) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(59,130,246,0.20)',
                  border: '1px solid rgba(147,197,253,0.35)',
                }}
              >
                <Code2 className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-base font-semibold">{t('workingOnTitle')}</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{t('currentWork')}</p>
          </div>

          {/* Beyond Code */}
          <div className="lg-card rounded-2xl p-6 group space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.20) 0%, rgba(236,72,153,0.15) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(168,85,247,0.20)',
                  border: '1px solid rgba(216,180,254,0.35)',
                }}
              >
                <Heart className="w-4.5 h-4.5 text-purple-500 dark:text-purple-400" />
              </div>
              <h2 className="text-base font-semibold">{t('beyondCodeTitle')}</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{t('beyondCode')}</p>
          </div>
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
