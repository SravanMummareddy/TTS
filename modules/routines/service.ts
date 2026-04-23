import { Prisma } from '@prisma/client'
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

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  )
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
  const variantInputs = (input as Partial<RoutineInput> & { variants?: VariantInput[] }).variants

  if (!variantInputs) {
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

  return prisma.$transaction(async (tx: any) => {
    await tx.routine.update({
      where: { id },
      data: {
        ...(input.name       !== undefined && { name: input.name.trim() }),
        ...(input.category   !== undefined && { category: input.category }),
        ...(input.color      !== undefined && { color: input.color }),
        ...(input.icon       !== undefined && { icon: input.icon }),
        ...(input.timeSlot   !== undefined && { timeSlot: input.timeSlot }),
        ...(input.customTime !== undefined && { customTime: input.customTime }),
      },
    })

    const existingVariants = await tx.routineVariant.findMany({
      where: { routineId: id },
      include: { items: true, logs: { select: { id: true } } },
      orderBy: { order: 'asc' },
    })

    const seenVariantIds = new Set<string>()

    for (const [variantOrder, variantInput] of variantInputs.entries()) {
      const existingVariant =
        typeof (variantInput as { id?: string }).id === 'string'
          ? existingVariants.find((variant: any) => variant.id === (variantInput as { id?: string }).id)
          : undefined

      if (existingVariant) {
        seenVariantIds.add(existingVariant.id)

        await tx.routineVariant.update({
          where: { id: existingVariant.id },
          data: {
            days: variantInput.days,
            label: variantInput.label ?? null,
            order: variantInput.order ?? variantOrder,
          },
        })

        const seenItemIds = new Set<string>()

        for (const [itemOrder, itemInput] of variantInput.items.entries()) {
          const existingItem =
            typeof (itemInput as { id?: string }).id === 'string'
              ? existingVariant.items.find((item: any) => item.id === (itemInput as { id?: string }).id)
              : undefined

          if (existingItem) {
            seenItemIds.add(existingItem.id)
            await tx.routineItem.update({
              where: { id: existingItem.id },
              data: {
                text: itemInput.text.trim(),
                optional: itemInput.optional ?? false,
                order: itemInput.order ?? itemOrder,
                notes: itemInput.notes ?? null,
              },
            })
          } else {
            await tx.routineItem.create({
              data: {
                variantId: existingVariant.id,
                text: itemInput.text.trim(),
                optional: itemInput.optional ?? false,
                order: itemInput.order ?? itemOrder,
                notes: itemInput.notes ?? null,
              },
            })
          }
        }

        const removableItems = existingVariant.items.filter((item: any) => !seenItemIds.has(item.id))
        if (removableItems.length > 0) {
          await tx.routineItem.deleteMany({
            where: { id: { in: removableItems.map((item: any) => item.id) } },
          })
        }
      } else {
        const createdVariant = await tx.routineVariant.create({
          data: {
            routineId: id,
            days: variantInput.days,
            label: variantInput.label ?? null,
            order: variantInput.order ?? variantOrder,
          },
        })

        seenVariantIds.add(createdVariant.id)

        if (variantInput.items.length > 0) {
          await tx.routineItem.createMany({
            data: variantInput.items.map((itemInput, itemOrder) => ({
              variantId: createdVariant.id,
              text: itemInput.text.trim(),
              optional: itemInput.optional ?? false,
              order: itemInput.order ?? itemOrder,
              notes: itemInput.notes ?? null,
            })),
          })
        }
      }
    }

    const variantsToDelete = existingVariants.filter((variant: any) => !seenVariantIds.has(variant.id))
    for (const variant of variantsToDelete) {
      if (variant.logs.length > 0) {
        throw new Error('Cannot remove a routine variant that already has history')
      }
      await tx.routineVariant.delete({ where: { id: variant.id } })
    }

    return tx.routine.findUniqueOrThrow({
      where: { id },
      include: withVariants,
    })
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
  try {
    return await prisma.routineLog.upsert({
      where: { routineId_date: { routineId, date } },
      create: { routineId, variantId, date },
      update: {},
      include: { itemLogs: true },
    })
  } catch (error) {
    if (!isUniqueConstraintError(error)) throw error

    return prisma.routineLog.findUniqueOrThrow({
      where: { routineId_date: { routineId, date } },
      include: { itemLogs: true },
    })
  }
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

  const required = log.variant.items.filter((i: any) => !i.optional)
  const doneCount = log.itemLogs.filter(
    (il: any) => il.done && required.some((r: any) => r.id === il.itemId)
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
  date: string,
  skipped = true
) {
  try {
    return await prisma.routineLog.upsert({
      where: { routineId_date: { routineId, date } },
      create: { routineId, variantId, date, skipped },
      update: { skipped },
      include: { itemLogs: true },
    })
  } catch (error) {
    if (!isUniqueConstraintError(error)) throw error

    return prisma.routineLog.update({
      where: { routineId_date: { routineId, date } },
      data: { skipped },
      include: { itemLogs: true },
    })
  }
}

// ── Today view ────────────────────────────────────────────────────────────────

export async function getTodayRoutines(date: string) {
  const routines = await listRoutines()
  const dow = new Date(date + 'T12:00').getDay()

  const logs = await prisma.routineLog.findMany({
    where: { date, routineId: { in: routines.map((r: any) => r.id) } },
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
      log: logs.find((l: any) => l.routineId === routine.id) ?? null,
    })
  }

  return results
}

export async function listRoutineLogs(days = 30) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - Math.max(days - 1, 0))

  return prisma.routineLog.findMany({
    where: {
      date: {
        gte: start.toISOString().split('T')[0],
        lte: end.toISOString().split('T')[0],
      },
    },
    include: { itemLogs: true },
    orderBy: { date: 'desc' },
  })
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
      .filter((l: any) => !l.skipped && l.completionPct >= 100 && l.date < today)
      .map((l: any) => l.date)
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

  const activeLogs = logs.filter((l: any) => !l.skipped)
  const avgCompletion =
    activeLogs.length === 0
      ? 0
      : Math.round(
          activeLogs.reduce((s: any, l: any) => s + l.completionPct, 0) / activeLogs.length
        )

  return { streak, totalSessions: activeLogs.length, avgCompletion }
}
