import { updateVariant, deleteVariant } from '@/modules/routines/service'
import type { VariantInput, ScheduleDay } from '@/modules/routines/types'

function err(msg: string, status = 400) {
  return Response.json({ error: msg }, { status })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { id: routineId, variantId } = await params
  let body: unknown
  try { body = await req.json() } catch { return err('invalid JSON') }
  if (typeof body !== 'object' || body === null) return err('body must be an object')
  const { days, label, order } = body as Record<string, unknown>
  const input: Partial<Pick<VariantInput, 'days' | 'label' | 'order'>> = {}
  if (days !== undefined) {
    if (!Array.isArray(days) || !days.every((d: unknown) => typeof d === 'number'))
      return err('days must be number[]')
    input.days = days as ScheduleDay[]
  }
  if (label !== undefined) input.label = typeof label === 'string' ? label : null
  if (order !== undefined && typeof order === 'number') input.order = order
  const variant = await updateVariant(variantId, input)
  return Response.json(variant)
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { variantId } = await params
  try {
    await deleteVariant(variantId)
    return new Response(null, { status: 204 })
  } catch {
    return Response.json(
      { error: 'Cannot delete a variant that has existing logs' },
      { status: 409 }
    )
  }
}
