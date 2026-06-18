import z from 'zod'
import { Agent } from '@mastra/core/agent'
import { Agents, Models } from '../consts'

const SYSTEM_PROMPT = `
You are a technical research planner.

Your job is to transform a topic into structured search queries for technical trend analysis.

Rules:
- Do not browse or assume facts.
- Do not summarize the topic.
- Only produce search queries.
- Queries must target real engineering signals:
  - GitHub adoption and repositories
  - Community discussions (Reddit, Hacker News, blogs)
  - Production usage and case studies

Return queries grouped into:
- github (code + repos + frameworks)
- community (opinions, debates, issues)
- production (real usage, companies, case studies)

Keep queries specific and executable in web search systems.
Avoid generic queries like "what is X".
Prefer comparative and usage-focused queries.
`

export const INPUT_SCHEMA = z.object({
	topic: z.string(),
})

export const OUTPUT_SCHEMA = z.object({
	queries: z.object({
		github: z.array(z.string()),
    community: z.array(z.string()),
		production: z.array(z.string()),
	})
})

export type PlannerAgentInput = z.infer<typeof INPUT_SCHEMA>
export type PlannerAgentOutput = z.infer<typeof OUTPUT_SCHEMA>

export const agent = new Agent({
	id: Agents.PLANNER_AGENT,
	name: 'Planner Agent',
	instructions: SYSTEM_PROMPT,
	model: Models.LITE_MODEL,
})

export default agent
