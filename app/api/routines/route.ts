import { listRoutines, createRoutine } from '@/modules/routines/service'
import type { RoutineInput, VariantInput, ItemInput, ScheduleDay, TimeSlot } from '@/modules/routines/types'

function err(msg: string, status = 400) {
  return Response.json({ error: msg }, { status })
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseItems(raw: unknown): ItemInput[] | string {
  if (!Array.isArray(raw)) return 'items must be an array'
  for (const item of raw) {
    if (typeof item.text !== 'string' || !item.text.trim()) return 'item.text is required'
    if (typeof item.order !== 'number') return 'item.order must be a number'
  }
  return raw as ItemInput[]
}

function parseVariants(raw: unknown): VariantInput[] | string {
  if (!Array.isArray(raw) || raw.length === 0) return 'variants must be a non-empty array'
  for (const v of raw) {
    if (!Array.isArray(v.days) || !v.days.every((d: unknown) => typeof d === 'number'))
      return 'variant.days must be number[]'
    const itemsResult = parseItems(v.items ?? [])
    if (typeof itemsResult === 'string') return itemsResult
  }
  return raw as VariantInput[]
}

function parseRoutineInput(v: unknown): { input: RoutineInput; variants: VariantInput[] } | string {
  if (!isObject(v)) return 'body must be an object'
  const { name, category, color, icon, timeSlot, customTime, variants } = v
  if (typeof name !== 'string' || !name.trim()) return 'name is required'
  if (typeof category !== 'string' || !category.trim()) return 'category is required'
  if (typeof color !== 'string') return 'color is required'
  if (typeof icon !== 'string') return 'icon is required'
  const parsedVariants = parseVariants(variants)
  if (typeof parsedVariants === 'string') return parsedVariants
  const input: RoutineInput = {
    name,
    category,
    color,
    icon,
    timeSlot: (timeSlot as TimeSlot | null) ?? null,
    customTime: (customTime as string | null) ?? null,
  }
  return { input, variants: parsedVariants as VariantInput[] }
}

export async function GET() {
  const routines = await listRoutines()
  return Response.json(routines)
}

export async function POST(req: Request) {
  let body: unknown
  try { body = await req.json() } catch { return err('invalid JSON') }
  const parsed = parseRoutineInput(body)
  if (typeof parsed === 'string') return err(parsed)
  try {
    const routine = await createRoutine(parsed.input, parsed.variants)
    return Response.json(routine, { status: 201 })
  } catch {
    return err('failed to create routine', 500)
  }
}
