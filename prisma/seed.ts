import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type SeedVariant = {
  days: number[]
  label: string
  items: string[]
}

const cutPlanVariants: SeedVariant[] = [
  {
    days: [1],
    label: 'Push + Core',
    items: [
      'Incline DB Press (3x10)',
      'Shoulder Press (3x10)',
      'Push-ups (3 sets)',
      'Triceps Pushdown (3x12)',
      'Plank (3x45 sec)',
    ],
  },
  {
    days: [2],
    label: 'Pull + Core',
    items: [
      'Lat Pulldown (3x10)',
      'Dumbbell Row (3x10)',
      'Face Pull (3x12)',
      'Biceps Curl (3x12)',
      'Hanging Leg Raises (3x12)',
    ],
  },
  {
    days: [3],
    label: 'Full Body + Cardio',
    items: [
      'Squat or Leg Press (3x10)',
      'Bench Press (3x10)',
      'Lat Pulldown (3x10)',
      'Shoulder Press (3x10)',
      'Incline Walk (20 min)',
    ],
  },
  {
    days: [4],
    label: 'Light + Core',
    items: [
      'Push-ups (3 sets)',
      'Plank (3x60 sec)',
      'Leg Raises (3x12)',
      'Light Dumbbell Circuit',
    ],
  },
  {
    days: [5],
    label: 'Cardio + Core',
    items: [
      'Incline Walk (25 min)',
      'Bicycle Crunches (3x20)',
      'Plank (3x60 sec)',
      'Russian Twists (3x20)',
    ],
  },
  {
    days: [6],
    label: 'Full Body + Cardio',
    items: [
      'Squat (4x10)',
      'Bench Press (4x10)',
      'Rows (4x10)',
      'Shoulder Press (3x10)',
      'Cardio (20 min)',
    ],
  },
  {
    days: [0],
    label: 'Recovery',
    items: [
      'Walk (30 min)',
      'Stretching',
    ],
  },
]

async function main() {
  await prisma.routine.deleteMany()

  const routine = await prisma.routine.create({
    data: {
      name: 'May 17 Cut Plan',
      category: 'fitness',
      color: '#f97316',
      icon: '💪',
      timeSlot: 'afternoon',
      active: true,
      variants: {
        create: cutPlanVariants.map((variant, variantOrder) => ({
          days: variant.days,
          label: variant.label,
          order: variantOrder,
          items: {
            create: variant.items.map((text, itemOrder) => ({
              text,
              optional: false,
              order: itemOrder,
              notes: null,
            })),
          },
        })),
      },
    },
    include: {
      variants: {
        include: { items: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  console.log('Seed complete:', {
    routinesCleared: true,
    routinesCreated: [routine.name],
    variantCount: routine.variants.length,
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
