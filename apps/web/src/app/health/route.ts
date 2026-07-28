import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      application: 'CVForge',
      release: process.env.NEXT_PUBLIC_RELEASE_ID ?? 'development',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
