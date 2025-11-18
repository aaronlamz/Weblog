import { NextResponse } from 'next/server'
import { generateRSSFeed } from '@/lib/rss'

export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  try {
    const feed = generateRSSFeed()
    
    return new NextResponse(feed.rss2(), {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}