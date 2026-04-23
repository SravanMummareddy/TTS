import { getActiveFast, listFastingEntries, startFast } from '@/modules/fasting/service'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const type = url.searchParams.get('type')
  if (type === 'active') {
    const entry = await getActiveFast()
    return Response.json(entry)
  }
  const entries = await listFastingEntries()
  return Response.json(entries)
}

export async function POST(req: Request) {
  let body: unknown
  try { body = await req.json() } catch { return Response.json({ error: 'invalid JSON' }, { status: 400 }) }
  const { target } = (body as Record<string, unknown>) ?? {}
  const t = typeof target === 'number' ? target : 16
  try {
    const entry = await startFast(t)
    return Response.json(entry, { status: 201 })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'failed to start fast' }, { status: 500 })
  }
}