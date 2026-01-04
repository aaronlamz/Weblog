import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PageTransition } from '@/components/page-transition';
import { HtmlLangSetter } from '@/components/html-lang-setter';
import { DynamicMain } from '@/components/dynamic-main';
import { SmartBackground } from '@/components/smart-background';
import { locales } from '@/i18n/config';
import { siteConfig } from '@/config/site.config';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: {
      template: '%s | Aaron Lam',
      default: 'Aaron Lam - Full Stack Developer',
    },
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLangSetter locale={locale} />
      <SmartBackground maxCreatures={siteConfig.ui.background?.maxCreatures} />
      <div className="relative min-h-screen flex flex-col">
        <Header />
        <DynamicMain className="flex-1">
          <PageTransition>
            {children}
          </PageTransition>
        </DynamicMain>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
