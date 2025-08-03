const { withContentlayer } = require('next-contentlayer2')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 支持静态导出 (GitHub Pages/Netlify)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? process.env.BASE_PATH || '' : '',
  experimental: {
    appDir: true,
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
  async redirects() {
    return []
  },
  async rewrites() {
    return []
  },
}

module.exports = withContentlayer(nextConfig) 