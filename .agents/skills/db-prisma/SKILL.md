# Skill: DB / Prisma

**Purpose:** Design and maintain the Prisma schema, run migrations, and write type-safe queries.

## Instructions

1. Read `prisma/schema.prisma` before making any changes
2. Add or modify models in `schema.prisma`
3. Run `npx prisma migrate dev --name [description]` to generate a migration
4. Never edit migration files after they have been applied

## Schema conventions

- Model names: PascalCase singular (`JournalEntry`, not `journal_entries`)
- Field names: camelCase
- Every model has `id String @id @default(cuid())`
- Every model has `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`
- Timestamps are UTC; display conversion is done in the UI

## Current models (to build out)

| Module | Model(s) |
|---|---|
| Journal | `JournalEntry` |
| Notes | `Note` |
| Gallery | `GalleryItem` |
| Fasting | `FastingSession` |
| Nutrition | `NutritionLog`, `FoodItem` |
| Body | `BodyMeasurement` |
| Tasks | `Task` |
| Routines | `Routine`, `RoutineItem`, `RoutineCompletion` |

## Rules

- `DATABASE_URL` is set in `.env` only — never hardcode [see docs/links.md]
- One schema file — never split `schema.prisma`
- Migrations are immutable once applied — always create new migrations
- Import the Prisma client singleton from `lib/prisma.ts` — never `new PrismaClient()` inline
