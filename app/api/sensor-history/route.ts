import { getSensorReadings } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const hours = parseInt(searchParams.get('hours') || '24', 10)
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    // Get readings from last N hours
    const to = new Date()
    const from = new Date(to.getTime() - hours * 60 * 60 * 1000)

    console.log(`[API] Fetching sensor history from ${from.toISOString()} to ${to.toISOString()}, limit: ${limit}`)
    
    const readings = await getSensorReadings(from, to, limit)
    
    console.log(`[API] Found ${readings.length} readings from database`)

    // Transform to API format
    const data = readings.map((r) => ({
      id: r.id,
      temp_room: r.tempRoom,
      hum_room: r.humRoom,
      temp_out: r.tempOut,
      lux: r.lux,
      ldr_raw: r.ldrRaw,
      timestamp: Math.floor(r.timestamp.getTime() / 1000),
      created_at: r.createdAt.toISOString(),
    }))

    console.log(`[API] Returning ${data.length} records`)

    return NextResponse.json({
      data,
      count: data.length,
      from: from.toISOString(),
      to: to.toISOString(),
    })
  } catch (error) {
    console.error('[API] Error fetching sensor history:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch sensor history',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: [],
        count: 0
      },
      { status: 500 }
    )
  }
}

