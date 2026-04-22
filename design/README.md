# Design References

Visual source of truth for all UI implementation. Open these files in a browser before implementing any screen.

## Mockup files

| File | Variant | Notes |
|---|---|---|
| `../project mock up/Personal OS Standalone - mc2.html` | mc2 (purple accent, older) | Large standalone file with inline components |
| `../project mock up/mockup -2 green/Personal OS.html` | v2 green (current) | Multi-file; loads components from `components/` subfolder |

**Use the green v2 mockup (`mockup -2 green/`) as the primary reference.** It has the most up-to-date layout and component structure.

## Component files (v2 green)

| File | What it contains |
|---|---|
| `components/Landing.jsx` | Landing/splash page |
| `components/Login.jsx` | Login screen |
| `components/AppShell.jsx` | Sidebar, header, page routing, nav groups, design tokens |
| `components/Overview.jsx` | Dashboard/overview section |
| `components/Journal.jsx` | Journal section |
| `components/OtherSections.jsx` | Tasks, Gallery, Fasting, Notes, Routines, Insights, Nutrition, Body, Settings |

## Design tokens (from AppShell.jsx :root)

```css
--bg:        #0c0c16    /* page background */
--surface:   #12121f    /* card background */
--surface2:  #181828    /* secondary card */
--surface3:  #1e1e30    /* hover / active state */
--border:    rgba(255,255,255,0.07)
--border2:   rgba(255,255,255,0.13)
--t1:        #f0f0fa    /* primary text */
--t2:        #9090b0    /* secondary text */
--t3:        #5c5c7a    /* muted text */
--r:         14px       /* border radius */
--rs:        10px       /* small border radius */
--font:      'Plus Jakarta Sans'
```

Accent colour is configurable: green `#22c55e` (default), purple `#7c5cfc`, teal `#0ea5e9`, orange `#f97316`.

## Sidebar navigation groups

```
Dashboard
Life:   Journal · Notes · Gallery
Body:   Fasting · Nutrition · Measurements
Mind:   Tasks · Routines
System: Insights · Settings
```

## Implementation rules

1. Open the relevant component file before implementing any screen
2. Match layout, spacing, and token usage exactly
3. Do not invent spacing or colours not present in the mockup
4. Log intentional deviations in [`docs/decisions.md`](../docs/decisions.md)
5. Map CSS variables 1:1 to `tailwind.config.ts` custom values
