# Handoff

Update this file at the end of every session. The next agent (or future you) reads this before `current-sprint.md`.

---

## Last Session

**Date:** 2026-04-22
**What happened:** Restored Journal UI to the sample-data mockup flow. Journal backend foundation still exists behind the scenes, but the visible UI does not use a database or call `/api/journal`.

## Current State

- **Framework:** Next.js 14 App Router + TypeScript + Tailwind — all config files in place
- **package.json exists** — run `npm install` then `npm run dev` to start
- **Dev server verified** — `npm run dev` starts Next.js 14.2.30 at `http://localhost:3000`
- **Journal backend foundation exists** — `JournalEntry` model, migration SQL, service functions, and CRUD API routes are implemented but not connected to visible UI
- **Journal UI uses sample data** — `/journal` matches the mockup flow with local sample entries, tag filters, featured card, post view, and editor view
- **Tests added for future DB work** — `npm test` runs Vitest service tests once `.env.test` has a separate PostgreSQL `DATABASE_URL`
- **All routes implemented:**
  - `/` → Landing page
  - `/login` → Login (demo: any credentials → `/dashboard`)
  - `/dashboard` → Dashboard/Overview with live fasting timer + sparklines
  - `/journal`, `/notes`, `/gallery`, `/fasting`, `/nutrition`, `/body`, `/tasks`, `/routines`, `/insights`, `/settings`
- **Design tokens** → CSS variables in `app/globals.css`, mirrored in `tailwind.config.ts`
- **AppShell** → `components/AppShell.tsx` (client) — sidebar + header + tweaks panel (accent color switcher)
- **Accent color tweak** — purple (default), green, teal, orange — changes `--purple` CSS var live
- **Prisma schema** has `JournalEntry`; Tasks, Fasting, and Body models are still pending

## Next Steps

1. Keep all visible modules on sample data until database work is explicitly resumed
2. Add mobile responsive layout pass (sidebar collapses on small screens)
3. When backend resumes: fill `.env` `DATABASE_URL`, then run `npx prisma migrate dev --name init_journal`
4. When backend tests resume: fill `.env.test` with a separate test PostgreSQL `DATABASE_URL`, then run `npm test`

## Open Questions

- Food API provider for Nutrition module? (Set FOOD_API_URL when decided)
- Deploy target? (Vercel recommended for Next.js)

## Files to Load Next Session

1. `AGENTS.md`
2. `docs/current-sprint.md`
3. `docs/architecture.md` (for Prisma schema work)
4. `modules/journal/components/Journal.tsx` (for Journal CRUD)
