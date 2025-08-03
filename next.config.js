// 移除 Contentlayer 依赖
// const { withContentlayer } = require('next-contentlayer2')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 支持静态导出 (GitHub Pages/Netlify)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? process.env.BASE_PATH || '' : '',
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
  // 移除 redirects 和 rewrites，因为它们与 export 不兼容
  // async redirects() {
  //   return []
  // },
  // async rewrites() {
  //   return []
  // },
}

module.exports = nextConfig
// module.exports = withContentlayer(nextConfig) 