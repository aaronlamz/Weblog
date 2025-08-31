'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyCodeButtonProps {
  code: string
  className?: string
}

export function CopyCodeButton({ code, className = '' }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <button
      onClick={copyToClipboard}
      className={`
        inline-flex items-center gap-1 px-2 py-1 text-xs font-medium
        bg-background hover:bg-primary/10 
        border border-border hover:border-primary/50
        rounded-md transition-all duration-200
        text-muted-foreground hover:text-primary
        shadow-sm hover:shadow-md
        ${className}
      `}
      aria-label={copied ? '已复制' : '复制代码'}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          <span>已复制</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>复制</span>
        </>
      )}
    </button>
  )
}