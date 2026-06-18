# AGENTS.md

## CRITICAL: Load `mastra` skill first

Load the `mastra` skill BEFORE any Mastra work. Never rely on cached knowledge — APIs change between versions.

## Rules

- Register all agents, tools, workflows, and scorers in `src/mastra/index.ts`
- Use the `dev` and `build` scripts from `package.json` instead of running `mastra dev` / `mastra build` directly
- Split code into small, focused files — one concern per module
- Keep the `src/mastra/workflows/steps/` directory for individual step definitions; workflows in `src/mastra/workflows/` compose them
- Minimise comments — code should be self-documenting through naming and structure
- Export named exports (`export const`) not default exports for workflow components
- Prefer `createStep({ ... })` with explicit params over agent-wrapped steps when the step needs access to `state`, `setState`, or `getInitData`
- Use descriptive, collision-free step IDs with domain prefixes (e.g. `plan-planner`, `research-github`)

## Resources

- [Mastra Documentation](https://mastra.ai/llms.txt)
- [Skills Discovery](https://mastra.ai/.well-known/skills/index.json)
