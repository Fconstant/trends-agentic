import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { plannerStep } from './steps/planner-step';
import { githubResearchStep, communityResearchStep, productionResearchStep } from './steps/research-steps';
import { consolidateStep } from './steps/consolidate-step';

const researchStateSchema = z.object({
  feedback: z.string().optional(),
});

const planAndResearchWorkflow = createWorkflow({
  id: 'plan-and-research',
  inputSchema: z.object({ topic: z.string() }),
  outputSchema: z.object({
    summary: z.string(),
    passed: z.boolean(),
    feedback: z.string().optional(),
  }),
})
  .then(plannerStep)
  .parallel([githubResearchStep, communityResearchStep, productionResearchStep])
  .then(consolidateStep)
  .commit();

export const researchWorkflow = createWorkflow({
  id: 'research-workflow',
  inputSchema: z.object({ topic: z.string().describe('The topic to research') }),
  stateSchema: researchStateSchema,
  outputSchema: z.object({ summary: z.string() }),
})
  .dowhile(planAndResearchWorkflow, async ({ inputData, iterationCount }) => {
    return !inputData.passed && iterationCount < 3;
  })
  .commit();
