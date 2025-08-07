'use client'

import { useState, useEffect } from 'react'

interface AnimatedTextProps {
  words?: string[]
  className?: string
  animationType?: 'fade' | 'slide' | 'rainbow' | 'glow'
}

export function AnimatedText({ 
  words = ['Amazing', 'Beautiful', 'Modern', 'Interactive', 'Responsive'], 
  className = '',
  animationType = 'fade'
}: AnimatedTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
        setIsVisible(true)
        setTimeout(() => setIsAnimating(false), 500)
      }, 400) // 淡出时间
    }, 3000) // 每3秒切换一次

    return () => clearInterval(interval)
  }, [words.length])

  const colorClasses = [
    'text-blue-600 dark:text-blue-400',
    'text-green-600 dark:text-green-400', 
    'text-purple-600 dark:text-purple-400',
    'text-orange-600 dark:text-orange-400',
    'text-pink-600 dark:text-pink-400',
    'text-indigo-600 dark:text-indigo-400',
  ]

  const gradientClasses = [
    'bg-gradient-to-r from-blue-600 to-cyan-600',
    'bg-gradient-to-r from-green-600 to-emerald-600',
    'bg-gradient-to-r from-purple-600 to-pink-600',
    'bg-gradient-to-r from-orange-600 to-red-600',
    'bg-gradient-to-r from-pink-600 to-rose-600',
    'bg-gradient-to-r from-indigo-600 to-blue-600',
  ]

  const getAnimationClass = () => {
    switch (animationType) {
      case 'rainbow':
        return 'text-rainbow'
      case 'glow':
        return `text-glow ${colorClasses[currentWordIndex % colorClasses.length]}`
      case 'slide':
        return `${gradientClasses[currentWordIndex % gradientClasses.length]} bg-clip-text text-transparent`
      default:
        return colorClasses[currentWordIndex % colorClasses.length]
    }
  }

  const getTransformClass = () => {
    if (animationType === 'slide') {
      return isVisible 
        ? 'opacity-100 translate-y-0 scale-100' 
        : 'opacity-0 translate-y-4 scale-95'
    }
    return isVisible 
      ? 'opacity-100 scale-100 rotate-0' 
      : 'opacity-0 scale-95 rotate-3'
  }

  return (
    <span 
      className={`
        inline-block min-w-[140px] text-left
        transition-all duration-500 ease-out
        transform-gpu
        ${getTransformClass()}
        ${getAnimationClass()}
        ${isAnimating ? 'animate-pulse' : ''}
        ${className}
      `}
      style={{
        filter: animationType === 'glow' ? 'drop-shadow(0 0 8px currentColor)' : 'none'
      }}
    >
      {words[currentWordIndex]}
    </span>
  )
}
