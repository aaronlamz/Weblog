'use client'

import React, { memo, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { CopyCodeButton } from './copy-code-button'

// 单例：整个应用共用一个 shiki highlighter 实例
let highlighterPromise: Promise<any> | null = null

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: [
          'javascript',
          'typescript',
          'jsx',
          'tsx',
          'bash',
          'shell',
          'json',
          'css',
          'html',
          'markdown',
          'python',
          'go',
          'rust',
          'yaml',
          'sql',
          'xml',
          'java',
          'c',
          'cpp',
          'docker',
        ],
      })
    )
  }
  return highlighterPromise
}

// 缓存已生成的高亮 HTML（key = 代码 + 语言 + 主题）
const htmlCache = new Map<string, string>()

interface CodeBlockProps {
  language: string
  code: string
}

function CodeBlockInner({ language, code }: CodeBlockProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const themeName = isDark ? 'github-dark' : 'github-light'
  const cacheKey = `${language}::${themeName}::${code}`

  const [html, setHtml] = useState<string | null>(() => htmlCache.get(cacheKey) ?? null)

  useEffect(() => {
    if (htmlCache.has(cacheKey)) {
      setHtml(htmlCache.get(cacheKey)!)
      return
    }

    let cancelled = false
    getHighlighter()
      .then(highlighter => {
        if (cancelled) return
        try {
          const supportedLangs = highlighter.getLoadedLanguages()
          const lang = supportedLangs.includes(language) ? language : 'text'
          const result = highlighter.codeToHtml(code, {
            lang,
            theme: themeName,
          })
          htmlCache.set(cacheKey, result)
          setHtml(result)
        } catch (err) {
          // 不支持的语言，降级为 text
          const result = highlighter.codeToHtml(code, {
            lang: 'text',
            theme: themeName,
          })
          htmlCache.set(cacheKey, result)
          setHtml(result)
        }
      })
      .catch(() => {
        // shiki 加载失败，保持 fallback
      })

    return () => {
      cancelled = true
    }
  }, [cacheKey, language, code, themeName])

  return (
    <div className="relative my-6 rounded-lg border border-border/20 overflow-hidden shadow-sm bg-background">
      {/* 头部信息栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border/20">
        <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wide">
          {language}
        </span>
        <CopyCodeButton code={code} />
      </div>

      {/* 代码区 */}
      {html ? (
        <div
          className="shiki-wrapper text-sm overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-4 text-sm overflow-x-auto font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}

// React.memo 防止滚动时重复渲染
export const CodeBlock = memo(CodeBlockInner, (prev, next) => {
  return prev.code === next.code && prev.language === next.language
})
