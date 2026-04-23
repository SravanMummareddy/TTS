# Handoff

---

## Last Session

**Date:** 2026-04-23
**What happened:** Completed 5 features: tasks recurrence, tasks sort/drag, journal API, fasting full stack, mobile pass. Moved to Neon database.

## Current State

- **Framework:** Next.js 16 + TypeScript + Tailwind
- **Database:** Neon PostgreSQL (remote, replaces local Docker)
- **All routes implemented:** `/`, `/login`, `/journal`, `/notes`, `/gallery`, `/fasting`, `/nutrition`, `/body`, `/tasks`, `/routines`, `/insights`, `/settings`
- **Tasks module** — full Apple Reminders-style: smart lists, subtasks, priorities, flags, due dates, recurring (daily/weekly/monthly), sort (manual/dueDate/priority/createdAt), drag-to-reorder
- **Journal module** — connected to DB: list/create/delete entries, editor with tag/date picker
- **Fasting module** — connected to DB: live timer from startTime, target selector, break fast, history list, stats
- **Remaining modules needing DB connection:** Notes, Nutrition, Body, Settings, Insights

## Next Steps

1. Notes module — connect UI to API (like Journal)
2. Nutrition module — full service + API + connect UI
3. Body module — full service + API + connect UI
4. Settings — accent color persistence in DB
5. Insights — aggregate module

## Open Questions

- Food API provider for Nutrition? (FOOD_API_URL in .env is empty)
- Deploy to Vercel with Neon DATABASE_URL set in Vercel dashboard

## Files to Load Next Session

1. `AGENTS.md`
2. `docs/current-sprint.md`
3. `modules/notes/components/Notes.tsx` — if continuing Notes work

> Updated 2026-04-23