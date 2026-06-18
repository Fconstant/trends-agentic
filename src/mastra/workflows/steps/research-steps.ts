import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { webSearchTool } from '../../tools/web-search-tool';

function createResearchStep(id: string, description: string, category: 'github' | 'community' | 'production') {
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
    execute: async ({ inputData }) => {
      const queries = inputData.queries[category];
      let allResults = '';
      for (const query of queries) {
        try {
          const executeFn = webSearchTool.execute;
          if (!executeFn) {
            allResults += `## Query: ${query}\n(Search tool not available)\n\n`;
            continue;
          }
          const rawResult = await executeFn({ query } as any, {} as any);
          if (!rawResult || !('results' in rawResult)) {
            allResults += `## Query: ${query}\n(No results)\n\n`;
            continue;
          }
          const res = rawResult as { results: { title: string; url: string; content: string }[] };
          if (res.results.length) {
            allResults += `## Query: ${query}\n`;
            for (const r of res.results) {
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
    retries: 3,
  });
}

export const githubResearchStep = createResearchStep('research-github', 'Searches GitHub for code, repos, and frameworks', 'github');
export const communityResearchStep = createResearchStep('research-community', 'Searches community discussions (Reddit, HN, blogs)', 'community');
export const productionResearchStep = createResearchStep('research-production', 'Searches production usage, case studies, companies', 'production');
