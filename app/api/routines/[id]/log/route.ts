import { getRoutine, upsertLog, toggleItemLog, skipRoutine } from '@/modules/routines/service'
import { getVariantForDay } from '@/modules/routines/utils'
import type { Routine } from '@/modules/routines/types'

function err(msg: string, status = 400) {
  return Response.json({ error: msg }, { status })
}

const todayStr = () => new Date().toISOString().split('T')[0]

// GET — get or create today's log for the correct variant
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const routine = await getRoutine(params.id)
  if (!routine) return err('not found', 404)
  const dow = new Date().getDay()
  const variant = getVariantForDay(routine as unknown as Routine, dow)
  if (!variant) return err('routine not scheduled today', 400)
  const log = await upsertLog(params.id, variant.id, todayStr())
  return Response.json(log)
}

// POST — { action: 'toggle-item', itemId } | { action: 'skip' }
export async function POST(req: Request, { params }: { params: { id: string } }) {
  let body: unknown
  try { body = await req.json() } catch { return err('invalid JSON') }
  if (typeof body !== 'object' || body === null) return err('body must be an object')
  const { action, itemId } = body as Record<string, unknown>
  const date = todayStr()

  const routine = await getRoutine(params.id)
  if (!routine) return err('not found', 404)
  const dow = new Date().getDay()
  const variant = getVariantForDay(routine as unknown as Routine, dow)
  if (!variant) return err('routine not scheduled today', 400)

  if (action === 'skip') {
    const log = await skipRoutine(params.id, variant.id, date)
    return Response.json(log)
  }

  if (action === 'toggle-item') {
    if (typeof itemId !== 'string') return err('itemId is required')
    const log = await upsertLog(params.id, variant.id, date)
    const updated = await toggleItemLog(log.id, itemId)
    return Response.json(updated)
  }

  return err('action must be toggle-item or skip')
}
