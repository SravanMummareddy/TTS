# Feature Prompt Template

Copy this and fill it in when asking an agent to build a feature.

---

**Feature:** [name]
**Module:** [dashboard / journal / notes / gallery / fasting / nutrition / body / tasks / routines / insights / settings]
**Mockup file:** [path from design/README.md]
**Skill to apply:** [path to .agents/skills/SKILL.md]

## What to build

[Describe the feature from the user's perspective in 2–3 sentences.]

## Acceptance criteria

- [ ] [Specific, testable condition]
- [ ] [Specific, testable condition]
- [ ] [Specific, testable condition]

## Files expected to change

- `modules/[name]/service.ts`
- `modules/[name]/components/`
- `app/api/[name]/route.ts` (if new endpoint)
- `prisma/schema.prisma` (if new model)

## Out of scope

[What the agent should NOT do in this task.]

## Notes

[Any constraints, edge cases, or context the agent needs.]
