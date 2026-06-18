# Architecture

## High-Level Architecture

The system uses Mastra as the orchestration layer and an MCP server as the tool provider.

Core stack:

* TypeScript / Node.js
* Mastra
* Web Search Provider (Tavily or Serper)
* Zod for schemas

---

## Core Components

### Planner Agent

Optional lightweight planning layer.

Responsibilities:

* convert topic into search strategy
* generate search queries grouped by research dimensions
* define search focus

Planner does not perform searches.

Typical dimensions:

* GitHub / repositories
* Community discussions
* Production usage

---

### Parallel Search Workflow Step

Deterministic workflow step.

Responsibilities:

* execute multiple web searches in parallel
* gather evidence from different dimensions
* normalize search results

This component is implemented as workflow steps rather than LLM agents.

Reasons:

* lower hallucination risk
* better observability
* deterministic execution
* easier retries

---

### Evaluator Agent

Quality gate between research and analysis.

Responsibilities:

* assess evidence quality
* measure signal density
* detect insufficient coverage
* provide retry feedback

Possible evaluation dimensions:

* recency
* relevance
* diversity of sources
* technical density

Evaluator decides whether the workflow proceeds or retries.

---

### Trend Identifier Agent

Primary analytical component.

Responsibilities:

* analyze evidence
* identify emerging trends
* classify technologies by maturity
* extract meaningful signals

Expected classifications:

* leaders
* challengers
* emerging

This component focuses on interpretation rather than summarization.

---

### Report Writer Agent

Final presentation layer.

Responsibilities:

* convert structured analysis into markdown report
* improve readability
* preserve technical accuracy

The report writer must not introduce new information.
