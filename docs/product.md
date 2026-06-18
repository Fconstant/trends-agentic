# Agentic Tech Trend Analyzer

## Overview

Agentic Tech Trend Analyzer is a multi-agent research system designed to analyze technology trends from a given topic and generate structured technical reports.

The goal is not to produce generic summaries. Instead, the system should identify meaningful signals, patterns, adoption trends, ecosystem maturity, and market positioning.

Example inputs:

* "AI agent frameworks"
* "Vector databases"
* "Rust web frameworks"
* "Open-source observability tools"

Example outputs:

* ecosystem overview
* leading technologies
* challengers and emerging players
* adoption signals
* technical risks and limitations

---

## Primary Goals

The project exists mainly as an exploration of agent orchestration using Mastra.

Key learning goals:

* multi-agent workflows
* structured outputs
* tool usage through MCP
* branching and evaluation gates
* orchestration patterns
* observability and debugging

This project is intentionally architecture-focused rather than product-focused.

---

## Non-Goals

The system is not intended to:

* be a production-grade SaaS product
* replace deep human research
* provide financial advice
* generate exhaustive market reports
* crawl the entire internet

---

## Success Criteria

A successful execution should:

1. Collect relevant and recent technical signals
2. Filter marketing noise
3. Distinguish hype from real adoption
4. Produce actionable engineering insights
5. Generate a concise but dense technical report

---

## Design Constraints

### Small but realistic

The architecture should be complex enough to demonstrate meaningful agent orchestration, but small enough to remain maintainable as a personal project.

### Deterministic where possible

Non-LLM logic should remain deterministic whenever practical.

Examples:

* workflow routing
* search execution
* result normalization
* evaluation thresholds

### LLMs only where reasoning adds value

LLMs should primarily be used for:

* planning
* signal extraction
* reasoning
* summarization

LLMs should not be used for deterministic transformations.
