'use client'

import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  texts: string[]
  className?: string
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
}

export function TypewriterText({
  texts,
  className = '',
  speed = 150,
  deleteSpeed = 100,
  pauseTime = 2000
}: TypewriterTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    const currentText = texts[currentTextIndex]
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // 打字阶段
        if (currentCharIndex < currentText.length) {
          setDisplayText(currentText.substring(0, currentCharIndex + 1))
          setCurrentCharIndex(prev => prev + 1)
        } else {
          // 完成打字，暂停后开始删除
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        // 删除阶段
        if (currentCharIndex > 0) {
          setDisplayText(currentText.substring(0, currentCharIndex - 1))
          setCurrentCharIndex(prev => prev - 1)
        } else {
          // 完成删除，切换到下一个文本
          setIsDeleting(false)
          setCurrentTextIndex(prev => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timer)
  }, [currentCharIndex, isDeleting, currentTextIndex, texts, speed, deleteSpeed, pauseTime])

  return (
    <span className={`inline-block ${className}`}>
      {displayText}
      <span className="animate-pulse text-primary">|</span>
    </span>
  )
}
