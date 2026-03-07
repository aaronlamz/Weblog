'use client'

import { siteConfig } from '@/config/site.config'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Github, Twitter, Linkedin, Mail, QrCode, ExternalLink, Copy, Check, Eye, MessageSquare } from 'lucide-react'

type ContactItem = {
  name: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  labelKey: string
  external?: boolean
  copyValue?: string
  isImageLink?: boolean
}

function isHttpUrl(value?: string) {
  if (!value) return false
  return /^https?:\/\//i.test(value)
}

function trimProtocol(url: string) {
  return url.replace(/^https?:\/\//i, '')
}

function isImageUrl(url?: string) {
  if (!url) return false
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(url)
}

export function ContactLinks() {
  const t = useTranslations('contact.methods')
  const xLink = siteConfig.social.x || siteConfig.social.twitter
  const itemsRaw: ContactItem[] = [
    {
      name: 'Email',
      href: siteConfig.social.email ? `mailto:${siteConfig.social.email}` : undefined,
      icon: Mail,
      labelKey: 'email.name',
      external: false,
      copyValue: siteConfig.social.email,
    },
    {
      name: 'GitHub',
      href: siteConfig.social.github,
      icon: Github,
      labelKey: 'github.name',
      external: true,
      copyValue: siteConfig.social.github,
    },
    {
      name: 'X',
      href: xLink,
      icon: Twitter,
      labelKey: 'x.name',
      external: true,
      copyValue: xLink,
    },
    {
      name: 'LinkedIn',
      href: siteConfig.social.linkedin,
      icon: Linkedin,
      labelKey: 'linkedin.name',
      external: true,
      copyValue: siteConfig.social.linkedin,
    },
    {
      name: 'WeChat',
      href: isHttpUrl(siteConfig.social.wechat) ? siteConfig.social.wechat : undefined,
      icon: QrCode,
      labelKey: 'wechat.name',
      external: true,
      copyValue: siteConfig.social.wechat,
      isImageLink: isImageUrl(siteConfig.social.wechat),
    },
    {
      name: 'WeChatOfficialAccount',
      href: undefined,
      icon: MessageSquare,
      labelKey: 'wechatOfficialAccount.name',
      external: false,
      copyValue: siteConfig.social.wechatOfficialAccount,
    },
  ]

  const items = itemsRaw.filter(item => {
    // 只渲染配置过的渠道：邮箱/各平台任一字段非空即可
    switch (item.name) {
      case 'Email':
        return Boolean(siteConfig.social.email)
      case 'GitHub':
        return Boolean(siteConfig.social.github)
      case 'X':
        return Boolean(xLink)
      case 'LinkedIn':
        return Boolean(siteConfig.social.linkedin)
      case 'WeChat':
        return Boolean(siteConfig.social.wechat)
      case 'WeChatOfficialAccount':
        return Boolean(siteConfig.social.wechatOfficialAccount)
      default:
        return false
    }
  })
  if (items.length === 0) return null

  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [previewKey, setPreviewKey] = useState<string | null>(null)

  const handleCopy = async (key: string, value?: string) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1600)
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="mt-4">
      <ul className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon
          const isLink = Boolean(item.href)
          const showPreview = previewKey === item.name
          return (
            <li
              key={item.name}
              className="relative group flex items-center gap-3 rounded-xl px-3 py-2.5 lg-card cursor-default transition-all"
            >
              {/* 图标 */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.55)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(200,210,230,0.5)',
                }}
              >
                <Icon className="w-3.5 h-3.5 text-foreground/70" />
              </div>

              {/* 标签 */}
              <div className="flex-1 min-w-0">
                {isLink ? (
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-foreground hover:text-primary transition-colors no-underline truncate block"
                  >
                    {t(item.labelKey as any)}
                  </a>
                ) : (
                  <span className="text-sm text-foreground/80 truncate block">
                    {item.name === 'WeChatOfficialAccount' && siteConfig.social.wechatOfficialAccount
                      ? siteConfig.social.wechatOfficialAccount
                      : t(item.labelKey as any)}
                  </span>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.name === 'WeChat' && item.isImageLink && (
                  <button
                    type="button"
                    title="预览二维码"
                    onClick={() => setPreviewKey(showPreview ? null : item.name)}
                    className="lg-btn-ghost p-1.5 rounded-lg text-foreground/50 hover:text-foreground/80 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
                {item.copyValue && (
                  <button
                    type="button"
                    title="复制"
                    onClick={() => handleCopy(item.name, item.copyValue)}
                    className="lg-btn-ghost p-1.5 rounded-lg text-foreground/50 hover:text-foreground/80 transition-colors"
                  >
                    {copiedKey === item.name ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
                {isLink && (
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    title="打开"
                    className="lg-btn-ghost p-1.5 rounded-lg text-foreground/50 hover:text-foreground/80 transition-colors no-underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* WeChat 二维码预览 */}
              {item.name === 'WeChat' && item.isImageLink && showPreview && (
                <div className="absolute z-20 top-full left-10 mt-2 lg-dropdown rounded-xl p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.href} alt="WeChat QR" className="max-w-[180px] max-h-[180px] rounded-lg" />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ContactLinks


