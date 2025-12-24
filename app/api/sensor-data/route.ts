import { ensureMqttConnected, mqttService } from '@/lib/mqttService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  ensureMqttConnected()

  let cleanup: () => void

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      let isClosed = false

      const safeEnqueue = (chunk: Uint8Array) => {
        if (isClosed) return
        try {
          controller.enqueue(chunk)
        } catch (error: any) {
          isClosed = true
          // Ignore "Controller is already closed" error as it happens on disconnect
          if (error?.code === 'ERR_INVALID_STATE' || error?.message?.includes('closed')) {
            return
          }
          console.error('Stream enqueue error:', error)
        }
      }

      const send = (data: unknown) => {
        safeEnqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      const latest = mqttService.getLatestData()
      if (latest) send(latest)

      const unsubscribe = mqttService.subscribe((data) => {
        send(data)
      })

      const heartbeat = setInterval(() => {
        safeEnqueue(encoder.encode(':ping\n\n'))
      }, 15_000)

      cleanup = () => {
        isClosed = true
        clearInterval(heartbeat)
        unsubscribe()
      }
    },
    cancel() {
      if (cleanup) cleanup()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'Access-Control-Allow-Origin': '*',
    },
  })
}


