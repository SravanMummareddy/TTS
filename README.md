# Personal OS

A personal life operating system — dark-themed dashboard for tracking health, body, mind, and daily life.

## Modules

| Module | Description |
|---|---|
| Dashboard | Daily overview and summary widgets |
| Journal | Daily journal entries with mood tracking |
| Notes | Free-form notes and quick capture |
| Gallery | Photo log with date-based organisation |
| Fasting | Intermittent fasting timer and history |
| Nutrition | Food tracking with macro breakdown |
| Body | Body measurements and progress tracking |
| Tasks | Task management with priorities |
| Routines | Daily/weekly routine templates |
| Insights | Cross-module analytics and trends |
| Settings | App preferences, accent colour, density |

## Stack

- **Next.js 14** — App Router
- **TypeScript**
- **Prisma** — PostgreSQL ORM
- **Tailwind CSS**
- **Plus Jakarta Sans** — primary font

## Design

Mockups are in [`/design`](design/). Dark theme with configurable accent colour (purple / green / teal / orange). See `design/README.md` before touching any UI.

## Quick Start

```bash
cp .env .env.local       # fill in values from docs/links.md
npm install
npx prisma migrate dev
npm run dev
```

## Docs

- [Product](docs/product.md)
- [Architecture](docs/architecture.md)
- [Links & Endpoints](docs/links.md)
- [Current Sprint](docs/current-sprint.md)
- [AI Agent Rules](AGENTS.md)
