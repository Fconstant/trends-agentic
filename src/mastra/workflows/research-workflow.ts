import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { plannerStep } from './steps/planner-step';
import { researchSteps } from './steps/research-steps';
import { evaluateStep, evaluateStepInputSchema } from './steps/evaluate-step';

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
  .parallel(researchSteps)
  .map(async ({ inputData }) => {
    return evaluateStepInputSchema.parse(inputData);
  })
  .then(evaluateStep)
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
