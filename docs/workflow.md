# Workflow

## Main Workflow

The system uses a deterministic workflow with selective LLM reasoning.

```text
Input Topic
    ↓
Planner Agent
    ↓
Parallel Search
    ↓
Evaluator
    ↓
(pass / fail)
    ↓
Trend Identifier
    ↓
Report Writer
```

---

## Step 1: Input

User provides a research topic.

Example:

```text
AI agent frameworks
```

The topic should be broad enough to allow trend analysis but specific enough to produce meaningful signals.

---

## Step 2: Planning

Planner generates structured queries.

Example:

* topic + github adoption
* topic + reddit discussion
* topic + production case studies

This step improves search coverage.

---

## Step 3: Parallel Search

Multiple search steps execute simultaneously.

Typical search categories:

### GitHub Search

Focus:

* repository activity
* stars
* forks
* release velocity

Signals:

* adoption
* maintenance
* momentum

---

### Community Search

Focus:

* Reddit
* Hacker News
* engineering blogs

Signals:

* sentiment
* common complaints
* enthusiasm

---

### Production Search

Focus:

* case studies
* company adoption
* benchmarks

Signals:

* production readiness
* operational maturity

---

## Step 4: Evaluation Gate

Evaluator scores collected evidence.

Example checks:

### Coverage

Does evidence cover multiple dimensions?

### Freshness

Are sources recent?

### Technical Quality

Does evidence contain meaningful engineering information?

---

## Failure Path

If evaluation fails:

```text
Evaluator
    ↓
Retry Search
```

Search can be retried with refined queries.

---

## Step 5: Trend Analysis

Trend Identifier transforms evidence into structured insights.

Output example:

* leaders
* challengers
* emerging technologies
* risks
* notable observations

This is the main reasoning stage.

---

## Step 6: Report Generation

Report Writer generates final markdown output.

Recommended report structure:

# Overview

High-level ecosystem summary.

# Ecosystem Analysis

Competitive landscape and maturity.

# Key Trends

Major signals and movement.

# Risks

Technical or ecosystem concerns.

# Conclusion

Concise engineering-oriented recommendation.

---

## Architectural Principles

### Separate deterministic logic from reasoning

Use code for execution and routing.

Use LLMs for reasoning and synthesis, e.g. when it's non-deterministic.


### Keep agents specialized

Each agent should have one clear responsibility.

Avoid overly broad agents that combine multiple concerns.
