# Skill: Refactor

**Purpose:** Improve structure and remove duplication without changing behaviour.

## Instructions

1. Define the scope explicitly before starting — which files, which concern
2. Identify: duplicated logic, missing service layer, inline config values, cross-module imports
3. Extract shared logic to `/lib/`; move module-specific logic to `modules/[name]/service.ts`
4. Ensure tests pass before and after (run `npm test`)
5. Write no new features during a refactor

## Common refactor patterns in this project

| Problem | Fix |
|---|---|
| `process.env.FOOD_API_URL` inline in a component | Move to `lib/config.ts`, import in service |
| Prisma query duplicated across modules | Extract to a shared util in `lib/` |
| Logic in `app/api/[name]/route.ts` | Move to `modules/[name]/service.ts` |
| Component doing data fetching | Extract to server component or server action |
| Hardcoded design token hex | Replace with Tailwind custom token |

## Rules

- Scope must be agreed before starting — don't refactor adjacent code opportunistically
- One concern per refactor — don't combine structure + naming + logic extraction
- Behaviour must be identical before and after
- No new abstractions unless three real instances of duplication exist
