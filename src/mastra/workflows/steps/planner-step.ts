import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import * as PlannerAgent from '../../agents/planner-agent';

export const plannerStep = createStep({
  id: 'plan-planner',
  description: 'Generates structured search queries for a topic',
  inputSchema: z.object({ topic: z.string() }),
  outputSchema: z.object({
    queries: z.object({
      github: z.array(z.string()),
      community: z.array(z.string()),
      production: z.array(z.string()),
    }),
  }),
  execute: async ({ inputData, state }) => {
    const feedback = (state as { feedback?: string }).feedback;
    const prompt = feedback
      ? `Topic: ${inputData.topic}\n\nPrevious feedback: ${feedback}\n\nGenerate improved search queries.`
      : `Generate search queries for topic: ${inputData.topic}`;
    const result = await PlannerAgent.agent.generate(prompt, {
      structuredOutput: { schema: PlannerAgent.OUTPUT_SCHEMA },
    });
    return result.object;
  },
  retries: 2,
});
