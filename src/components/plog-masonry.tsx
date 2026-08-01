'use client'

import type { ReactNode } from 'react'
import Masonry from 'react-masonry-css'

export function PlogMasonry({ children }: { children: ReactNode }) {
  return (
    <Masonry
      breakpointCols={{ default: 3, 1023: 2, 639: 1 }}
      className="-ml-5 flex w-auto"
      columnClassName="pl-5 bg-clip-padding [&>*]:mb-8"
    >
      {children}
    </Masonry>
  )
}
