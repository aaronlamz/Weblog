import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  // 默认语言 zh 无前缀，英文 /en
  localePrefix: 'as-needed',
  // 禁用基于浏览器语言的自动重定向，始终使用默认语言
  localeDetection: false
});

export const config = {
  // 让中间件匹配并处理所有页面（排除 _next、api 和静态资源）
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
