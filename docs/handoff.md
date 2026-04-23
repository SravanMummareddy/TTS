# Handoff

---

## Last Session

**Date:** 2026-04-23
**What happened:** Created a remote checkpoint commit (`d6621ea`) before a routines bug sweep, replaced the gym-only seed with resettable routines QA fixtures, fixed routines edit/skip/history bugs in the existing routines flow, added focused routines service/API tests, added Playwright-based routines browser automation, and fixed the mobile routine modal so Save/Cancel stay tappable above the bottom nav.

## Current State

- **Framework:** Next.js 16 + TypeScript + Tailwind
- **Database:** Neon PostgreSQL (remote)
- **All routes implemented:** `/`, `/login`, `/journal`, `/notes`, `/gallery`, `/fasting`, `/nutrition`, `/body`, `/tasks`, `/routines`, `/insights`, `/settings`

## UX/UI Fixes Applied

0. **Header Profile Menu** - Removed the invisible full-screen backdrop that intercepted wheel/touch scrolling. The menu now closes through document-level outside-click and Escape handlers, so the app can keep scrolling while the menu is open.

0. **Mobile Bottom Navigation** - Added shared `--mobile-bottom-space` spacing, made the fixed bottom nav safe-area aware, enabled `viewport-fit=cover`, and applied bottom scroll padding to the Routines nested scroll area so final controls are not hidden behind the nav.

0. **Routines Edit Modal** - Raised the routine builder modal above the fixed bottom nav and constrained its height with `100dvh` plus safe-area padding so Save/Cancel remain reachable on mobile.

1. **Login Screen** - Fixed mobile layout: removed split layout, single column, centered inputs, proper keyboard handling, larger touch targets (44px+)

2. **Navigation** - Added mobile bottom navigation with 5 key sections: Home, Tasks, Routines, Journal, Settings

3. **Dashboard** - Fixed responsiveness:
   - Stat cards: 4-col grid on desktop → 2-col on tablet → 1-col on mobile
   - Main 3-column grid collapses to single column on mobile
   - Hidden side panels on mobile (Weekly Activity, Today's Plan)
   - Routines grid: 2-col → 1-col on mobile
   - Photos grid: 4-col → 2-col on mobile
   - Fasting card: horizontal → vertical on mobile

4. **Today's Plan** - Separated into 3 distinct sections:
   - Routines (with progress bars)
   - Tasks (checklist items)
   - Habits (separate list)

5. **Routines Stabilization**
   - Seed now resets routines into QA fixture data only: `Morning Reset`, `Training Split QA`, `Evening Shutdown`
   - Fixed routines edit persistence so top-level routine changes plus variant/item changes save together
   - Added explicit skip vs restore behavior in the log route/client flow
   - Added routines history loading so the History tab is driven by real logs instead of only today’s logs
   - Hardened routine log writes against concurrent unique-key races during automated QA
   - Added routines-focused Vitest coverage for service and API behavior
   - Added routines Playwright coverage for desktop + mobile create/edit/delete/toggle/skip/history flows
   - Dedicated Playwright test server now runs on port `3100` with serialized fixture reseeding

6. **Accessibility** - Added CSS rules for 44px minimum touch targets

## Next Steps

1. Notes module — connect UI to API (like Journal)
2. Nutrition module — full service + API + connect UI
3. Body module — full service + API + connect UI
4. Settings — accent color persistence in DB
5. Insights — aggregate module
6. Routines — if desired, add one more backend guard for late in-flight log requests during fixture reseeds; current automated suite passes, but dev server can still log transient Prisma errors while the next test is resetting data
7. Routines — once QA fixture work is signed off, switch seed data back from fixture routines to the real gym routine data

## Open Questions

- Food API provider for Nutrition? (FOOD_API_URL in .env is empty)
- Deploy to Vercel with Neon DATABASE_URL set in Vercel dashboard
- Manual routines QA is now largely covered by automation; only optional visual spot-checking remains

## Files to Load Next Session

1. `AGENTS.md`
2. `docs/current-sprint.md`
3. `modules/routines/components/Routines.tsx` — routines UI behavior and manual QA reference
4. `modules/routines/service.ts` — persistence/history/skip behavior
5. `prisma/seed.ts` — resettable routines QA fixture
6. `tests/routines/` — routines service/API regression coverage
7. `tests/e2e/routines.spec.ts` + `playwright.config.ts` — browser automation and mobile modal regression coverage

> Updated 2026-04-23
