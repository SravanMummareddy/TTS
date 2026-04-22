# Skill: Frontend

**Purpose:** Build UI components and pages that match the Personal OS mockup exactly.

## Instructions

1. Open `design/README.md` — identify the correct component file for the screen
2. Open that component file in a browser to see the target visual
3. Map the mockup's CSS variables to Tailwind custom values from `tailwind.config.ts`
4. Build as a React server component unless the feature requires client-side state
5. For client components, add `'use client'` and keep them as leaf nodes

## File placement

| What | Where |
|---|---|
| Shared component (2+ modules) | `/components/ComponentName.tsx` |
| Module-specific component | `/modules/[name]/components/ComponentName.tsx` |
| Page (server component) | `/modules/[name]/page.tsx` |

## Styling rules

- Tailwind utility classes only — no inline styles, no CSS modules
- Use CSS custom properties from `tailwind.config.ts` for brand tokens (`bg-surface`, `text-t1`, etc.)
- Dark background (`--bg: #0c0c16`) is always the page base
- Cards use `--surface` (`#12121f`) with `1px solid var(--border)` and `border-radius: 14px`
- Primary text `--t1`, secondary `--t2`, muted `--t3`
- Accent colour is dynamic — use the CSS variable, not a hardcoded hex

## Rules

- Never hardcode a URL in a component — import from `/lib/config.ts`
- Match mockup spacing and layout before adding any enhancements
- Log intentional deviations from the mockup in `docs/decisions.md`
