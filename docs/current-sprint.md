# Current Sprint

## Sprint Goal

Polish Tasks module to production quality, then seed remaining modules with types.ts + data.ts pattern.

---

## In Progress

- [ ] Seed remaining modules: Fasting, Journal UI, Settings/User (types.ts + data.ts per module)

## Up Next

- [ ] Tasks — recurring tasks (repeat daily/weekly/monthly)
- [ ] Tasks — task drag-to-reorder
- [ ] Tasks — sort by due date / priority
- [ ] Mobile responsive pass for individual module pages
- [ ] Add Prisma schema — remaining models (Tasks, Fasting, Body)
- [ ] Fill `DATABASE_URL` and run `npx prisma migrate dev --name init_journal` when database work resumes

## Done This Sprint

- [x] Routines module — full end-to-end implementation:
  - Prisma schema: Routine, RoutineItem, RoutineLog, RoutineItemLog models
  - Service layer with streak calculation, log toggle, completion %
  - API routes: GET/POST/PATCH/DELETE routines, items, daily logs
  - UI: Today view (time-grouped checklists + progress rings + skip), Routines view (card grid + create/edit modal), Calendar view (14-day heatmap + per-routine stats)
  - Dashboard widget: Today's Routines with mini progress bars
  - Seed data: Morning Skincare, Night Skincare, Hair Care, Gym
- [x] CLAUDE.md updated with full architecture docs (commands, request flow, module anatomy, design system)

- [x] Next.js 14 project init with TypeScript and Tailwind
- [x] Tailwind config with design tokens from mockup
- [x] `app/globals.css` — all CSS variables + compat aliases
- [x] AppShell layout: sidebar + header (URL-based routing, active state)
- [x] Landing page, Login page, Dashboard module
- [x] All 11 module routes implemented (journal, notes, gallery, fasting, nutrition, body, tasks, routines, insights, settings)
- [x] Tweaks panel — accent color switcher (purple/green/teal/orange)
- [x] Journal backend foundation — Prisma model, migration SQL, service, API routes, Vitest tests
- [x] Tasks module — full Apple Reminders rebuild:
  - Smart lists (Today/Scheduled/All/Flagged) + custom named lists
  - Due date/time, notes, flag, priority, subtasks, inline detail expand
  - Seed data layer: `modules/tasks/types.ts` + `modules/tasks/data.ts`
- [x] Bug fix — accent color now fully propagates: `--purple-d` updated, Sidebar uses `color-mix()`
- [x] Bug fix — task detail closes on click-outside and on list change
- [x] Bug fix — mobile layout: AppShell sidebar slides in/out, hamburger in Header, Tasks single-column
- [x] Tasks — list management: hover `···` → rename / color picker / delete
- [x] Tasks — add-task contextual toolbar: date chip, time chip, priority pills, flag toggle, clear

---

> Updated 2026-04-22
