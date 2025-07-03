# Weblog

A modern, full-featured blog built with React SSR, inspired by [nelsonlai.me](https://github.com/tszhong0411/nelsonlai.me).

## 🚀 Features

### Core Technologies
- **Next.js 15** with App Router for SSR/SSG
- **TypeScript** for type safety
- **Tailwind CSS** for modern styling
- **MDX** for rich content authoring
- **ContentLayer** for type-safe content management

### UI/UX Features
- **Responsive Design** - Works perfectly on all devices
- **Dark/Light Mode** - Automatic theme switching
- **Smooth Animations** - Powered by Framer Motion
- **Modern UI Components** - Built with Radix UI
- **Code Syntax Highlighting** - Using Shiki
- **Reading Time** - Automatic calculation for posts

### Blog Features
- **Static Generation** - Lightning-fast page loads
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards
- **RSS Feed** - Keep your readers updated
- **Tag System** - Organize your content
- **Featured Posts** - Highlight important content

### Developer Experience
- **TypeScript** - Full type safety
- **ESLint & Prettier** - Code quality and formatting
- **Hot Reload** - Instant feedback during development
- **Contentlayer** - Type-safe content with auto-completion

## 🏗️ Project Structure

```
weblog/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── blog/            # Blog pages
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── header.tsx      # Site header
│   │   ├── footer.tsx      # Site footer
│   │   └── theme-provider.tsx
│   ├── lib/                # Utility functions
│   │   ├── utils.ts        # Common utilities
│   │   └── reading-time.ts # Reading time calculation
│   └── styles/             # Global styles
│       └── globals.css     # Tailwind + custom styles
├── content/                # Blog content
│   ├── blog/              # Blog posts (MDX)
│   └── pages/             # Static pages (MDX)
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ (recommended: Node.js 22+)
- pnpm (recommended) or npm

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Run the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## 📝 Writing Content

### Creating Blog Posts

1. Create a new `.mdx` file in `content/blog/`
2. Add frontmatter with required fields:

```mdx
---
title: "Your Post Title"
description: "A brief description of your post"
date: "2024-01-01"
published: true
featured: false
tags: ["tag1", "tag2"]
author: "Your Name"
---

# Your content here

Write your blog post content using Markdown and React components.
```

### Frontmatter Fields

- `title` (required): Post title
- `description` (required): Post description for SEO
- `date` (required): Publication date (YYYY-MM-DD)
- `published` (optional): Whether the post is published (default: true)
- `featured` (optional): Mark as featured post (default: false)
- `tags` (optional): Array of tags
- `author` (optional): Author name (default: "Admin")

## 🎨 Customization

### Themes
The blog supports light and dark themes out of the box. Customize colors in:
- `tailwind.config.ts` - Tailwind configuration
- `src/styles/globals.css` - CSS custom properties

### Components
All UI components are in `src/components/ui/` and can be customized as needed.

### Styling
- Uses Tailwind CSS for utility-first styling
- Custom CSS variables for consistent theming
- Responsive design with mobile-first approach

## 📦 Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format code with Prettier
pnpm type-check       # Run TypeScript checks

# Content
pnpm db:generate      # Generate Drizzle schema
pnpm db:push          # Push database changes
pnpm db:studio        # Open Drizzle Studio

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
```

## 🚀 Deployment

This blog can be deployed to:
- **Vercel** (recommended) - Zero configuration
- **Netlify** - Great for static sites
- **Railway** - Full-stack deployment
- **Any Node.js hosting** - Self-hosted options

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

This project is inspired by and follows the architecture of:
- [nelsonlai.me](https://github.com/tszhong0411/nelsonlai.me) - An excellent Next.js blog
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
