import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { webSearchTool } from '../../tools/web-search-tool';

function createResearchStep(id: string, description: string) {
  return createStep({
    id,
    description,
    inputSchema: z.object({
      queries: z.object({
        github: z.array(z.string()),
        community: z.array(z.string()),
        production: z.array(z.string()),
      }),
    }),
    outputSchema: z.object({ results: z.string() }),
    retries: 3,
    execute: async ({ inputData, requestContext }) => {
      const category = id.split('-')[1] as keyof typeof IDS;
      const queries = inputData.queries[category];
      let allResults = '';

      const executeFn = webSearchTool.execute;
      if (!executeFn) {
        allResults += `## (Search tool not available)\n\n`;
        return { results: allResults };
      }

      for (const query of queries) {
        try {
          const rawResult = await webSearchTool.execute?.({ query }, { requestContext });

          if (!rawResult || !('results' in rawResult)) {
            allResults += `## Query: ${query}\n(No results)\n\n`;
            continue;
          }

          const res = rawResult.results
          if (res.length) {
            allResults += `## Query: ${query}\n`;
            for (const r of res) {
              allResults += `- [${r.title}](${r.url}): ${r.content}\n`;
            }
            allResults += '\n';
          }
        } catch {
          allResults += `## Query: ${query}\n(Error during search)\n\n`;
        }
      }
      return { results: allResults || '(No results found)' };
    },
  });
}

export const IDS = {
  github: 'research-github',
  community: 'research-community',
  production: 'research-production',
}

const githubResearchStep = createResearchStep(IDS.github, 'Searches GitHub for code, repos, and frameworks');
const communityResearchStep = createResearchStep(IDS.community, 'Searches community discussions (Reddit, HN, blogs)');
const productionResearchStep = createResearchStep(IDS.production, 'Searches production usage, case studies, companies');

export const researchSteps = [githubResearchStep, communityResearchStep, productionResearchStep];
