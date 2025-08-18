# 🚀 Configurable Next.js Blog Template

Choose your language: [English](README.md) | [简体中文](README.zh-CN.md)

A modern, fully configurable blog template built with Next.js 15, TypeScript, Tailwind CSS, and MDX. Configure once, write content, and deploy anywhere.

## ✨ Highlights

- **Single config file**: `src/config/site.config.ts`
- **i18n-ready**: English (`/`) and Chinese (`/zh`) out of the box
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

i18n settings are in `src/i18n/config.ts`:

- `locales`: `['en', 'zh']`
- `defaultLocale`: `'en'`
- URL style: English has no prefix, Chinese uses `/zh`

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

- Vercel: Import repo → Build command `pnpm build` → Output `out/` (Vercel auto-detects).
- Netlify: Build command `pnpm build` → Publish directory `out/`.
- GitHub Pages: Build `out/` and publish it (e.g. via Actions). Ensure `BASE_PATH` is set correctly.

Troubleshooting:

- Broken links or missing assets on subpaths → set `BASE_PATH` correctly (e.g. `/Weblog`).
- 404 on `/zh` → make sure `content/blog/zh` exists and has at least one `.mdx`.

## 📖 More Docs

See [CONFIG.md](CONFIG.md) for deeper customization.

## 🤝 Contributing & 📄 License

Contributions are welcome. Licensed under MIT.

— Happy blogging!
