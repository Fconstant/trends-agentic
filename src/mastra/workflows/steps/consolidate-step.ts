import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';

export const consolidateStep = createStep({
  id: 'plan-consolidate',
  description: 'Consolidates research results, evaluates quality, and provides feedback for re-planning',
  inputSchema: z.object({
    'research-github': z.object({ results: z.string() }),
    'research-community': z.object({ results: z.string() }),
    'research-production': z.object({ results: z.string() }),
  }),
  outputSchema: z.object({
    summary: z.string(),
    passed: z.boolean(),
    feedback: z.string().optional(),
  }),
  execute: async ({ inputData, getInitData, setState }) => {
    // TODO, probably make an agent consolidade and evaluate instead of a step
  },
  retries: 2,
});
