# 🚀 Configurable Next.js Blog Template

A modern, **fully configurable** blog template built with Next.js 15 and TypeScript. Perfect for developers, writers, and content creators who want a professional blog without the complexity.

**✨ Everything is configurable** - Just edit one file and you're ready to go!

## 🚀 Features

### 🎯 Configuration-First Design
- **Single Config File** - Configure everything in `src/config/site.config.ts`
- **Zero Setup** - Edit config and start writing
- **Type Safe** - Full TypeScript support for configuration
- **Flexible** - Add/remove features as needed

### Core Technologies
- **Next.js 15** with App Router for SSR/SSG
- **TypeScript** for type safety
- **Tailwind CSS** for modern styling
- **MDX** for rich content authoring
- **React Markdown** for reliable content rendering

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
- **File-based Routing** - Automatic route generation
- **Zero Config** - Works out of the box

## 🏗️ Project Structure

```
weblog/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── blog/            # Blog pages
│   │   ├── about/           # About page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── header.tsx      # Site header
│   │   ├── footer.tsx      # Site footer
│   │   └── theme-provider.tsx
│   ├── config/             # Configuration
│   │   └── site.config.ts  # 🎯 Main configuration file
│   ├── lib/                # Utility functions
│   │   ├── posts.ts        # Blog post utilities
│   │   ├── utils.ts        # Common utilities
│   │   └── reading-time.ts # Reading time calculation
│   └── styles/             # Global styles
│       └── globals.css     # Tailwind + custom styles
├── content/                # Blog content
│   └── blog/              # Blog posts (MDX)
├── public/                # Static assets
├── CONFIG.md              # 📖 Detailed configuration guide
└── package.json           # Dependencies and scripts
```

## ⚡ Quick Configuration

**Get your blog ready in 2 minutes!**

1. **Clone this repository**
2. **Edit `src/config/site.config.ts`** with your information:

```typescript
export const siteConfig = {
  name: 'Your Blog Name',
  title: 'Your SEO Title',
  description: 'Your blog description...',
  url: 'https://yourdomain.com',
  
  author: {
    name: 'Your Name',
    email: 'you@example.com',
  },
  
  social: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    email: 'you@example.com',
  },
  
  // ... customize everything else
}
```

3. **Start writing** - Add your posts to `content/blog/`
4. **Deploy** - Push to GitHub and deploy to Vercel/Netlify

📖 **Need more details?** Check out [CONFIG.md](CONFIG.md) for the complete configuration guide.

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

Simply create `.mdx` files in `content/blog/` with frontmatter:

```mdx
---
title: "Your Amazing Post"
description: "What this post is about"
date: "2024-01-15"
published: true
featured: false
tags: ["nextjs", "react"]
---

# Your Amazing Post

Write your content here using **Markdown** and React components!

```typescript
// Code blocks work perfectly
const blog = "awesome";
```

That's it! Your post will automatically appear on your blog.
```

### Frontmatter Options

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Post title |
| `description` | ✅ | SEO description |
| `date` | ✅ | Publication date (YYYY-MM-DD) |
| `published` | ❌ | Show/hide post (default: true) |
| `featured` | ❌ | Featured post (default: false) |
| `tags` | ❌ | Array of tags |

## 🎨 Customization

**Everything is customizable!** 

### 🎯 Quick Customization
- **Site Info**: Edit `src/config/site.config.ts`
- **Colors**: Modify `tailwind.config.ts`
- **Styles**: Update `src/styles/globals.css`

### 🎭 Themes
- **Auto Theme Detection** - Respects system preference
- **Manual Toggle** - Users can switch themes
- **Custom Colors** - Easy to modify in config

### 🧩 Components
- **Modular Design** - Components in `src/components/`
- **Reusable UI** - Consistent design system
- **Easy to Extend** - Add your own components

📖 **Advanced customization**: See [CONFIG.md](CONFIG.md) for detailed guides.

## 📦 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

**That's it!** Simple and clean. 🎉

## 🚀 Deployment

**Deploy anywhere in minutes!**

### Recommended: Vercel (Zero Config)
1. **Configure** your blog in `src/config/site.config.ts`
2. **Push** to GitHub
3. **Deploy** - Connect to Vercel
4. **Done!** Your blog is live

### Other Options
- **Netlify** - Drag & drop deployment
- **Railway** - Full-stack hosting
- **GitHub Pages** - Free static hosting
- **Your server** - Any Node.js environment

⚠️ **Don't forget**: Update your `url` in the config file to match your domain!

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **⭐ Star** this repository if you find it useful
2. **🐛 Report bugs** by opening an issue
3. **💡 Suggest features** for new functionality
4. **🔧 Submit PRs** for improvements
5. **📖 Improve docs** - help others get started

## 📄 License

This project is **MIT licensed** - feel free to use it for personal or commercial projects!

## 🌟 Show Your Support

- ⭐ **Star this repo** if it helped you
- 🐦 **Share on Twitter** - spread the word
- 💬 **Join discussions** - help the community
- 🤝 **Contribute** - make it even better

## 🙏 Built With

- 🚀 **[Next.js](https://nextjs.org/)** - The React framework
- 🎨 **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- ⚡ **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- 🧩 **[Radix UI](https://www.radix-ui.com/)** - Accessible components

---

**Made with ❤️ for the developer community**

*Happy blogging! 🎉*
