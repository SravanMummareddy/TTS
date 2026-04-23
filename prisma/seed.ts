import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Morning Skincare (Mon-Sun default)
  const morningSkincare = await prisma.routine.create({
    data: {
      name: 'Morning Skincare',
      category: 'skincare',
      color: '#ec4899',
      icon: '✨',
      timeSlot: 'morning',
      active: true,
      variants: {
        create: [
          {
            days: [],
            label: null,
            order: 0,
            items: {
              create: [
                { text: 'Cleanser', optional: false, order: 0, notes: null },
                { text: 'Toner', optional: false, order: 1, notes: null },
                { text: 'Vitamin C serum', optional: false, order: 2, notes: null },
                { text: 'Moisturiser', optional: false, order: 3, notes: null },
                { text: 'SPF 50', optional: false, order: 4, notes: null },
                { text: 'Eye cream', optional: true, order: 5, notes: null },
              ],
            },
          },
        ],
      },
    },
    include: { variants: { include: { items: true } } },
  })

  // Night Skincare (Mon-Sun default)
  const nightSkincare = await prisma.routine.create({
    data: {
      name: 'Night Skincare',
      category: 'skincare',
      color: '#a855f7',
      icon: '🌙',
      timeSlot: 'night',
      active: true,
      variants: {
        create: [
          {
            days: [],
            label: null,
            order: 0,
            items: {
              create: [
                { text: 'Makeup remover', optional: false, order: 0, notes: null },
                { text: 'Cleanser', optional: false, order: 1, notes: null },
                { text: 'Exfoliating toner', optional: false, order: 2, notes: null },
                { text: 'Retinol', optional: true, order: 3, notes: 'Skip if skin is irritated' },
                { text: 'Night moisturiser', optional: false, order: 4, notes: null },
              ],
            },
          },
        ],
      },
    },
    include: { variants: { include: { items: true } } },
  })

  // Hair Care (Mon, Wed, Fri only)
  const hairCare = await prisma.routine.create({
    data: {
      name: 'Hair Care',
      category: 'hair',
      color: '#0ea5e9',
      icon: '💆',
      timeSlot: 'morning',
      active: true,
      variants: {
        create: [
          {
            days: [1, 3, 5],
            label: null,
            order: 0,
            items: {
              create: [
                { text: 'Pre-shampoo oil', optional: true, order: 0, notes: null },
                { text: 'Shampoo', optional: false, order: 1, notes: null },
                { text: 'Conditioner (3 min)', optional: false, order: 2, notes: null },
                { text: 'Hair mask', optional: true, order: 3, notes: 'Once a week' },
                { text: 'Heat protect + blow dry', optional: false, order: 4, notes: null },
                { text: 'Style', optional: false, order: 5, notes: null },
              ],
            },
          },
        ],
      },
    },
    include: { variants: { include: { items: true } } },
  })

  // Gym (Mon-Fri)
  const gym = await prisma.routine.create({
    data: {
      name: 'Gym',
      category: 'fitness',
      color: '#f97316',
      icon: '💪',
      timeSlot: 'afternoon',
      active: true,
      variants: {
        create: [
          {
            days: [1, 2, 3, 4, 5],
            label: null,
            order: 0,
            items: {
              create: [
                { text: 'Pre-workout meal', optional: false, order: 0, notes: null },
                { text: 'Warm up 10 min', optional: false, order: 1, notes: null },
                { text: 'Main workout 45–60 min', optional: false, order: 2, notes: null },
                { text: 'Cool down stretch', optional: false, order: 3, notes: null },
                { text: 'Protein shake', optional: false, order: 4, notes: null },
              ],
            },
          },
        ],
      },
    },
    include: { variants: { include: { items: true } } },
  })

  // Helper to get item by text
  async function getItemId(routineId: string, text: string): Promise<string> {
    const routine = await prisma.routine.findUnique({
      where: { id: routineId },
      include: { variants: { include: { items: true } } },
    })
    for (const variant of routine!.variants) {
      for (const item of variant.items) {
        if (item.text === text) return item.id
      }
    }
    throw new Error(`Item not found: ${text}`)
  }

  // Create logs for past 14 days
  const logs = []

  // Morning Skincare — complete every day Apr 10–21 (12-day streak)
  const msVariantId = morningSkincare.variants[0].id
  for (const date of ['2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13', '2026-04-14', '2026-04-15', '2026-04-16', '2026-04-17', '2026-04-18', '2026-04-19', '2026-04-20', '2026-04-21']) {
    const log = await prisma.routineLog.create({
      data: {
        routineId: morningSkincare.id,
        variantId: msVariantId,
        date,
        completionPct: 100,
        skipped: false,
      },
    })
    logs.push({ log, routineId: morningSkincare.id, variantId: msVariantId, date })
  }

  // Night Skincare — Apr 14 partial (60%), Apr 15–21 complete (7-day streak)
  const nsVariantId = nightSkincare.variants[0].id
  for (const [date, pct] of [
    ['2026-04-14', 60],
    ['2026-04-15', 100],
    ['2026-04-16', 100],
    ['2026-04-17', 100],
    ['2026-04-18', 100],
    ['2026-04-19', 100],
    ['2026-04-20', 100],
    ['2026-04-21', 100],
  ] as const) {
    const log = await prisma.routineLog.create({
      data: {
        routineId: nightSkincare.id,
        variantId: nsVariantId,
        date,
        completionPct: pct,
        skipped: false,
      },
    })
    logs.push({ log, routineId: nightSkincare.id, variantId: nsVariantId, date })
  }

  // Hair Care (Mon/Wed/Fri) — Apr 10(Fri), 13(Mon), 15(Wed), 17(Fri), 20(Mon) all complete
  const hcVariantId = hairCare.variants[0].id
  for (const date of ['2026-04-10', '2026-04-13', '2026-04-15', '2026-04-17', '2026-04-20']) {
    const log = await prisma.routineLog.create({
      data: {
        routineId: hairCare.id,
        variantId: hcVariantId,
        date,
        completionPct: 100,
        skipped: false,
      },
    })
    logs.push({ log, routineId: hairCare.id, variantId: hcVariantId, date })
  }

  // Gym (weekdays) — Apr 16 missed, rest complete
  const gymVariantId = gym.variants[0].id
  for (const date of ['2026-04-09', '2026-04-10', '2026-04-13', '2026-04-14', '2026-04-15', '2026-04-17', '2026-04-18', '2026-04-20', '2026-04-21']) {
    const log = await prisma.routineLog.create({
      data: {
        routineId: gym.id,
        variantId: gymVariantId,
        date,
        completionPct: 100,
        skipped: false,
      },
    })
    logs.push({ log, routineId: gym.id, variantId: gymVariantId, date })
  }

  // Today's state (April 22) - Morning Skincare: 4/5 required done
  const todayLog = await prisma.routineLog.create({
    data: {
      routineId: morningSkincare.id,
      variantId: msVariantId,
      date: '2026-04-22',
      completionPct: 80,
      skipped: false,
    },
    include: { itemLogs: true },
  })

  const msItems = await prisma.routineItem.findMany({
    where: { variantId: msVariantId },
    orderBy: { order: 'asc' },
  })

  // ms-1, ms-2, ms-3, ms-4 checked (Cleanser, Toner, Vitamin C serum, Moisturiser)
  for (const item of msItems.slice(0, 4)) {
    await prisma.routineItemLog.create({
      data: { logId: todayLog.id, itemId: item.id, done: true },
    })
  }
  // ms-5 (SPF 50) not done yet, ms-6 (Eye cream) optional - not checked

  console.log('Seed complete:', {
    routines: [morningSkincare.name, nightSkincare.name, hairCare.name, gym.name],
    logsCreated: logs.length + 1,
    todayItemsChecked: 4,
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())