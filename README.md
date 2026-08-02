# Weblog

[Live site](https://www.justexploring.fun/) · [简体中文](README.zh-CN.md)

A personal space for essays, visual stories, and topic-based handbooks. Built with Next.js 15, TypeScript, Tailwind CSS, MDX, and `next-intl`.

## What is included

- **Essays** — bilingual long-form writing in MDX, with tags, reading time, navigation, and Giscus comments.
- **Plog** — a date-based life timeline with an auto-rotating photo grid. Each entry opens as an immersive, autoplaying slideshow with captions, fullscreen mode, and optional background music.
- **Docs** — bilingual handbooks grouped by topic, with chapter navigation and previous/next links.
- **Internationalization** — English is the default language at `/`; Chinese is available under `/zh`.
- **Static delivery** — fully exported pages, feeds, dark mode, responsive layout, and GitHub Pages deployment.

## Project structure

```text
Weblog/
├── content/
│   ├── blog/
│   │   ├── en/                 # English essays
│   │   └── zh/                 # Chinese essays
│   └── docs/
│       ├── en/<category>/      # English handbook chapters
│       └── zh/<category>/      # Chinese handbook chapters
├── public/
│   └── plog/                   # Plog photos and licensed music
├── src/
│   ├── app/[locale]/           # App Router pages
│   ├── components/
│   ├── config/
│   │   ├── site.config.ts      # Site, author, locale, navigation, and UI settings
│   │   └── plog.config.ts      # Plog entries, slides, dates, and soundtracks
│   ├── i18n/
│   └── lib/
└── .github/workflows/
    └── dual-deploy.yml         # Root-domain and sub-path deployment
```

## Local development

Requirements: Node.js 18+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Useful checks:

```bash
pnpm type-check
pnpm build
pnpm test
pnpm test:e2e
```

The production build uses Next.js static export and writes the result to `out/`.

## Configuration

The main settings live in [`src/config/site.config.ts`](src/config/site.config.ts):

- Site title, description, canonical URL, and custom domain
- Author profile and social links
- SEO keywords and social card settings
- Main navigation and UI options
- Supported locales and default locale

The current locale configuration is:

```ts
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'zh'],
}
```

The default locale has no URL prefix. Chinese pages use `/zh`.

## Adding content

### Essays

Add matching MDX files under `content/blog/en` and `content/blog/zh` when both languages are available.

```mdx
---
title: "A title"
date: "2026-08-02"
summary: "A short description."
tags: ["notes"]
featured: false
published: true
---

Essay content goes here.
```

`description` can be used instead of `summary`. Setting `published: false` keeps an essay out of public lists and feeds.

### Handbooks

Each directory under `content/docs/<locale>/` is one handbook category:

```text
content/docs/en/getting-started/
├── _meta.json
├── introduction.mdx
└── setup.mdx
```

`_meta.json` defines the category title, description, icon, and order. Each chapter uses `title`, `description`, and `order` in its frontmatter. Keep the English and Chinese category/filename structure aligned so language switching stays on the equivalent page.

### Plog stories

Plog data is configured in [`src/config/plog.config.ts`](src/config/plog.config.ts). One entry represents one complete experience rather than one photo.

Every entry contains:

- A unique `slug`
- Bilingual title and description
- An ISO date (`YYYY-MM-DD`) used for timeline sorting
- An optional bilingual location
- A sequence of photos with time, title, and caption
- Optional soundtrack presets

Store photos under `public/plog/<entry-name>/`. The Plog index automatically groups entries by year and sorts them newest first. When an album contains more than four photos, the preview grid continues rotating through the full set.

Background music files live in `public/plog/music/`. Keep [`public/plog/music/LICENSE.md`](public/plog/music/LICENSE.md) updated whenever a track is added or replaced.

## Environment variables

Create `.env.local` when a custom local URL or base path is needed:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BASE_PATH=
```

`BASE_PATH` must start with `/` and must not have a trailing slash.

## Feeds

Published essays are exposed through:

- `/rss.xml`
- `/rss.json`
- `/atom.xml`

## Deployment

Pushing to `main` triggers [`.github/workflows/dual-deploy.yml`](.github/workflows/dual-deploy.yml). The workflow builds and publishes two static variants:

1. A sub-path build at `https://aaronlamz.github.io/Weblog/`
2. A root build for `https://www.justexploring.fun/`, deployed to `aaronlamz/aaronlamz.github.io`

The root deployment requires the `PERSONAL_ACCESS_TOKEN` repository secret. `site.config.ts` supplies the custom domain and default locale used by the workflow.

## License

The source code is licensed under MIT. Third-party media keeps its own license; see the credit file beside the relevant assets.
