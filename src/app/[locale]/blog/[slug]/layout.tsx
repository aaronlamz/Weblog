import React from 'react'

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Solid, reading-friendly background only for article pages
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
      {children}
    </div>
  )
}


