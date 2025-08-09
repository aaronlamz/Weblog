export interface SiteConfig {
  // 基本信息
  name: string
  title: string
  description: string
  url: string
  
  // 作者信息
  author: {
    name: string
    email?: string
    avatar?: string
    bio?: string
  }
  
  // 社交链接
  social: {
    github?: string
    twitter?: string
    linkedin?: string
    email?: string
  }
  
  // SEO配置
  seo: {
    keywords: string[]
    ogImage?: string
    twitterCard: 'summary' | 'summary_large_image'
  }
  
  // 导航配置
  nav: {
    main: Array<{
      title: string
      href: string
    }>
  }
  
  // 页面配置
  pages: {
    home: {
      hero: {
        title: string
        description: string
      }
    }
    about: {
      title: string
      description: string
      content: {
        intro: string
        bio: string
        currentWork: string
        beyondCode: string
        connect: string
        quote: string
      }
    }
  }
}

export const siteConfig: SiteConfig = {
  name: 'Weblog',
  title: 'Personal Blog & Portfolio',
  description: 'A modern blog built with Next.js, TypeScript, and Tailwind CSS. Share your thoughts, tutorials, and projects with the world.',
  // 站点基础 URL：支持 GitHub Pages 子路径 (BASE_PATH) 和自定义域
  // 例如：
  // - 自定义域 + 子路径: https://www.ultimate-kernel.fun/Weblog
  // - GitHub Pages 用户页（无子路径）: https://<user>.github.io
  // - 本地开发: http://localhost:3000
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${process.env.BASE_PATH || ''}`,
  
  author: {
    name: 'Aaron', // 用户需要修改
    email: 'aaronlamz2022@gmail.com', // 用户需要修改
    bio: 'Developer, writer, and tech enthusiast',
  },
  
  social: {
    github: 'https://github.com/aaronlamz', // 用户需要修改
    twitter: 'https://x.com/aaronlamz', // 用户需要修改
    email: 'aaronlamz2022@gmail.com', // 用户需要修改
  },
  
  seo: {
    keywords: ['blog', 'nextjs', 'typescript', 'web development', 'programming'],
    twitterCard: 'summary_large_image',
  },
  
  nav: {
    main: [
      { title: 'Home', href: '/' },
      { title: 'Blog', href: '/blog' },
      { title: 'About', href: '/about' },
      { title: 'Contact', href: '/contact' },
    ],
  },
  
  pages: {
    home: {
      hero: {
        title: 'Welcome to My Blog',
        description: 'I write about web development, technology, and share my journey as a developer. Explore my thoughts, tutorials, and projects.',
      },
    },
    about: {
      title: 'About Me',
      description: 'Learn more about me and this blog.',
      content: {
        intro: 'Hi there! 👋 I\'m a developer who loves building things for the web. This little corner of the internet is where I share my thoughts, experiments, and learnings about technology and life.',
        bio: 'I started this blog as a way to document my journey and connect with like-minded people. You\'ll find posts about web development, new technologies I\'m exploring, and occasionally some non-tech musings.',
        currentWork: 'Currently, I\'m focused on modern web technologies - mainly React, TypeScript, and various frameworks that make building for the web more enjoyable. I love experimenting with new tools and sharing what I learn along the way.',
        beyondCode: 'When I\'m not coding, I enjoy reading, exploring new places, and always learning something new. I believe the best ideas often come from outside our usual domains.',
        connect: 'Feel free to reach out if you want to chat about anything you\'ve read here, collaborate on something interesting, or just say hi. I\'m always excited to meet new people and hear different perspectives.',
        quote: 'The best way to learn is to teach, and the best way to teach is to keep learning.',
      },
    },
  },
}

export default siteConfig