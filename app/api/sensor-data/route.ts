import { ensureMqttConnected, mqttService } from '@/lib/mqttService'

export const runtime = 'nodejs'

export async function GET() {
  ensureMqttConnected()

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      const latest = mqttService.getLatestData()
      if (latest) send(latest)

      const unsubscribe = mqttService.subscribe((data) => {
        send(data)
      })

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(':ping\n\n'))
      }, 15_000)

      controller.oncancel = () => {
        clearInterval(heartbeat)
        unsubscribe()
      }
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


