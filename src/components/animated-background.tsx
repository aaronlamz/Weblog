'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function AnimatedBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* 主背景渐变 */}
      <div 
        className={`
          fixed inset-0 z-[-2]
          ${theme === 'dark' ? 'animated-background-dark' : 'animated-background'}
        `}
      />
      
      {/* 静态装饰形状 */}
      <div className="floating-shapes">
        {/* 大型背景圆 - 固定位置，无动画 */}
        <div className="absolute w-80 h-80 rounded-full opacity-15"
             style={{
               background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 60%, transparent 80%)',
               top: '10%',
               right: '10%'
             }} 
        />
        <div className="absolute w-96 h-96 rounded-full opacity-12"
             style={{
               background: 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, rgba(147, 51, 234, 0.04) 60%, transparent 80%)',
               bottom: '10%',
               left: '5%'
             }} 
        />
        <div className="absolute w-64 h-64 rounded-full opacity-18"
             style={{
               background: 'radial-gradient(circle, rgba(236, 72, 153, 0.14) 0%, rgba(236, 72, 153, 0.05) 60%, transparent 80%)',
               top: '40%',
               left: '20%'
             }} 
        />
        <div className="absolute w-72 h-72 rounded-full opacity-16"
             style={{
               background: 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.04) 60%, transparent 80%)',
               bottom: '30%',
               right: '30%'
             }} 
        />
      </div>

      {/* 渐变遮罩层 */}
      <div 
        className={`
          fixed inset-0 z-[-1] pointer-events-none
          ${theme === 'dark' ? 'gradient-mask-dark' : 'gradient-mask'}
        `}
      />
    </>
  )
}
