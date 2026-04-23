import { prisma } from '@/lib/prisma'
import type { Routine, RoutineVariant, RoutineInput, VariantInput, ItemInput } from './types'
import { getVariantForDay, isScheduledOnDay } from './utils'

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

const withVariants = {
  variants: {
    orderBy: { order: 'asc' as const },
    include: { items: { orderBy: { order: 'asc' as const } } },
  },
}

// ── Routine CRUD ──────────────────────────────────────────────────────────────

export async function listRoutines() {
  return prisma.routine.findMany({
    where: { active: true },
    include: withVariants,
    orderBy: { createdAt: 'asc' },
  })
}

export async function getRoutine(id: string) {
  return prisma.routine.findUnique({
    where: { id },
    include: withVariants,
  })
}

export async function createRoutine(
  input: RoutineInput,
  variantInputs: VariantInput[]
) {
  return prisma.routine.create({
    data: {
      name:       input.name.trim(),
      category:   input.category,
      color:      input.color,
      icon:       input.icon,
      timeSlot:   input.timeSlot ?? null,
      customTime: input.customTime ?? null,
      variants: {
        create: variantInputs.map((v, vi) => ({
          days:  v.days,
          label: v.label ?? null,
          order: v.order ?? vi,
          items: {
            create: v.items.map(item => ({
              text:     item.text.trim(),
              optional: item.optional ?? false,
              order:    item.order,
              notes:    item.notes ?? null,
            })),
          },
        })),
      },
    },
    include: withVariants,
  })
}

export async function updateRoutine(id: string, input: Partial<RoutineInput>) {
  return prisma.routine.update({
    where: { id },
    data: {
      ...(input.name       !== undefined && { name: input.name.trim() }),
      ...(input.category   !== undefined && { category: input.category }),
      ...(input.color      !== undefined && { color: input.color }),
      ...(input.icon       !== undefined && { icon: input.icon }),
      ...(input.timeSlot   !== undefined && { timeSlot: input.timeSlot }),
      ...(input.customTime !== undefined && { customTime: input.customTime }),
    },
    include: withVariants,
  })
}

export async function deleteRoutine(id: string) {
  await prisma.routine.delete({ where: { id } })
}

// ── Variant CRUD ──────────────────────────────────────────────────────────────

export async function createVariant(routineId: string, input: VariantInput) {
  return prisma.routineVariant.create({
    data: {
      routineId,
      days:  input.days,
      label: input.label ?? null,
      order: input.order ?? 0,
      items: {
        create: input.items.map(item => ({
          text:     item.text.trim(),
          optional: item.optional ?? false,
          order:    item.order,
          notes:    item.notes ?? null,
        })),
      },
    },
    include: { items: { orderBy: { order: 'asc' } } },
  })
}

export async function updateVariant(
  variantId: string,
  input: Partial<Pick<VariantInput, 'days' | 'label' | 'order'>>
) {
  return prisma.routineVariant.update({
    where: { id: variantId },
    data: {
      ...(input.days  !== undefined && { days: input.days }),
      ...(input.label !== undefined && { label: input.label }),
      ...(input.order !== undefined && { order: input.order }),
    },
    include: { items: { orderBy: { order: 'asc' } } },
  })
}

export async function deleteVariant(variantId: string) {
  await prisma.routineVariant.delete({ where: { id: variantId } })
}

// ── Item CRUD ─────────────────────────────────────────────────────────────────

export async function addItem(variantId: string, input: ItemInput) {
  return prisma.routineItem.create({
    data: {
      variantId,
      text:     input.text.trim(),
      optional: input.optional ?? false,
      order:    input.order,
      notes:    input.notes ?? null,
    },
  })
}

export async function updateItem(id: string, input: Partial<ItemInput>) {
  return prisma.routineItem.update({
    where: { id },
    data: {
      ...(input.text     !== undefined && { text: input.text.trim() }),
      ...(input.optional !== undefined && { optional: input.optional }),
      ...(input.order    !== undefined && { order: input.order }),
      ...(input.notes    !== undefined && { notes: input.notes }),
    },
  })
}

