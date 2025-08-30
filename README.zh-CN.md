# 🚀 可配置的 Next.js 博客模版

选择语言： [English](README.md) | [简体中文](README.zh-CN.md)

基于 Next.js 15、TypeScript、Tailwind CSS 和 MDX 的现代博客模版。一次配置，专注写作，随处部署。

## ✨ 特性亮点

- **单文件配置**：`src/config/site.config.ts`
- **内置国际化**：可配置默认语言，默认中文（`/`）与英文（`/en`）
- **MDX 内容**：`content/blog/<locale>/*.mdx`
- **默认静态导出**：生产构建生成 `out/`，适合静态托管
- **开箱即用**：RSS/Atom/JSON 订阅、暗黑模式、动画、阅读时长

## 🏗️ 目录结构

```
weblog/
├── content/
│   └── blog/
│       ├── en/           # 英文文章
│       └── zh/           # 中文文章
├── src/
│   ├── app/              # 路由（App Router）
│   ├── components/
│   ├── config/
│   │   └── site.config.ts
│   ├── i18n/
│   └── lib/
└── out/                  # 生产静态产物（执行 `pnpm build` 后）
```

## ⚡ 快速开始

1）使用本仓库作为模版（推荐）或直接 clone
2）安装依赖

```bash
pnpm install
```

3）启动开发服务器

```bash
pnpm dev
```

打开浏览器访问：http://localhost:3000

## 🔧 基础配置

编辑 `src/config/site.config.ts`：

- **基础信息**：`name`、`title`、`description`
- **站点 URL**：由环境变量 `NEXT_PUBLIC_SITE_URL` + `BASE_PATH` 组合
- **作者信息**：`author.name`、`author.email`、`author.bio`
- **社交链接**：`social.github`、`social.twitter`、`social.email`
- **SEO**：`seo.keywords`、`seo.ogImage`、`seo.twitterCard`
- **导航**：`nav.main`
- **页面**：`pages.home`、`pages.about`

国际化配置在 `src/config/site.config.ts`：

- `locales`: `['zh', 'en']`（可配置顺序）
- `defaultLocale`: `'zh'`（可配置：'zh' 或 'en'）
- URL 风格：默认语言无前缀，第二语言有前缀
- **自动部署**：GitHub Actions 自动使用你配置的默认语言

## 🌍 写作与内容

将 MDX 文件放到对应语言目录：

```
content/blog/en/hello-world.mdx
content/blog/zh/hello-world.mdx
```

Frontmatter 示例：

```mdx
---
title: "你的第一篇文章"
description: "用于 SEO 的简要摘要"
date: "2024-01-15"
published: true
featured: false
tags: ["nextjs", "react"]
---

# 你的第一篇文章
```

字段说明：`title`（必填）、`description`（必填）、`date`（YYYY-MM-DD）、`published`（默认 true）、`featured`（默认 false）、`tags`。

## 🔐 环境变量

在项目根目录创建 `.env.local`：

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
BASE_PATH=
```

- GitHub Pages（仓库名 `Weblog`）示例：

```bash
NEXT_PUBLIC_SITE_URL=https://<user>.github.io/Weblog
BASE_PATH=/Weblog
```

- GitHub Pages（用户主页）示例：

```bash
NEXT_PUBLIC_SITE_URL=https://<user>.github.io
BASE_PATH=
```

注意事项：

- `BASE_PATH` 需带前导斜杠（如 `/Weblog`），不要带尾斜杠。
- 使用自定义域名时，请确保与 `NEXT_PUBLIC_SITE_URL` 保持一致。

## 🛠️ 常用脚本

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建（静态导出 → ./out）
pnpm lint         # 代码检查
pnpm format       # 代码格式化
```

## 📡 订阅与 RSS

系统会基于英文文章生成订阅源：

- `/rss.xml`
- `/rss.json`
- `/atom.xml`

请在 `site.config.ts` 设置 `author` 与 `seo.ogImage` 以确保订阅信息正确。

## 🚀 部署

本模版生产环境默认采用静态导出。执行 `pnpm build` 后，把 `out/` 目录部署到任意静态托管平台即可。

### 部署选项：
- **Vercel**：导入仓库 → 构建命令 `pnpm build` → 输出目录 `out/`（自动识别）
- **Netlify**：构建命令 `pnpm build` → 发布目录 `out/`
- **GitHub Pages**：内置工作流自动处理部署

### GitHub Pages 配置：
内置的 `.github/workflows/deploy.yml` 自动：
1. 从 `site.config.ts` 读取你的 `defaultLocale` 配置
2. 将默认语言内容放置在根路径（`/`）
3. 处理子路径部署的 `BASE_PATH` 配置

**无需手动配置** - 只需推送到 main 分支！

常见问题：
- 链接 404 → 检查环境变量中的 `BASE_PATH`
- 默认语言错误 → 检查 `site.config.ts` 中的 `defaultLocale`
- 404 错误 → 确保两种语言的内容都存在

## 📖 更多文档

详见 [CONFIG.md](CONFIG.md) 获取更深入的自定义说明。

## 🤝 贡献与协议

欢迎贡献。遵循 MIT 协议。

— 祝写作愉快！

