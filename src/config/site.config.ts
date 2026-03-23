export interface SiteConfig {
  // 基本信息
  name: string
  title: string
  description: string
  url: string
  
  // 国际化配置
  i18n: {
    defaultLocale: 'zh' | 'en'
    locales: ('zh' | 'en')[]
    localeNames: Record<'zh' | 'en', string>
    localeFlags: Record<'zh' | 'en', string>
  }
  
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
    x?: string
    linkedin?: string
    email?: string
    wechat?: string
    wechatOfficialAccount?: string // 微信公众号，格式：名称（微信号）
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
  
  // UI/UX配置
  ui: {
    // 导航栏配置
    navigation: {
      enableDockEffect: boolean // 是否启用macOS Dock风格的放大效果
    }
    // 底部配置
    footer?: {
      enableFloatingBar: boolean // 是否启用底部滚动悬浮社交模块
    }
    // 背景动画配置
    background?: {
      maxCreatures: number // 首页动画背景的动物数量，最多7种（每种动物一个）
    }
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
  
  // 国际化配置 - 可以在这里轻松切换默认语言
  i18n: {
    defaultLocale: 'zh', // 修改这里可以切换默认语言：'zh' 或 'en'
    locales: ['zh', 'en'], // 支持的语言列表
    localeNames: {
      zh: '中文',
      en: 'English'
    },
    localeFlags: {
      zh: '🇨🇳',
      en: '🇺🇸'
    }
  },
  
  author: {
    name: 'Aaron', // 用户需要修改
    email: 'aaronlamz2022@gmail.com', // 用户需要修改
    avatar: 'https://github.com/aaronlamz.png', // 用户需要修改：可以是 GitHub 头像或其他图片链接
    bio: 'Developer, writer, and tech enthusiast',
  },
  
  social: {
    github: 'https://github.com/aaronlamz/Weblog', // 用户需要修改
    twitter: 'https://x.com/aaronlamz', // 用户需要修改（与 X 同步）
    x: 'https://x.com/aaronlamz', // 可选：也可使用 twitter 字段
    email: 'aaronlamz2022@gmail.com', // 用户需要修改
    // linkedin: 'https://www.linkedin.com/in/your-id', // 可选
    // wechat: 'your-wechat-id-or-link', // 可选：可填写微信号或二维码链接
    wechatOfficialAccount: '微信公众号：小林光合（gh_e55b5317b107）', // 微信公众号
  },
  
  seo: {
    keywords: ['blog', 'nextjs', 'typescript', 'web development', 'programming'],
    twitterCard: 'summary_large_image',
  },
  
  nav: {
    main: [
      { title: 'Home', href: '/' },
      { title: 'Blog', href: '/blog' },
      { title: 'Docs', href: '/docs' },
      { title: 'About', href: '/about' },
      { title: 'Contact', href: '/contact' },
    ],
  },
  
  ui: {
    navigation: {
      enableDockEffect: true, // 默认启用macOS Dock效果，可以设置为false禁用
    },
    footer: {
      enableFloatingBar: false, // 关闭全局底部滚动悬浮社交模块
    },
    background: {
      maxCreatures: 3, // 首页动画背景的动物数量，每种动物最多一个，总共7种动物类型 - 临时改为3来测试
    },
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