# Weblog

[访问网站](https://www.justexploring.fun/) · [English](README.md)

一个用于整理长文、影像经历与专题手册的个人空间。基于 Next.js 15、TypeScript、Tailwind CSS、MDX 和 `next-intl` 构建。

## 现有内容

- **思考（Essays）**：使用 MDX 编写的双语长文，支持标签、阅读时长、前后篇导航与 Giscus 评论。
- **Plog**：按日期整理的生活时间线。首页相册宫格会自动换图，详情页支持自动播放、图文说明、全屏沉浸模式和可选背景音乐。
- **手册（Docs）**：按主题分类的双语小册，支持章节侧栏以及前后章导航。
- **多语言**：英文是默认语言并位于根路径 `/`，中文位于 `/zh`。
- **静态站点**：支持完整静态导出、RSS/Atom/JSON Feed、暗黑模式、响应式布局和 GitHub Pages 部署。

## 项目结构

```text
Weblog/
├── content/
│   ├── blog/
│   │   ├── en/                 # 英文长文
│   │   └── zh/                 # 中文长文
│   └── docs/
│       ├── en/<category>/      # 英文手册章节
│       └── zh/<category>/      # 中文手册章节
├── public/
│   └── plog/                   # Plog 图片和已授权音乐
├── src/
│   ├── app/[locale]/           # App Router 页面
│   ├── components/
│   ├── config/
│   │   ├── site.config.ts      # 网站、作者、语言、导航和 UI 配置
│   │   └── plog.config.ts      # Plog、时间、幻灯片和音乐配置
│   ├── i18n/
│   └── lib/
└── .github/workflows/
    └── dual-deploy.yml         # 根域名与子路径双部署
```

## 本地开发

需要 Node.js 18+ 和 pnpm。

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。常用检查命令：

```bash
pnpm type-check
pnpm build
pnpm test
pnpm test:e2e
```

生产构建使用 Next.js 静态导出，结果写入 `out/`。

## 网站配置

主要配置位于 [`src/config/site.config.ts`](src/config/site.config.ts)：

- 网站标题、描述、规范 URL 和自定义域名
- 作者资料与社交链接
- SEO 关键词和分享卡片
- 主导航和 UI 选项
- 支持的语言和默认语言

当前语言配置为：

```ts
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'zh'],
}
```

默认语言不带路径前缀，中文页面统一使用 `/zh`。

## 新增内容

### 长文

文章存放在 `content/blog/en` 和 `content/blog/zh`。如果提供两种语言，应使用相同文件名。

```mdx
---
title: "文章标题"
date: "2026-08-02"
summary: "简短说明。"
tags: ["笔记"]
featured: false
published: true
---

正文写在这里。
```

`summary` 也可以替换为 `description`。设置 `published: false` 后，文章不会出现在公开列表和订阅源中。

### 专题手册

`content/docs/<locale>/` 下的每个目录代表一本手册：

```text
content/docs/zh/getting-started/
├── _meta.json
├── introduction.mdx
└── setup.mdx
```

`_meta.json` 配置手册标题、说明、图标和排序；每个章节通过 Frontmatter 中的 `title`、`description` 和 `order` 排序。中英文应保持相同的目录及文件名，确保切换语言后仍然位于对应章节。

### Plog 经历

Plog 位于 [`src/config/plog.config.ts`](src/config/plog.config.ts)。一篇 Plog 代表一次完整经历，而不是一张照片。

每篇内容包括：

- 唯一的 `slug`
- 中英文标题与说明
- 用于时间线排序的 ISO 日期（`YYYY-MM-DD`）
- 可选的中英文地点
- 按顺序排列的照片、时刻、标题和说明
- 可选的背景音乐预设

图片放在 `public/plog/<entry-name>/`。Plog 首页会自动按年份整理并倒序排列；当一篇内容超过四张照片时，首页宫格会继续从整组照片中自动轮换。

背景音乐存放在 `public/plog/music/`。新增或替换音乐时，需要同步更新 [`public/plog/music/LICENSE.md`](public/plog/music/LICENSE.md)，保留来源与授权信息。

## 环境变量

需要自定义本地地址或子路径时，在项目根目录创建 `.env.local`：

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BASE_PATH=
```

`BASE_PATH` 必须以 `/` 开头，并且不能带尾部斜杠。

## 订阅源

已发布文章会生成：

- `/rss.xml`
- `/rss.json`
- `/atom.xml`

## 部署

推送到 `main` 会触发 [`.github/workflows/dual-deploy.yml`](.github/workflows/dual-deploy.yml)，分别生成并发布两个静态版本：

1. 子路径版本：`https://aaronlamz.github.io/Weblog/`
2. 根路径版本：`https://www.justexploring.fun/`，发布到 `aaronlamz/aaronlamz.github.io`

根路径部署依赖仓库 Secret `PERSONAL_ACCESS_TOKEN`。工作流会读取 `site.config.ts` 中的自定义域名和默认语言配置。

## 协议

源代码遵循 MIT 协议。第三方媒体继续遵循各自授权，具体来源记录在对应资源目录中。
