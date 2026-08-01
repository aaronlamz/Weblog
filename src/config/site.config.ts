export interface SiteConfig {
  // 基本信息
  name: string
  title: string
  description: string
  url: string

  // 自定义域名（用于 GitHub Pages CNAME，不含协议前缀）
  customDomain?: string
  
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
  title: 'Notes & Ideas',
  description: 'Personal notes on ideas, investing, finance, technology, and things learned along the way.',
  // 站点基础 URL：支持 GitHub Pages 子路径 (BASE_PATH) 和自定义域
  // 例如：
  // - 自定义域 + 子路径: https://www.justexploring.fun/Weblog
  // - GitHub Pages 用户页（无子路径）: https://<user>.github.io
  // - 本地开发: http://localhost:3000
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${process.env.BASE_PATH || ''}`,

  // 自定义域名 — 部署时自动生成 CNAME 文件
  customDomain: 'www.justexploring.fun',
  
  // 国际化配置 - 可以在这里轻松切换默认语言
  i18n: {
    defaultLocale: 'en', // 英文为默认语言；中文使用 /zh 前缀
    locales: ['en', 'zh'], // 英文优先；中文使用 /zh 前缀
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
    bio: 'Writing about ideas, markets, technology, and everyday life.',
  },
  
  social: {
    github: 'https://github.com/aaronlamz',
    twitter: 'https://x.com/aaronlamz', // 用户需要修改（与 X 同步）
    x: 'https://x.com/aaronlamz', // 可选：也可使用 twitter 字段
    email: 'aaronlamz2022@gmail.com', // 用户需要修改
    // linkedin: 'https://www.linkedin.com/in/your-id', // 可选
    // wechat: 'your-wechat-id-or-link', // 可选：可填写微信号或二维码链接
  },
  
  seo: {
    keywords: ['personal blog', 'investing', 'finance', 'quantitative finance', 'technology', 'notes'],
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
        title: 'Hello, I’m Aaron.',
        description: 'A personal space for notes, ideas, and things worth remembering.',
      },
    },
    about: {
      title: 'About Me',
      description: 'Learn more about me and this blog.',
      content: {
        intro: 'This is where I keep thoughts, observations, and lessons gathered from work and everyday life.',
        bio: 'The writing spans markets, technology, personal interests, and whatever feels worth exploring.',
        currentWork: 'I work in the securities industry and stay curious about markets, products, and new ideas.',
        beyondCode: 'Outside work, I enjoy reading, training, exploring new places, and learning from unfamiliar fields.',
        connect: 'Feel free to reach out if you want to chat about anything you\'ve read here, collaborate on something interesting, or just say hi. I\'m always excited to meet new people and hear different perspectives.',
        quote: 'The best way to learn is to teach, and the best way to teach is to keep learning.',
      },
    },
  },
}

export default siteConfig
