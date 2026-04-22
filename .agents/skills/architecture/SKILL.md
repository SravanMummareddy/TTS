# Skill: Architecture

**Purpose:** Design module structure, data flow, and API contracts. Record decisions as ADRs.

## Instructions

1. Read `docs/architecture.md` and `docs/decisions.md` before proposing anything
2. Evaluate the architectural question against the modular monolith pattern
3. Check: does this require a new module? new Prisma model? new API route?
4. Write an ADR in `docs/decisions.md` for any non-trivial decision
5. Update `docs/architecture.md` if the decision changes the structural map

## ADR format

```markdown
## ADR-NNN: [Title]

**Date:** YYYY-MM-DD
**Status:** Accepted

### Context
Why this decision was needed.

### Decision
What was decided.

### Consequences
Tradeoffs and what it means for the codebase.
```

## Rules

- No cross-module imports — if two modules need shared logic, it goes in `/lib/`
- No new external service without adding its URL to `docs/links.md` first
- All data models go through Prisma — no ad-hoc storage
- Server components by default; client components only where interactivity requires it
