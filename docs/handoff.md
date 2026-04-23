# Handoff

---

## Last Session

**Date:** 2026-04-23
**What happened:** Reset routine seed data to remove all existing test routines and seed a single gym-focused routine (`May 17 Cut Plan`) using the existing checklist-based routines UI and logic.

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

5. **Routines Seed Data** - Removed prior skincare/hair/generic gym test data and now seed a single `May 17 Cut Plan` routine with day-specific workout variants while keeping the current routines feature and UI unchanged

6. **Accessibility** - Added CSS rules for 44px minimum touch targets

## Next Steps

1. Notes module — connect UI to API (like Journal)
2. Nutrition module — full service + API + connect UI
3. Body module — full service + API + connect UI
4. Settings — accent color persistence in DB
5. Insights — aggregate module
6. Routines — add future gym tracking enhancements only by extending the current checklist model if needed

## Open Questions

- Food API provider for Nutrition? (FOOD_API_URL in .env is empty)
- Deploy to Vercel with Neon DATABASE_URL set in Vercel dashboard

## Files to Load Next Session

1. `AGENTS.md`
2. `docs/current-sprint.md`
3. `prisma/seed.ts` — if adjusting the seeded gym routine
4. `modules/routines/components/Routines.tsx` — if continuing routines work without changing UI patterns

> Updated 2026-04-23
