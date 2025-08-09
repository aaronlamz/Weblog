import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const size = {
  width: 512,
  height: 512,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="64" y1="448" x2="448" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C3AED"/>
            <stop offset="1" stopColor="#06B6D4"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="512" height="512" rx="112" fill="url(#g)"/>
        <path d="M369.14 369.14 A160 160 0 1 1 369.14 142.86" stroke="#FFFFFF" strokeWidth="56" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    size,
  )
}


