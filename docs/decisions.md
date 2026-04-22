# Architecture Decision Records

---

## ADR-001: Next.js App Router

**Date:** 2026-04-22
**Status:** Accepted

### Context
Need a full-stack TypeScript framework that supports server components, API routes, and file-based routing in one repo.

### Decision
Next.js 14 with App Router. Server components by default; client components only where interactivity requires it.

### Consequences
- Simpler data fetching (no useEffect for initial loads)
- Learning curve for server vs client component boundary
- All page components in `/app/(app)/[module]/page.tsx` delegate to `/modules/[name]/page.tsx`

---

## ADR-002: Modular monolith over separate services

**Date:** 2026-04-22
**Status:** Accepted

### Context
11 modules with distinct data models. Options: monorepo, microservices, or modular monolith.

### Decision
Modular monolith. One Next.js app, modules self-contained under `/modules/[name]/`, no cross-module imports.

### Consequences
- Simple deployment (single app)
- No inter-service network overhead
- Must enforce module boundary discipline manually — no tooling prevents cross-imports today

---

## ADR-003: Prisma over raw SQL or other ORMs

**Date:** 2026-04-22
**Status:** Accepted

### Decision
Prisma with PostgreSQL. One schema file, typed client, migration history in repo.

### Consequences
- Type-safe queries throughout
- Schema is single source of truth for data shape
- Migration workflow: `prisma migrate dev` locally, `prisma migrate deploy` in CI

---

## ADR-004: Cloudinary for media

**Date:** 2026-04-22
**Status:** Accepted

### Decision
Cloudinary for Gallery module image uploads and CDN delivery. SDK auto-configured via `CLOUDINARY_URL` env var.

### Consequences
- No self-hosted storage needed
- Images served via CDN
- Dependency on external service; acceptable for personal use

---

<!-- New ADRs go above this line in ADR-NNN format -->
