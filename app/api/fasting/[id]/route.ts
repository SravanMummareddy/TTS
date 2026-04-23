import { endFast } from '@/modules/fasting/service'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: unknown
  try { body = await req.json() } catch { return Response.json({ error: 'invalid JSON' }, { status: 400 }) }
  const { completed } = (body as Record<string, unknown>) ?? {}
  try {
    const entry = await endFast(id, completed !== false)
    return Response.json(entry)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'failed to end fast' }, { status: 500 })
  }
}