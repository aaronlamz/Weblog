import { siteConfig } from '@/config/site.config';
import { defaultLocale, type Locale } from '@/i18n/config';

/**
 * 国际化路由工具函数
 * 提供统一的语言路由管理，支持配置化切换
 */

/**
 * 获取语言的路由前缀
 * @param locale - 语言代码
 * @returns 路由前缀，默认语言返回空字符串
 */
export function getLocalePrefix(locale: Locale): string {
  return locale === defaultLocale ? '' : `/${locale}`;
}

/**
 * 构建本地化路径
 * @param path - 路径（如 '/blog', '/about'）
 * @param locale - 语言代码
 * @returns 完整的本地化路径
 */
export function buildLocalizedPath(path: string, locale: Locale): string {
  const prefix = getLocalePrefix(locale);
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${normalizedPath}`;
}

/**
 * 从路径中检测语言
 * @param pathname - 当前路径
 * @returns 检测到的语言或默认语言
 */
export function detectLocaleFromPath(pathname: string): Locale {
  const supportedLocales = siteConfig.i18n.locales;
  
  // 检查路径是否以任何支持的语言前缀开头（除了默认语言）
  for (const locale of supportedLocales) {
    if (locale !== defaultLocale && pathname.startsWith(`/${locale}`)) {
      return locale;
    }
  }
  
  return defaultLocale;
}

/**
 * 检查指定语言是否为默认语言
 * @param locale - 语言代码
 * @returns 是否为默认语言
 */
export function isDefaultLocale(locale: Locale): boolean {
  return locale === defaultLocale;
}

/**
 * 获取语言切换路径
 * @param currentPath - 当前路径
 * @param targetLocale - 目标语言
 * @returns 切换后的路径
 */
export function getSwitchLocalePath(currentPath: string, targetLocale: Locale): string {
  // 移除当前语言前缀
  const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  
  // 构建新路径
  return buildLocalizedPath(pathWithoutLocale, targetLocale);
}

/**
 * 获取默认语言的路径前缀用于路径检查
 * @returns 默认语言的前缀或用于检查的模式
 */
export function getDefaultLocalePrefix(): string {
  return getLocalePrefix(defaultLocale);
}

/**
 * 获取非默认语言的前缀用于路径检查
 * @returns 非默认语言的前缀数组
 */
export function getNonDefaultLocalePrefixes(): string[] {
  return siteConfig.i18n.locales
    .filter(locale => locale !== defaultLocale)
    .map(locale => `/${locale}`);
}

/**
 * 检查当前路径是否为指定语言
 * @param pathname - 当前路径
 * @param locale - 语言代码
 * @returns 是否为指定语言的路径
 */
export function isLocaleActive(pathname: string, locale: Locale): boolean {
  const detectedLocale = detectLocaleFromPath(pathname);
  return detectedLocale === locale;
}