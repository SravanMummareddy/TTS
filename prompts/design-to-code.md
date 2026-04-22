# Design-to-Code Prompt Template

Copy this when asking an agent to convert a mockup section into a component.

---

**Component:** [PascalCase name]
**Mockup source:** [component file from design/README.md component map]
**Output location:** [/components/ or /modules/[name]/components/]
**Module context:** [which module this belongs to]

## States to implement

- [ ] Default / loaded
- [ ] Empty (no data)
- [ ] Loading skeleton
- [ ] Error state (if applicable)

## Props / data

[What data this component receives. Types will go in `modules/[name]/types.ts` or `lib/types/`.]

## Out of scope

[Anything visible in the mockup that should NOT be implemented in this task.]

## Skill
Apply: [`.agents/skills/design-implementation/SKILL.md`](.agents/skills/design-implementation/SKILL.md)
