# Skill: Security

**Purpose:** Review Personal OS for common vulnerabilities given its stack (Next.js, Prisma, Cloudinary, external food API).

## Instructions

1. Check API routes: are inputs validated before hitting the service layer?
2. Check env vars: are any secrets exposed to the client bundle?
3. Check Prisma queries: are they using parameterised queries (they are, by default — flag any raw SQL)?
4. Check Cloudinary uploads: is file type and size validated before upload?
5. Check external API calls: is the API key server-side only?

## Common issues to look for

| Issue | Where to look |
|---|---|
| Env var leaked to client | Any `NEXT_PUBLIC_` prefix on secret keys; check `lib/config.ts` |
| Unvalidated user input | API route handlers before service call |
| Direct `process.env` access in components | Should be `lib/config.ts` only |
| FOOD_API_URL exposed to client | `lib/api/food.ts` must be server-only |
| Missing error boundaries | API routes should never return stack traces |

## Output format

List findings as:
```
[SEVERITY] File:line — Issue description — Suggested fix
```

Severities: `HIGH` / `MEDIUM` / `LOW` / `INFO`

## Rules

- Never log secret values, even in development
- `CLOUDINARY_URL` and `FOOD_API_URL` must never appear in client-side code
- Single-user app — no auth system, but still validate all input at API boundaries
- Flag but do not auto-fix HIGH severity issues — confirm with user first
