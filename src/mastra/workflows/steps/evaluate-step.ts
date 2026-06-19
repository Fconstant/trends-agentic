import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { researchQualityScorer } from '../../scorers/research-quality-scorer';

export const evaluateStepInputSchema = z.object({
  'research-github': z.object({ results: z.string() }),
  'research-community': z.object({ results: z.string() }),
  'research-production': z.object({ results: z.string() }),
});

export const evaluateStepOutputSchema = z.object({
  summary: z.string(),
  passed: z.boolean(),
  feedback: z.string().optional(),
});

export const evaluateStep = createStep({
  id: 'eval-evaluate',
  description:
    'Evaluates research quality using coverage, freshness, and technical quality criteria, providing feedback for re-planning if needed',
  inputSchema: evaluateStepInputSchema,
  outputSchema: evaluateStepOutputSchema,
  execute: async ({ inputData, getInitData, setState }) => {
    const initData = getInitData() as { topic: string } | undefined;
    const topic = initData?.topic ?? 'Unknown topic';

    const githubResults = inputData['research-github']?.results ?? '';
    const communityResults = inputData['research-community']?.results ?? '';
    const productionResults = inputData['research-production']?.results ?? '';

    const result = await researchQualityScorer.run({
      input: {
        topic,
        githubResults,
        communityResults,
        productionResults,
      },
      output: {},
    });

    const passed = result.score >= 0.6;
    const feedback = passed ? undefined : result.reason;
    const summary = result.reason ?? 'Evaluation complete';

    if (!passed && feedback) {
      setState({ feedback });
    }

    return { summary, passed, feedback };
  },
  retries: 2,
});
