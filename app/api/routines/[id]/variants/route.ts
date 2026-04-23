import { getRoutine, createVariant } from '@/modules/routines/service'
import type { VariantInput, ItemInput, ScheduleDay } from '@/modules/routines/types'

function err(msg: string, status = 400) {
  return Response.json({ error: msg }, { status })
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const routine = await getRoutine(params.id)
  if (!routine) return err('not found', 404)
  return Response.json(routine.variants)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  let body: unknown
  try { body = await req.json() } catch { return err('invalid JSON') }
  if (typeof body !== 'object' || body === null) return err('body must be an object')
  const { days, label, order, items } = body as Record<string, unknown>
  if (!Array.isArray(days) || !days.every((d: unknown) => typeof d === 'number'))
    return err('days must be number[]')
  const safeItems: ItemInput[] = Array.isArray(items) ? items as ItemInput[] : []
  const input: VariantInput = {
    days: days as ScheduleDay[],
    label: typeof label === 'string' ? label : null,
    order: typeof order === 'number' ? order : 0,
    items: safeItems,
  }
  try {
    const variant = await createVariant(params.id, input)
    return Response.json(variant, { status: 201 })
  } catch {
    return err('failed to create variant', 500)
  }
}
