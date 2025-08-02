import { siteConfig } from '@/config/site.config'

export function Footer() {
  const socialLinks = [
    { 
      name: 'GitHub', 
      href: siteConfig.social.github,
      external: true 
    },
    { 
      name: 'Twitter', 
      href: siteConfig.social.twitter,
      external: true 
    },
    { 
      name: 'LinkedIn', 
      href: siteConfig.social.linkedin,
      external: true 
    },
    { 
      name: 'RSS', 
      href: '/rss.xml',
      external: false 
    },
  ].filter(link => link.href) // 只显示配置了的链接

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {socialLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
} 