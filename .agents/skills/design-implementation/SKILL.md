# Skill: Design Implementation

**Purpose:** Translate Personal OS mockup components into production React/TypeScript.

## Instructions

1. Open `design/README.md` — find the component file for the screen you're building
2. Open that file in a browser. Study: layout structure, spacing rhythm, colours used, interactive states
3. Note the CSS variable names used — map them to `tailwind.config.ts` tokens
4. Build the component from the outside in: shell → sections → inner elements
5. Cross-check against the mockup in the browser before marking done

## Mockup component map

| Screen | Source file |
|---|---|
| Landing | `project mock up/mockup -2 green/components/Landing.jsx` |
| Login | `project mock up/mockup -2 green/components/Login.jsx` |
| AppShell (sidebar + header) | `project mock up/mockup -2 green/components/AppShell.jsx` |
| Dashboard | `project mock up/mockup -2 green/components/Overview.jsx` |
| Journal | `project mock up/mockup -2 green/components/Journal.jsx` |
| Tasks, Gallery, Fasting, Notes, Routines, Insights, Nutrition, Body, Settings | `project mock up/mockup -2 green/components/OtherSections.jsx` |

## Token mapping (mockup CSS var → Tailwind)

```js
// tailwind.config.ts — extend.colors
'bg':        '#0c0c16',
'surface':   '#12121f',
'surface2':  '#181828',
'surface3':  '#1e1e30',
't1':        '#f0f0fa',
't2':        '#9090b0',
't3':        '#5c5c7a',
```

Border radius: `rounded-[14px]` (large), `rounded-[10px]` (small).
Accent colour: use CSS variable `var(--accent)` set via Settings — not hardcoded.

## Rules

- No inline styles — Tailwind only
- No hardcoded hex values — use tokens
- Accent colour must use the CSS variable so Settings module can change it
- Log any intentional deviation from the mockup in `docs/decisions.md`
- If a state exists in the mockup (empty, loading, error) — implement it
