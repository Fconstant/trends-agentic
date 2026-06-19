import { createStep } from '@mastra/core/workflows';
import * as PlannerAgent from '../../agents/planner-agent';

export const plannerStep = createStep({
  id: 'plan-planner',
  description: 'Generates structured search queries for a topic',
  inputSchema: PlannerAgent.INPUT_SCHEMA,
  outputSchema: PlannerAgent.OUTPUT_SCHEMA,
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
