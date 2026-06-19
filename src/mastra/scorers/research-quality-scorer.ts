import { z } from 'zod';
import { createScorer } from '@mastra/core/evals';
import { Models } from '../consts';

const analyseStepResultSchema = z.object({
  coverage: z.object({
    score: z.number().min(0).max(1).describe('0=poor coverage, 1=excellent multi-dimensional coverage'),
    reasoning: z.string(),
  }),
  freshness: z.object({
    score: z.number().min(0).max(1).describe('0=outdated sources, 1=very recent and timely'),
    reasoning: z.string(),
  }),
  technicalQuality: z.object({
    score: z.number().min(0).max(1).describe('0=fluff/marketing, 1=deep engineering substance'),
    reasoning: z.string(),
  }),
});

export const researchQualityScorer = createScorer({
  id: 'research-quality',
  name: 'Research Quality',
  description: 'Evaluates collected research evidence for coverage, freshness, and technical quality',
  type: {
    input: z.object({
      topic: z.string(),
      githubResults: z.string(),
      communityResults: z.string(),
      productionResults: z.string(),
    }),
    output: z.object({}),
  },
  judge: {
    model: Models.LITE_MODEL,
    instructions:
      'You are a technical research quality evaluator. Your job is to assess the quality of collected search evidence for a given research topic. Evaluate across three dimensions:\n' +
      '1. Coverage: Does the evidence cover multiple relevant dimensions (GitHub repos, community discussions, production usage)?\n' +
      '2. Freshness: Are the sources recent and relevant to the current state of the topic?\n' +
      '3. Technical Quality: Does the evidence contain meaningful engineering information (not just marketing fluff)?\n\n' +
      'Be strict but fair. Low scores should trigger re-search with refined queries.',
  },
})
  .analyze({
    description: 'Analyze research evidence across three quality dimensions',
    outputSchema: z.object({
      coverage: z.object({
        score: z
          .number()
          .min(0)
          .max(1)
          .describe('0=poor coverage, 1=excellent multi-dimensional coverage'),
        reasoning: z.string(),
      }),
      freshness: z.object({
        score: z
          .number()
          .min(0)
          .max(1)
          .describe('0=outdated sources, 1=very recent and timely'),
        reasoning: z.string(),
      }),
      technicalQuality: z.object({
        score: z
          .number()
          .min(0)
          .max(1)
          .describe('0=fluff/marketing, 1=deep engineering substance'),
        reasoning: z.string(),
      }),
    }),
    createPrompt: ({ run }) => {
      const { topic, githubResults, communityResults, productionResults } = run.input as {
        topic: string;
        githubResults: string;
        communityResults: string;
        productionResults: string;
      };

      return `Research topic: "${topic}"

## GitHub Research Results
${githubResults || '(No results)'}

## Community Research Results
${communityResults || '(No results)'}

## Production Research Results
${productionResults || '(No results)'}

Evaluate the research quality across three dimensions on a 0-1 scale:
1. Coverage: Does the evidence cover multiple relevant dimensions (GitHub repos, community discussions, production usage)?
2. Freshness: Are the sources recent and relevant to the current state of the topic?
3. Technical Quality: Does the evidence contain meaningful engineering information (not just marketing fluff)?

Return structured JSON with scores and reasoning for each dimension.`;
    },
  })
  .generateScore(({ results }) => {
    const safeResult = analyseStepResultSchema.safeParse(results?.analyzeStepResult);
    if (!safeResult.data) return 0;
    const actualData = safeResult.data;
    const avg =
      (actualData.coverage.score + actualData.freshness.score + actualData.technicalQuality.score) / 3;
    return Math.round(avg * 100) / 100;
  })
  .generateReason(({ results, score }) => {
    const safeResult = analyseStepResultSchema.safeParse(results?.analyzeStepResult);
    if (!safeResult.data) return 'No analysis results available';
    const actualData =  safeResult.data;

    return `Coverage: ${actualData.coverage.score} - ${actualData.coverage.reasoning}
Freshness: ${actualData.freshness.score} - ${actualData.freshness.reasoning}
Technical Quality: ${actualData.technicalQuality.score} - ${actualData.technicalQuality.reasoning}
Overall Score: ${score}`;
  });
