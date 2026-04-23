import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type FixtureVariant = {
  days: number[]
  label: string | null
  items: Array<{ text: string; optional?: boolean; notes?: string | null }>
}

async function createRoutineWithVariants(input: {
  name: string
  category: string
  color: string
  icon: string
  timeSlot: 'morning' | 'afternoon' | 'night' | 'custom' | null
  variants: FixtureVariant[]
}) {
  return prisma.routine.create({
    data: {
      name: input.name,
      category: input.category,
      color: input.color,
      icon: input.icon,
      timeSlot: input.timeSlot,
      active: true,
      variants: {
        create: input.variants.map((variant, variantOrder) => ({
          days: variant.days,
          label: variant.label,
          order: variantOrder,
          items: {
            create: variant.items.map((item, itemOrder) => ({
              text: item.text,
              optional: item.optional ?? false,
              order: itemOrder,
              notes: item.notes ?? null,
            })),
          },
        })),
      },
    },
    include: {
      variants: {
        include: { items: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
      },
    },
  })
}

async function createLog(params: {
  routineId: string
  variantId: string
  itemIds: string[]
  date: string
  doneIndexes?: number[]
  skipped?: boolean
}) {
  const doneIndexes = params.doneIndexes ?? []
  const completionPct = params.skipped
    ? 0
    : params.itemIds.length === 0
      ? 0
      : Math.round((doneIndexes.length / params.itemIds.length) * 100)

  const log = await prisma.routineLog.create({
    data: {
      routineId: params.routineId,
      variantId: params.variantId,
      date: params.date,
      completionPct,
      skipped: params.skipped ?? false,
    },
  })

  if (!params.skipped) {
    for (const itemIndex of doneIndexes) {
      await prisma.routineItemLog.create({
        data: {
          logId: log.id,
          itemId: params.itemIds[itemIndex],
          done: true,
        },
      })
    }
  }
}

function dateOffset(daysFromToday: number) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split('T')[0]
}

async function main() {
  await prisma.routineItemLog.deleteMany()
  await prisma.routineLog.deleteMany()
  await prisma.routineItem.deleteMany()
  await prisma.routineVariant.deleteMany()
  await prisma.routine.deleteMany()

  const morningReset = await createRoutineWithVariants({
    name: 'Morning Reset',
    category: 'mindfulness',
    color: '#22c55e',
    icon: '🧘',
    timeSlot: 'morning',
    variants: [
      {
        days: [],
        label: null,
        items: [
          { text: 'Water' },
          { text: 'Stretch 5 min' },
          { text: 'Journal 3 lines' },
          { text: 'Read one page', optional: true },
        ],
      },
    ],
  })

  const trainingSplit = await createRoutineWithVariants({
    name: 'Training Split QA',
    category: 'fitness',
    color: '#f97316',
    icon: '💪',
    timeSlot: 'afternoon',
    variants: [
      {
        days: [1, 3, 5],
        label: 'Lift',
        items: [
          { text: 'Warm up' },
          { text: 'Primary block' },
          { text: 'Accessory block' },
          { text: 'Cooldown' },
        ],
      },
      {
        days: [2, 4],
        label: 'Conditioning',
        items: [
          { text: 'Walk 20 min' },
          { text: 'Core circuit' },
          { text: 'Mobility' },
        ],
      },
      {
        days: [0, 6],
        label: 'Recovery',
        items: [
          { text: 'Walk outside' },
          { text: 'Stretch' },
        ],
      },
    ],
  })

  const eveningShutdown = await createRoutineWithVariants({
    name: 'Evening Shutdown',
    category: 'custom',
    color: '#7c5cfc',
    icon: '🌙',
    timeSlot: 'night',
    variants: [
      {
        days: [],
        label: null,
        items: [
          { text: 'Tidy desk' },
          { text: 'Set tomorrow priorities' },
          { text: 'Charge devices' },
        ],
      },
    ],
  })

  const mrVariant = morningReset.variants[0]
  const liftVariant = trainingSplit.variants[0]
  const conditioningVariant = trainingSplit.variants[1]
  const recoveryVariant = trainingSplit.variants[2]
  const esVariant = eveningShutdown.variants[0]
  const threeDaysAgo = dateOffset(-3)
  const twoDaysAgo = dateOffset(-2)
  const yesterday = dateOffset(-1)

  await createLog({
    routineId: morningReset.id,
    variantId: mrVariant.id,
    itemIds: mrVariant.items.map(item => item.id),
    date: threeDaysAgo,
    doneIndexes: [0, 1, 2],
  })
  await createLog({
    routineId: trainingSplit.id,
    variantId: recoveryVariant.id,
    itemIds: recoveryVariant.items.map(item => item.id),
    date: threeDaysAgo,
    doneIndexes: [0],
  })
  await createLog({
    routineId: eveningShutdown.id,
    variantId: esVariant.id,
    itemIds: esVariant.items.map(item => item.id),
    date: threeDaysAgo,
    skipped: true,
  })

  await createLog({
    routineId: morningReset.id,
    variantId: mrVariant.id,
    itemIds: mrVariant.items.map(item => item.id),
    date: twoDaysAgo,
    doneIndexes: [0, 1],
  })
  await createLog({
    routineId: trainingSplit.id,
    variantId: liftVariant.id,
    itemIds: liftVariant.items.map(item => item.id),
    date: twoDaysAgo,
    doneIndexes: [0, 1, 2, 3],
  })

  await createLog({
    routineId: morningReset.id,
    variantId: mrVariant.id,
    itemIds: mrVariant.items.map(item => item.id),
    date: yesterday,
    doneIndexes: [0, 1, 2],
  })
  await createLog({
    routineId: trainingSplit.id,
    variantId: conditioningVariant.id,
    itemIds: conditioningVariant.items.map(item => item.id),
    date: yesterday,
    doneIndexes: [0, 1],
  })

  console.log('Seed complete:', {
    fixture: 'routines-qa',
    routinesCreated: [morningReset.name, trainingSplit.name, eveningShutdown.name],
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
