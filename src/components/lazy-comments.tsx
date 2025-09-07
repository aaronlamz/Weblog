'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const Comments = dynamic(() => import('./comments'), { ssr: false })

export default function LazyComments({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
          }
        })
      },
      { rootMargin: '400px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  return (
    <div ref={ref}>
      {visible ? (
        <Comments locale={locale} />
      ) : (
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="h-5 w-24 bg-muted/60 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted/40 rounded" />
            <div className="h-4 w-5/6 bg-muted/40 rounded" />
            <div className="h-4 w-4/6 bg-muted/40 rounded" />
          </div>
        </div>
      )}
    </div>
  )
}


