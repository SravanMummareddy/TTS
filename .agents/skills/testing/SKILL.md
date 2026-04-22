# Skill: Testing

**Purpose:** Write tests for module service functions and API routes.

## Instructions

1. Identify what to test: service functions in `modules/[name]/service.ts` are the primary target
2. Use a real test database (separate `DATABASE_URL` in `.env.test`) — no mocking the DB
3. Place test files in `/tests/[module]/service.test.ts` mirroring source structure
4. Run with `npm test`

## Test structure

```ts
// tests/journal/service.test.ts
import { createEntry, getEntries } from '@/modules/journal/service'

describe('journal service', () => {
  it('creates an entry and returns it', async () => {
    const entry = await createEntry({ content: 'test', date: new Date() })
    expect(entry.content).toBe('test')
  })
})
```

## What to test

| Layer | Test? | Notes |
|---|---|---|
| Service functions | Yes | Core business logic |
| API routes | Integration test | Test input validation and response shape |
| UI components | Visual — use mockup | No unit tests for layout components |
| Prisma queries | Via service tests | Don't test Prisma itself |

## Rules

- Use a test database — never run tests against `DATABASE_URL`
- Clean up test data in `afterEach` or use transactions
- Don't mock the database — mocked tests masked real bugs here before
- Test file names match source: `modules/journal/service.ts` → `tests/journal/service.test.ts`
