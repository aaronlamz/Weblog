'use client'

import { useEffect } from 'react'

interface HtmlLangSetterProps {
  locale: string
}

export function HtmlLangSetter({ locale }: HtmlLangSetterProps) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
