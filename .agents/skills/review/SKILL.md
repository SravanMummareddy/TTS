# Skill: Review

**Purpose:** Review code changes for correctness, convention adherence, and mockup alignment.

## Instructions

1. Read the diff or the specified files
2. Check against each item in the checklist below
3. Output numbered findings with file:line references

## Review checklist

**Architecture**
- [ ] No cross-module imports (modules only import from `lib/` or their own folder)
- [ ] No business logic in API route files
- [ ] No `new PrismaClient()` outside `lib/prisma.ts`

**URLs & config**
- [ ] No hardcoded URLs — all from `lib/config.ts`
- [ ] No new env vars without a matching entry in `docs/links.md` and `.env`

**UI**
- [ ] Component matches mockup (check `design/README.md` for the reference file)
- [ ] No inline styles
- [ ] Uses Tailwind custom tokens, not hardcoded hex values

**Types**
- [ ] No `any` types
- [ ] Prisma query return types are used, not re-declared

**General**
- [ ] No commented-out code
- [ ] No TODO comments (use `docs/current-sprint.md` instead)

## Output format

```
1. [TYPE] modules/journal/service.ts:42 — hardcoded URL; import from lib/config.ts
2. [UI] components/Card.tsx — inline style `color: #7c5cfc`; use CSS variable via Tailwind token
```

Types: `ARCH` / `URL` / `UI` / `TYPE` / `SECURITY` / `STYLE`
