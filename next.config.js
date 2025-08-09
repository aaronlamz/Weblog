// 移除 Contentlayer 依赖
// const { withContentlayer } = require('next-contentlayer2')

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 支持静态导出 (GitHub Pages/Netlify) - 仅在构建时启用
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    images: { unoptimized: true },
    basePath: process.env.BASE_PATH || '',
    assetPrefix: process.env.BASE_PATH || '',
  }),
  experimental: {
    typedRoutes: true,
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 重定向仅在非静态导出模式下生效
  ...(process.env.NODE_ENV !== 'production' && {
    async redirects() {
      return [
        {
          source: '/en',
          destination: '/',
          permanent: false,
        },
        {
          source: '/en/:path*',
          destination: '/:path*',
          permanent: false,
        },
      ]
    },
  }),
}

module.exports = withNextIntl(nextConfig); 