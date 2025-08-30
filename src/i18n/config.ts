import { siteConfig } from '@/config/site.config';

export const locales = siteConfig.i18n.locales;
export const defaultLocale = siteConfig.i18n.defaultLocale;

export type Locale = 'zh' | 'en';

export const localeNames: Record<Locale, string> = siteConfig.i18n.localeNames;

export const localeFlags: Record<Locale, string> = siteConfig.i18n.localeFlags;
