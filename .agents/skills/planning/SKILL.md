# Skill: Planning

**Purpose:** Break down a feature request or sprint goal into discrete, ordered tasks with clear scope.

## Instructions

1. Read `docs/current-sprint.md` and `docs/product.md` for context
2. Identify the module(s) involved
3. Break the work into tasks at this granularity: one task = one file or one logical unit
4. For each task: write title, module, acceptance criteria (1–3 lines), and dependencies
5. Output as a checklist; add to `docs/current-sprint.md` under "Up Next"

## Output format

```
- [ ] [Module] Task title
      AC: What "done" looks like
      Depends on: [other task or "none"]
```

## Rules

- No task without acceptance criteria
- Tasks that touch UI must reference the design file: `design/README.md`
- Tasks that touch external APIs must confirm the URL is in `docs/links.md` first
- Don't plan more than one sprint at a time
