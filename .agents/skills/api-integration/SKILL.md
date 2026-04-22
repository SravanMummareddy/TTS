# Skill: API Integration

**Purpose:** Integrate external APIs (food data, Cloudinary) cleanly without leaking keys or duplicating URLs.

## Instructions

1. Add the base URL to `docs/links.md` and the env key to `.env` first
2. Add the env key to `lib/config.ts`
3. Create a typed client at `lib/api/[service].ts`
4. Call the client only from a module service function — never from a component

## Pattern

```ts
// lib/api/food.ts  (server-only)
import { config } from '@/lib/config'

export async function searchFood(query: string) {
  const res = await fetch(`${config.foodApiUrl}/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`Food API error: ${res.status}`)
  return res.json() as Promise<FoodSearchResult[]>
}
```

```ts
// modules/nutrition/service.ts
import { searchFood } from '@/lib/api/food'

export async function findFoodOptions(query: string) {
  return searchFood(query)
}
```

## Current integrations

| Service | Key | Client file |
|---|---|---|
| Food/nutrition API | `FOOD_API_URL` | `lib/api/food.ts` (to build) |
| Cloudinary | `CLOUDINARY_URL` | `lib/api/cloudinary.ts` (to build) |

## Rules

- API client files are server-only — add `import 'server-only'` at the top
- All base URLs from `lib/config.ts` — never `process.env` directly in a client file
- Handle non-2xx responses as thrown errors at the client level
- Add the endpoint to `docs/links.md → Internal API routes` when creating a proxy route
