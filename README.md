# 🚀 Configurable Next.js Blog Template

Choose your language: [English](README.md) | [简体中文](README.zh-CN.md)

A modern, fully configurable blog template built with Next.js 15, TypeScript, Tailwind CSS, and MDX. Configure once, write content, and deploy anywhere.

## ✨ Highlights

- **Single config file**: `src/config/site.config.ts`
- **i18n-ready**: Configurable default language, Chinese (`/`) and English (`/en`) by default
- **MDX content**: `content/blog/<locale>/*.mdx`
- **Static export by default**: production builds generate `out/` for static hosting
- **Built-ins**: RSS/Atom/JSON feeds, dark mode, animated UI, reading time

## 🏗️ Structure

```
weblog/
├── content/
│   └── blog/
│       ├── en/           # English posts
│       └── zh/           # Chinese posts
├── src/
│   ├── app/              # Routes (App Router)
│   ├── components/
│   ├── config/
│   │   └── site.config.ts
│   ├── i18n/
│   └── lib/
└── out/                  # Static build output (after `pnpm build`)
```

## ⚡ Quick Start

1) Use this repo as a template (recommended) or clone it
2) Install dependencies

```bash
pnpm install
```

3) Start dev server

```bash
pnpm dev
```

Open http://localhost:3000

## 🔧 Configure

Edit `src/config/site.config.ts`:

- **Basics**: `name`, `title`, `description`
- **URL**: Derived from env `NEXT_PUBLIC_SITE_URL` + `BASE_PATH`
- **Author**: `author.name`, `author.email`, `author.bio`
- **Social**: `social.github`, `social.twitter`, `social.email`
- **SEO**: `seo.keywords`, `seo.ogImage`, `seo.twitterCard`
- **Nav**: `nav.main`
- **Pages**: `pages.home`, `pages.about`

i18n settings are in `src/config/site.config.ts`:

- `locales`: `['zh', 'en']` (configurable order)
- `defaultLocale`: `'zh'` (configurable: 'zh' or 'en')
- URL style: Default language has no prefix, secondary language uses prefix
- **Auto-deployment**: GitHub Actions automatically uses your configured default language

## 🌍 Content

Place MDX files under the locale folders:

```
content/blog/en/hello-world.mdx
content/blog/zh/hello-world.mdx
```

Frontmatter example:

```mdx
---
title: "Your Amazing Post"
description: "Short summary for SEO"
date: "2024-01-15"
published: true
featured: false
tags: ["nextjs", "react"]
---

# Your Amazing Post
```

Fields: `title` (required), `description` (required), `date` (YYYY-MM-DD), `published` (default: true), `featured` (default: false), `tags`.

## 🔐 Environment Variables

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
BASE_PATH=
```

- For GitHub Pages (repo `Weblog`):

```bash
NEXT_PUBLIC_SITE_URL=https://<user>.github.io/Weblog
BASE_PATH=/Weblog
```

- For GitHub Pages (user site):

```bash
NEXT_PUBLIC_SITE_URL=https://<user>.github.io
BASE_PATH=
```

Notes:

- Include a leading slash in `BASE_PATH` (e.g. `/Weblog`), no trailing slash.
- Update DNS or custom domain to match `NEXT_PUBLIC_SITE_URL` when applicable.

## 🛠️ Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build (static export → ./out)
pnpm lint         # ESLint
pnpm format       # Prettier format
```

## 📡 Feeds

Feeds are generated from English posts and exposed at:

- `/rss.xml`
- `/rss.json`
- `/atom.xml`

Set `author` and `seo.ogImage` in `site.config.ts` for correct feed metadata.

## 🚀 Deploy

This template defaults to static export in production. After `pnpm build`, deploy the `out/` directory.

### Deployment Options:
- **Vercel**: Import repo → Build command `pnpm build` → Output `out/` (auto-detects)
- **Netlify**: Build command `pnpm build` → Publish directory `out/`
- **GitHub Pages**: Included workflow automatically handles deployment

### GitHub Pages Configuration:
The included `.github/workflows/deploy.yml` automatically:
1. Reads your `defaultLocale` from `site.config.ts`
2. Places the default language content at the root (`/`)
3. Handles `BASE_PATH` configuration for subpath deployments

**No manual configuration needed** - just push to main branch!

Troubleshooting:
- Broken links → verify `BASE_PATH` in environment variables
- Wrong default language → check `defaultLocale` in `site.config.ts`
- 404 errors → ensure content exists for both languages

## 📖 More Docs

See [CONFIG.md](CONFIG.md) for deeper customization.

## 🤝 Contributing & 📄 License

Contributions are welcome. Licensed under MIT.

— Happy blogging!
