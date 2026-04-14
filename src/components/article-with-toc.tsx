'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { List, X, ArrowUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { CodeBlock } from './code-block'

type TocItem = {
  id: string
  text: string
  level: number
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function ArticleWithTOC({ content, hideToc = false, tocPosition = 'left' }: { content: string; hideToc?: boolean; tocPosition?: 'left' | 'right' }) {
  const t = useTranslations('common')
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false)
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null)
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null)
  const [showDesktopTop, setShowDesktopTop] = useState(false)

  // Build TOC and ensure heading IDs
  useEffect(() => {
    const root = contentRef.current
    if (!root) return

    const headingElements = Array.from(
      root.querySelectorAll<HTMLHeadingElement>('h2, h3')
    )

    const usedIds: Record<string, number> = {}
    const nextId = (text: string) => {
      const base = slugify(text)
      const count = usedIds[base] ?? 0
      usedIds[base] = count + 1
      return count === 0 ? base : `${base}-${count}`
    }

    const items: TocItem[] = []
    for (const el of headingElements) {
      const text = (el.textContent || '').trim()
      if (!text) continue
      if (!el.id) {
        el.id = nextId(text)
      }
      const level = Number(el.tagName.substring(1))
      if (level === 2 || level === 3) {
        items.push({ id: el.id, text, level })
      }
      el.style.scrollMarginTop = '7rem'
    }
    setToc(items)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)
        if (visible[0]) {
          setActiveId((visible[0].target as HTMLElement).id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 1] }
    )
    headingElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [content])

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const root = contentRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      const top = window.scrollY + rect.top
      const height = root.offsetHeight
      const viewport = window.innerHeight
      const max = Math.max(1, height - viewport)
      const current = window.scrollY - top
      const p = Math.min(1, Math.max(0, current / max))
      setProgress(p)
      setShowDesktopTop(window.scrollY > 400)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const handleClickToc = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    const y = target.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top: y, behavior: 'smooth' })
    if (isMobileTocOpen) {
      setIsMobileTocOpen(false)
      setTimeout(() => mobileTriggerRef.current?.focus(), 0)
    }
  }

  useEffect(() => {
    if (!mobileDrawerRef.current) return
    if (!isMobileTocOpen) {
      mobileDrawerRef.current.setAttribute('inert', '')
    } else {
      mobileDrawerRef.current.removeAttribute('inert')
    }
  }, [isMobileTocOpen])

  useEffect(() => {
    if (!isMobileTocOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsMobileTocOpen(false)
        setTimeout(() => mobileTriggerRef.current?.focus(), 0)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMobileTocOpen])

  return (
    <div className="relative">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent">
        <div
          className="h-0.5 bg-primary transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className={`mx-auto ${!hideToc
        ? tocPosition === 'left'
          ? 'grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-0'
          : 'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-0'
        : ''}`}>
        {/* TOC — 左侧 */}
        {!hideToc && tocPosition === 'left' && (toc.length > 0 ? (
          <aside className="hidden lg:block lg:border-r lg:border-border/50 lg:pr-6" aria-label="Table of contents">
            <div className="sticky top-14 space-y-2">
              <div className="py-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('onThisPage')}</div>
                <div className="h-px bg-border/60 mt-2" />
              </div>
              <nav className="flex flex-col gap-1 text-sm max-h-[calc(100vh-12rem)] overflow-y-auto pr-1" role="navigation">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={handleClickToc(item.id)}
                    className={`block py-1 transition-colors ${
                      item.level === 3 ? 'pl-4 text-foreground/80' : 'pl-0'
                    } ${
                      activeId === item.id
                        ? 'text-primary font-medium'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        ) : (
          <div className="hidden lg:block" />
        ))}

        {/* 内容 */}
        <div className={!hideToc ? (tocPosition === 'left' ? 'lg:pl-8' : 'lg:pr-8') : ''}>
          <div ref={contentRef} className="prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }]
              ]}
              components={{
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '')
                  const language = match ? match[1] : 'javascript'
                  const codeString = String(children).replace(/\n$/, '')

                  if (inline || !match) {
                    return <code {...props}>{children}</code>
                  }

                  return <CodeBlock language={language} code={codeString} />
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* TOC — 右侧 */}
        {!hideToc && tocPosition === 'right' && toc.length > 0 && (
          <aside className="hidden lg:block lg:border-l lg:border-border/50 lg:pl-6" aria-label="Table of contents">
            <div className="sticky top-14 space-y-2">
              <div className="py-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('onThisPage')}</div>
                <div className="h-px bg-border/60 mt-2" />
              </div>
              <nav className="flex flex-col gap-1 text-sm max-h-[calc(100vh-12rem)] overflow-y-auto pr-1" role="navigation">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={handleClickToc(item.id)}
                    className={`block py-1 transition-colors ${
                      item.level === 3 ? 'pl-4 text-foreground/80' : 'pl-0'
                    } ${
                      activeId === item.id
                        ? 'text-primary font-medium'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* Mobile TOC trigger */}
      {!hideToc && toc.length > 0 && (
        <button
          ref={mobileTriggerRef}
          type="button"
          className="lg:hidden fixed bottom-20 right-4 z-50 inline-flex items-center gap-2 rounded-full px-4 py-2 bg-background/80 backdrop-blur border border-border/60 shadow-lg hover:bg-background transition-colors"
          aria-haspopup="dialog"
          aria-expanded={isMobileTocOpen}
          aria-controls="mobile-toc"
          onClick={() => setIsMobileTocOpen(true)}
        >
          <List className="h-4 w-4" />
          <span className="text-sm">{t('onThisPage')}</span>
        </button>
      )}

      {/* Mobile overlay */}
      {isMobileTocOpen && (
        <button
          aria-label="Close TOC"
          className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => {
            setIsMobileTocOpen(false)
            setTimeout(() => mobileTriggerRef.current?.focus(), 0)
          }}
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-toc"
        role="dialog"
        aria-modal="true"
        className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm z-[60] bg-background border-l border-border/60 transform transition-transform duration-200 ease-out ${
          isMobileTocOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={mobileDrawerRef}
      >
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-border/60 bg-background/90 backdrop-blur">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('onThisPage')}</div>
          <button
            type="button"
            aria-label="Close"
            className="rounded p-1 hover:bg-muted/50"
            onClick={() => {
              setIsMobileTocOpen(false)
              setTimeout(() => mobileTriggerRef.current?.focus(), 0)
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="px-4 py-3 space-y-1 overflow-y-auto h-[calc(100%-3rem)]">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleClickToc(item.id)}
              className={`block py-2 transition-colors ${
                item.level === 3 ? 'pl-6 text-foreground/80' : 'pl-0'
              } ${
                activeId === item.id ? 'text-primary font-medium' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>

      {/* Desktop back-to-top button */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`hidden lg:flex fixed bottom-8 right-6 z-40 h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 backdrop-blur shadow-md transition-all ${
          showDesktopTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  )
}

export default ArticleWithTOC
