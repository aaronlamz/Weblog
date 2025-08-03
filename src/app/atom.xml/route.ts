import { NextResponse } from 'next/server'
import { generateRSSFeed } from '@/lib/rss'

export const dynamic = 'force-static'

export async function GET() {
  try {
    const feed = generateRSSFeed()
    
    return new NextResponse(feed.atom1(), {
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Error generating Atom feed:', error)
    return new NextResponse('Error generating Atom feed', { status: 500 })
  }
}