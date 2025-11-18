import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

export default async function Icon() {
  // Fetch the avatar from GitHub
  const avatarUrl = 'https://github.com/aaronlamz.png'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Outer border circle */}
        <div
          style={{
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Avatar image */}
          <img
            src={avatarUrl}
            alt="Avatar"
            width="400"
            height="400"
            style={{
              borderRadius: '50%',
            }}
          />
        </div>
      </div>
    ),
    size,
  )
}
