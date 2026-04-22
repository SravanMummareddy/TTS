# Links & Endpoints

**Single source of truth for all URLs, endpoints, and external services.**
No URL is defined anywhere else in the project.

---

## Environment keys → usage

| Key | Purpose | Used in |
|---|---|---|
| `APP_URL` | Base URL of the deployed app | Auth callbacks, og:url meta |
| `DATABASE_URL` | PostgreSQL connection string | Prisma datasource |
| `CLOUDINARY_URL` | Cloudinary SDK auto-config | Gallery module image uploads |
| `FOOD_API_URL` | External food/nutrition data API | Nutrition module food search |

## Internal API routes

| Route | Method | Module |
|---|---|---|
| `/api/journal` | GET, POST | journal |
| `/api/journal/[id]` | GET, PATCH, DELETE | journal |
| `/api/notes` | GET, POST | notes |
| `/api/notes/[id]` | GET, PATCH, DELETE | notes |
| `/api/gallery` | GET, POST | gallery |
| `/api/gallery/[id]` | DELETE | gallery |
| `/api/fasting` | GET, POST | fasting |
| `/api/fasting/active` | GET, PATCH | fasting |
| `/api/nutrition/log` | GET, POST | nutrition |
| `/api/nutrition/food-search` | GET | nutrition (proxies FOOD_API_URL) |
| `/api/body` | GET, POST | body |
| `/api/tasks` | GET, POST | tasks |
| `/api/tasks/[id]` | GET, PATCH, DELETE | tasks |
| `/api/routines` | GET, POST | routines |
| `/api/routines/[id]` | GET, PATCH, DELETE | routines |
| `/api/insights` | GET | insights (aggregates all modules) |

## Referencing in code

```ts
// /lib/config.ts
export const config = {
  appUrl:      process.env.APP_URL!,
  foodApiUrl:  process.env.FOOD_API_URL!,
  cloudinaryUrl: process.env.CLOUDINARY_URL!,
}
```

Never call `process.env.FOOD_API_URL` directly in a module — always import from `/lib/config.ts`.
