import { addItem, reorderItems } from '@/modules/routines/service'
import type { ItemInput } from '@/modules/routines/types'

function err(msg: string, status = 400) {
  return Response.json({ error: msg }, { status })
}

// POST — add an item to this variant
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { variantId } = await params
  let body: unknown
  try { body = await req.json() } catch { return err('invalid JSON') }
  if (typeof body !== 'object' || body === null) return err('body must be an object')
  const { text, optional, order, notes } = body as Record<string, unknown>
  if (typeof text !== 'string' || !text.trim()) return err('text is required')
  if (typeof order !== 'number') return err('order must be a number')
  const input: ItemInput = {
    text,
    optional: optional === true,
    order,
    notes: typeof notes === 'string' ? notes : null,
  }
  const item = await addItem(variantId, input)
  return Response.json(item, { status: 201 })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { variantId } = await params
  let body: unknown
  try { body = await req.json() } catch { return err('invalid JSON') }
  if (typeof body !== 'object' || body === null) return err('body must be an object')
  const { itemIds } = body as Record<string, unknown>
  if (!Array.isArray(itemIds)) return err('itemIds must be an array')
  await reorderItems(variantId, itemIds as string[])
  return new Response(null, { status: 204 })
}
