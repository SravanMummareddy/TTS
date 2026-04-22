# Current Sprint

## Sprint Goal

Bootstrap the project: scaffold Next.js app, Tailwind config, and implement all UI modules.

---

## In Progress

- [ ] Add Prisma schema — remaining initial models (Tasks, Fasting, Body)

## Up Next

- [ ] Keep UI on sample data until database work is explicitly resumed
- [ ] Fill `DATABASE_URL` and run `npx prisma migrate dev --name init_journal` when database work resumes
- [ ] Fill `.env.test` `DATABASE_URL` and run `npm test` when database work resumes
- [ ] Mobile responsive layout (sidebar collapse)
- [ ] `/lib/config.ts` — already created, add env vars as needed

## Done This Sprint

- [x] Next.js 14 project init with TypeScript and Tailwind
- [x] Tailwind config with design tokens from mockup
- [x] `app/globals.css` — all CSS variables + compat aliases
- [x] AppShell layout: sidebar + header (URL-based routing, active state)
- [x] Landing page (`/`) — hero, floating preview cards, stats strip, features grid
- [x] Login page (`/login`) — split layout, demo login → `/dashboard`
- [x] Dashboard module — stat cards with sparklines, live fasting ring timer, journal preview, weekly activity chart, recent photos
- [x] Journal module — list/featured/post/editor views, tag filters
- [x] Tasks module — checkbox list, progress bar, inline add
- [x] Gallery module — masonry grid, filter tags, click-to-open modal
- [x] Fasting module — animated SVG ring timer (live), history bars, stats
- [x] Notes module — split-pane list + editor
- [x] Routines module — habit blocks, streak heatmap
- [x] Insights module — weight trend SVG chart, compliance heatmap, stat cards
- [x] Nutrition module — macro bars, calorie progress, meal log
- [x] Body module — metric cards, progress photo grid
- [x] Settings module — profile form, toggle switches
- [x] Tweaks panel — accent color switcher (purple/green/teal/orange)
- [x] Verify dev server runs (`npm install && npm run dev`)
- [x] Journal backend foundation — Prisma model, migration SQL, service, API routes, Vitest service tests; visible UI remains sample-data mockup

---

> Updated 2026-04-22
