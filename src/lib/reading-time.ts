export function readingTime(content: string) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  
  return {
    words,
    minutes,
    text: `${minutes} min read`,
  }
} 