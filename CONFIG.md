# 🛠️ Configuration Guide

This blog is fully configurable! You can customize all aspects of the site by editing the configuration file.

## 📁 Configuration File

The main configuration file is located at: **`src/config/site.config.ts`**

## 🎯 Quick Start

1. **Clone the repository**
2. **Edit `src/config/site.config.ts`** with your information
3. **Install dependencies**: `pnpm install`
4. **Start development**: `pnpm dev`

## ⚙️ Configuration Options

### Basic Information

```typescript
{
  name: 'Your Blog Name',           // Site name displayed in header
  title: 'Your SEO Title',          // HTML title tag
  description: 'Your blog description...',  // Meta description
  url: 'https://yourdomain.com',    // Your site URL
}
```

### Author Information

```typescript
{
  author: {
    name: 'Your Name',              // Your name
    email: 'you@example.com',       // Your email (optional)
    avatar: '/avatar.jpg',          // Your avatar image (optional)
    bio: 'Brief bio about you',     // Short bio (optional)
  }
}
```

### Social Links

```typescript
{
  social: {
    github: 'https://github.com/yourusername',     // GitHub profile
    twitter: 'https://twitter.com/yourusername',   // Twitter profile
    linkedin: 'https://linkedin.com/in/you',       // LinkedIn profile
    email: 'you@example.com',                      // Contact email
  }
}
```

> **Note**: Only configured social links will be displayed in the footer and header.

### SEO Configuration

```typescript
{
  seo: {
    keywords: ['nextjs', 'blog', 'typescript'],    // SEO keywords
    ogImage: '/og-image.jpg',                       // Open Graph image (optional)
    twitterCard: 'summary_large_image',             // Twitter card type
  }
}
```

### Navigation

```typescript
{
  nav: {
    main: [
      { title: 'Home', href: '/' },
      { title: 'Blog', href: '/blog' },
      { title: 'About', href: '/about' },
      // Add more navigation items here
    ],
  }
}
```

### Page Content

#### Home Page

```typescript
{
  pages: {
    home: {
      hero: {
        title: 'Your Hero Title',
        description: 'Your hero description...',
      },
    }
  }
}
```

#### About Page

```typescript
{
  pages: {
    about: {
      title: 'About Me',
      description: 'Learn more about me...',
      content: {
        intro: 'Your introduction paragraph...',
        bio: 'Your background story...',
        currentWork: 'What you\'re currently working on...',
        beyondCode: 'Your interests outside of coding...',
        connect: 'How people can connect with you...',
        quote: 'Your favorite quote or motto...',
      },
    }
  }
}
```

## 🎨 Customization Examples

### Example 1: Tech Blogger

```typescript
export const siteConfig: SiteConfig = {
  name: 'DevTech Blog',
  title: 'Modern Web Development & Technology',
  description: 'Exploring the latest in web development, React, TypeScript, and modern tech stack.',
  url: 'https://devtech-blog.com',
  
  author: {
    name: 'Alex Developer',
    email: 'alex@devtech-blog.com',
    bio: 'Full-stack developer passionate about modern web technologies',
  },
  
  social: {
    github: 'https://github.com/alexdev',
    twitter: 'https://twitter.com/alexdev',
    email: 'alex@devtech-blog.com',
  },
  
  seo: {
    keywords: ['react', 'typescript', 'nextjs', 'web development', 'javascript'],
    twitterCard: 'summary_large_image',
  },
  
  pages: {
    home: {
      hero: {
        title: 'Modern Web Development',
        description: 'Sharing insights about React, TypeScript, and the latest web technologies.',
      },
    },
  },
}
```

### Example 2: Personal Blog

```typescript
export const siteConfig: SiteConfig = {
  name: 'Sarah\'s Journey',
  title: 'Personal Blog & Life Adventures',
  description: 'A personal blog about life, travel, and creative projects.',
  url: 'https://sarahsjourney.com',
  
  author: {
    name: 'Sarah Wilson',
    email: 'hello@sarahsjourney.com',
    bio: 'Writer, traveler, and creative soul',
  },
  
  social: {
    twitter: 'https://twitter.com/sarahwilson',
    linkedin: 'https://linkedin.com/in/sarahwilson',
    email: 'hello@sarahsjourney.com',
  },
  
  pages: {
    home: {
      hero: {
        title: 'Welcome to My World',
        description: 'Join me on my journey through life, travel, and creative adventures.',
      },
    },
    about: {
      content: {
        intro: 'Hi! I\'m Sarah, a writer and traveler sharing my adventures.',
        // ... customize other about content
      },
    },
  },
}
```

## 🚀 Advanced Configuration

### Adding Custom Navigation Items

```typescript
nav: {
  main: [
    { title: 'Home', href: '/' },
    { title: 'Blog', href: '/blog' },
    { title: 'Projects', href: '/projects' },     // Add projects page
    { title: 'Resume', href: '/resume.pdf' },     // External link
    { title: 'About', href: '/about' },
  ],
}
```

### Adding More Social Links

You can extend the social interface in `src/config/site.config.ts`:

```typescript
export interface SiteConfig {
  // ... other properties
  social: {
    github?: string
    twitter?: string
    linkedin?: string
    email?: string
    youtube?: string      // Add YouTube
    instagram?: string    // Add Instagram
    discord?: string      // Add Discord
  }
}
```

Then update the footer component to display them.

## 📝 Content Management

### Blog Posts

Create new blog posts in `content/blog/` as `.mdx` files:

```markdown
---
title: "Your Post Title"
description: "Post description"
date: "2024-01-15"
published: true
featured: false
tags: ["nextjs", "react"]
---

Your post content here...
```

### Adding New Pages

1. Create a new page component in `src/app/your-page/page.tsx`
2. Add the page to navigation in the config file
3. Optionally add page-specific configuration

## 🎭 Styling & Theming

The blog supports both light and dark themes automatically. You can customize:

- Colors in `tailwind.config.ts`
- Global styles in `src/styles/globals.css`
- Component styles in individual component files

## 🔧 Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📦 Deployment

1. **Configure your domain** in `src/config/site.config.ts`
2. **Build the project**: `pnpm build`
3. **Deploy** to your preferred platform (Vercel, Netlify, etc.)

### Environment Variables

Create a `.env.local` file for any environment-specific configurations:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🤝 Contributing

Feel free to customize this blog template to your needs! If you create useful features or improvements, consider contributing back to the project.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy blogging! 🎉**