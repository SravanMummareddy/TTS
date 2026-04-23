import { getRoutine, updateRoutine, deleteRoutine } from '@/modules/routines/service'
import type { RoutineInput, VariantInput, ItemInput, TimeSlot } from '@/modules/routines/types'

function err(msg: string, status = 400) {
  return Response.json({ error: msg }, { status })
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseItems(raw: unknown): ItemInput[] | string {
  if (!Array.isArray(raw)) return 'items must be an array'
  for (const item of raw) {
    if (!isObject(item)) return 'item must be an object'
    if (typeof item.text !== 'string' || !item.text.trim()) return 'item.text is required'
    if (typeof item.order !== 'number') return 'item.order must be a number'
  }
  return raw as ItemInput[]
}

function parseVariants(raw: unknown): VariantInput[] | string {
  if (!Array.isArray(raw) || raw.length === 0) return 'variants must be a non-empty array'
  for (const variant of raw) {
    if (!isObject(variant)) return 'variant must be an object'
    if (!Array.isArray(variant.days) || !variant.days.every((day: unknown) => typeof day === 'number')) {
      return 'variant.days must be number[]'
    }
    const itemsResult = parseItems(variant.items ?? [])
    if (typeof itemsResult === 'string') return itemsResult
  }
  return raw as VariantInput[]
}

function parseRoutineUpdate(v: unknown): Partial<RoutineInput> | string {
  if (!isObject(v)) return 'body must be an object'

  const parsed: Partial<RoutineInput> & { variants?: VariantInput[] } = {}
  const { name, category, color, icon, timeSlot, customTime, variants } = v

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) return 'name is required'
    parsed.name = name
  }
  if (category !== undefined) {
    if (typeof category !== 'string' || !category.trim()) return 'category is required'
    parsed.category = category
  }
  if (color !== undefined) {
    if (typeof color !== 'string') return 'color is required'
    parsed.color = color
  }
  if (icon !== undefined) {
    if (typeof icon !== 'string') return 'icon is required'
    parsed.icon = icon
  }
  if (timeSlot !== undefined) {
    parsed.timeSlot = (timeSlot as TimeSlot | null) ?? null
  }
  if (customTime !== undefined) {
    parsed.customTime = (customTime as string | null) ?? null
  }
  if (variants !== undefined) {
    const parsedVariants = parseVariants(variants)
    if (typeof parsedVariants === 'string') return parsedVariants
    parsed.variants = parsedVariants
  }

  return parsed
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const routine = await getRoutine(id)
  if (!routine) return err('not found', 404)
  return Response.json(routine)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: unknown
  try { body = await req.json() } catch { return err('invalid JSON') }
  const parsed = parseRoutineUpdate(body)
  if (typeof parsed === 'string') return err(parsed)
  const routine = await updateRoutine(id, parsed)
  return Response.json(routine)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await deleteRoutine(id)
  return new Response(null, { status: 204 })
}
