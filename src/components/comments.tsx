'use client'

import { useTheme } from 'next-themes'
import Giscus from '@giscus/react'

export default function Comments({ locale }: { locale: string }) {
  const { theme } = useTheme()
  
  return (
    <div className="mt-16 pt-8 border-t border-border/30">
      <h3 className="text-xl font-semibold mb-6">
        {locale === 'zh' ? '评论' : 'Comments'}
      </h3>
      {/* power by https://giscus.app/zh-CN */}
      <Giscus
        repo="aaronlamz/Weblog"
        repoId="R_kgDOPEqspA"
        category="Announcements"
        categoryId="DIC_kwDOPEqspM4Cuhz5"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'dark' ? 'dark_dimmed' : 'light'}
        lang={locale === 'zh' ? 'zh-CN' : 'en'}
        loading="lazy"
      />
    </div>
  )
}