export async function deleteItem(id: string) {
  await prisma.routineItem.delete({ where: { id } })
}

export async function reorderItems(variantId: string, itemIds: string[]) {
  await prisma.$transaction(
    itemIds.map((id, order) =>
      prisma.routineItem.update({ where: { id, variantId }, data: { order } })
    )
  )
}

// ── Log operations ────────────────────────────────────────────────────────────

export async function upsertLog(
  routineId: string,
  variantId: string,
  date: string
) {
  return prisma.routineLog.upsert({
    where: { routineId_date: { routineId, date } },
    create: { routineId, variantId, date },
    update: {},  // preserve existing variantId snapshot
    include: { itemLogs: true },
  })
}

export async function toggleItemLog(logId: string, itemId: string) {
  const existing = await prisma.routineItemLog.findUnique({
    where: { logId_itemId: { logId, itemId } },
  })

  if (existing) {
    await prisma.routineItemLog.update({
      where: { logId_itemId: { logId, itemId } },
      data: { done: !existing.done },
    })
  } else {
    await prisma.routineItemLog.create({
      data: { logId, itemId, done: true },
    })
  }

  const log = await prisma.routineLog.findUniqueOrThrow({
    where: { id: logId },
    include: {
      itemLogs: true,
      variant: { include: { items: true } },
    },
  })

  const required = log.variant.items.filter(i => !i.optional)
  const doneCount = log.itemLogs.filter(
    il => il.done && required.some(r => r.id === il.itemId)
  ).length
  const pct =
    required.length === 0 ? 0 : Math.round((doneCount / required.length) * 100)

  return prisma.routineLog.update({
    where: { id: logId },
    data: { completionPct: pct },
    include: { itemLogs: true },
  })
}

export async function skipRoutine(
  routineId: string,
  variantId: string,
  date: string
) {
  return prisma.routineLog.upsert({
    where: { routineId_date: { routineId, date } },
    create: { routineId, variantId, date, skipped: true },
    update: { skipped: true },
    include: { itemLogs: true },
  })
}

// ── Today view ────────────────────────────────────────────────────────────────

export async function getTodayRoutines(date: string) {
  const routines = await listRoutines()
  const dow = new Date(date + 'T12:00').getDay()

  const logs = await prisma.routineLog.findMany({
    where: { date, routineId: { in: routines.map(r => r.id) } },
    include: { itemLogs: true },
  })

  const results: {
    routine: (typeof routines)[0]
    variant: RoutineVariant
    log: (typeof logs)[0] | null
  }[] = []

  for (const routine of routines) {
    const variant = getVariantForDay(routine as unknown as Routine, dow)
    if (!variant) continue
    results.push({
      routine,
      variant,
      log: logs.find(l => l.routineId === routine.id) ?? null,
    })
  }

  return results
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getRoutineStats(routineId: string) {
  const routine = await prisma.routine.findUniqueOrThrow({
    where: { id: routineId },
    include: withVariants,
  })

  const logs = await prisma.routineLog.findMany({
    where: { routineId },
    orderBy: { date: 'desc' },
  })

  const today = todayStr()
  const completedDates = new Set(
    logs
      .filter(l => !l.skipped && l.completionPct >= 100 && l.date < today)
      .map(l => l.date)
  )

  let streak = 0
  const cursor = new Date(today + 'T12:00')
  cursor.setDate(cursor.getDate() - 1)

  for (let i = 0; i < 365; i++) {
    const ds  = cursor.toISOString().split('T')[0]
    const dow = cursor.getDay()
    if (isScheduledOnDay(routine as unknown as Routine, dow)) {
      if (completedDates.has(ds)) streak++
      else break
    }
    cursor.setDate(cursor.getDate() - 1)
  }

  const activeLogs = logs.filter(l => !l.skipped)
  const avgCompletion =
    activeLogs.length === 0
      ? 0
      : Math.round(
          activeLogs.reduce((s, l) => s + l.completionPct, 0) / activeLogs.length
        )

  return { streak, totalSessions: activeLogs.length, avgCompletion }
}
