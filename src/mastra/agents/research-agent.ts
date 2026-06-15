import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { scorers } from '../scorers/weather-scorer';

export const researchAgent = new Agent({
	id: 'research-agent',
	name: 'Research Agent',
	instructions: `You are a Technical Data Mining Specialist.
	Your mission is to perform exhaustive and multidimensional searches on the given topic.
	Decompose the topic into queries focused on:

	1. State of the art (last 12 months),
	2. Main frameworks/libraries,
	and 3. Technical discussions in communities (GitHub/Reddit).

	Return the most relevant snippets and raw links, prioritizing official documentation and engineering forums.`,
	model: 'google/gemini-2.5-pro',
	// tools: { weatherTool },
	// scorers: {
	// 	toolCallAppropriateness: {
	// 		scorer: scorers.toolCallAppropriatenessScorer,
	// 		sampling: {
	// 			type: 'ratio',
	// 			rate: 1,
	// 		},
	// 	},
	// 	completeness: {
	// 		scorer: scorers.completenessScorer,
	// 		sampling: {
	// 			type: 'ratio',
	// 			rate: 1,
	// 		},
	// 	},
	// 	translation: {
	// 		scorer: scorers.translationScorer,
	// 		sampling: {
	// 			type: 'ratio',
	// 			rate: 1,
	// 		},
	// 	},
	// },
	memory: new Memory(),
});
