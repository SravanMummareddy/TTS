# Skill: Backend

**Purpose:** Build Next.js API routes and server actions following the service-layer pattern.

## Instructions

1. Read `docs/architecture.md` — API conventions section
2. Identify the module and confirm its Prisma models exist in `prisma/schema.prisma`
3. Create or update the service file at `modules/[name]/service.ts`
4. Create the API route at `app/api/[name]/route.ts` — it only parses input and calls the service

## File pattern

```ts
// app/api/journal/route.ts
import { getEntries, createEntry } from '@/modules/journal/service'

export async function GET(req: Request) {
  const entries = await getEntries()
  return Response.json(entries)
}
```

```ts
// modules/journal/service.ts
import { prisma } from '@/lib/prisma'

export async function getEntries() {
  return prisma.journalEntry.findMany({ orderBy: { date: 'desc' } })
}
```

## Rules

- No business logic in route files — delegate to service functions
- No raw SQL — Prisma only
- Validate all user input at the route boundary before calling the service
- External API calls belong in `/lib/api/[service].ts`, called from the service
- All base URLs from `lib/config.ts` — never from `process.env` directly in a module
- Handle errors in the service; routes return typed JSON responses
