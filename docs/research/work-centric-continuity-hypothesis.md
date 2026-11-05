---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "research-hypothesis"
domain: "proto-lithify"
severity: "informational"
name: "Work-centric context continuity — comparative research hypotheses"
version: "0.1.0"
---

# Work-centric context continuity — comparative research hypotheses

## 1. Status and authority

**Status: NON_NORMATIVE_RESEARCH_HYPOTHESIS**

This document records research questions and falsifiable hypotheses concerning contextual continuity across autonomous software-engineering agents.

It does not establish:

- Proto-Lithify runtime functionality;
- a required work-record representation;
- a universal context architecture;
- a product requirement or invariant;
- a Lithify implementation choice;
- a claim of comparative superiority;
- an approved experiment or implementation task.

The existing Proto-Lithify empirical charter governs the distinction between observed evidence, proposed mechanisms, experiments, and qualified conclusions.

Lithify derives its product obligations independently from its accepted Product Intent. Nothing in this document constitutes a normative premise for that derivation.

## 2. Motivating problem

Autonomous engineering agents must often continue work initiated by other agents, sessions, workflows, or execution environments.

Useful continuation information may include:

- the identity and purpose of the work;
- instructions actually available to the preceding agent;
- applicable source materials;
- accepted decisions and relevant authorities;
- produced changes and artifact identities;
- execution outcomes and limitations;
- review findings and dispositions;
- remaining work and continuation conditions;
- information that could not be recovered or verified.

This information may reside in Git history, GitHub objects, published work records, transient agent conversations, external execution systems, or other authorized sources.

Two broad approaches to contextual continuity merit comparison.

**Work-centric recovery:** information relevant to identified engineering work is explicitly retained and associated with that work or its artifacts, then retrieved through identifiable relationships.

**Session-centric recovery:** agent interactions and execution histories are captured, indexed, summarized, searched, or otherwise processed to reconstruct useful context later.

These approaches are not necessarily mutually exclusive.

A hybrid may preserve explicit work records while using session history to recover additional relevant information.

The research question is not which architecture is conceptually richer. It is which capabilities are necessary and sufficient for reliable, efficient continuation within a declared engineering-work scope.

## 3. Foundational distinctions

The following questions must remain separate:

1. Was information recorded?
2. Is its content still retrievable?
3. Is its identity established?
4. Is its association with the relevant work established?
5. Was the information actually delivered to the executing agent?
6. Does the information accurately describe what happened?
7. Does it possess the authority required for the intended decision?
8. Is the retrieved information sufficient for the next operation?
9. Is that information still applicable to the current governing state?

Evidence supporting one answer does not automatically establish the others.

In particular:

- recorded instructions do not prove delivery;
- verified content identity does not prove substantive truth;
- a retrieved report does not independently prove successful execution;
- a published review conclusion does not automatically establish reviewer independence;
- a digest does not make unavailable bytes recoverable;
- an apparently complete context does not prove historical completeness;
- successful retrieval does not establish current normative authority;
- absence within a bounded retrieval scope does not prove historical nonexistence.

A contextual-continuity mechanism must not silently promote weaker evidence into a stronger claim.

## 4. Research hypotheses

### H1 — Bounded information sufficiency

For some explicitly structured software-engineering workflows, the information required for correct continuation may be representable through a bounded collection of explicit work records, artifact identities, relationships, applicable authorities, and execution dispositions.

Where the required information has actually been retained and remains accessible, a subsequent authorized agent may be able to continue correctly without recovering the entire originating conversation.

**Hypothesis status:** UNTESTED.

**Potential falsifiers:**

- necessary continuation information repeatedly exists only in unrecorded session context;
- explicit work records omit materially relevant information even under the declared capture procedure;
- record-based continuation produces materially incorrect decisions despite apparently adequate retrieval;
- required context cannot be identified without richer discovery mechanisms.

No universal sufficiency claim is made.

### H2 — Comparative efficiency

For workloads satisfying H1, explicit work-record recovery may require less total time, inference consumption, operational complexity, or economic cost than capture-and-reconstruction approaches.

The comparison must include the complete cost of creating, maintaining, retrieving, validating, and interpreting the information.

A lower retrieval cost alone is insufficient if explicit publication requires substantially greater upstream effort.

**Hypothesis status:** UNTESTED.

**Potential falsifiers:**

- explicit recording consumes more total resources;
- record selection or maintenance requires excessive human intervention;
- richer memory systems reduce total execution cost;
- work-record maintenance introduces substantial consistency or recovery overhead.

No performance advantage is presumed.

### H3 — Conditional value of enriched memory

Session capture, semantic search, derived knowledge, and contextual reconstruction may provide incremental value where explicit records are incomplete, unavailable, insufficient, or prohibitively expensive to maintain.

The value of each additional mechanism should be evaluated independently where the comparison permits.

**Hypothesis status:** UNTESTED.

Relevant circumstances may include:

- exploratory investigations without predefined work structure;
- incidental discoveries not explicitly published;
- incomplete historical migrations;
- unavailable originating work identifiers;
- undocumented reasoning relevant to subsequent work;
- heterogeneous repositories with weak work-to-artifact associations.

Enriched memory must not automatically be treated as authoritative merely because it supplies otherwise missing context.

### H4 — Evidence reliability versus contextual usefulness

A context-retrieval system may be useful without proving every historical claim it presents.

Conversely, a mechanism may provide verified record identities and content while still failing to provide enough information for correct continuation.

Therefore, contextual usefulness and evidence strength must be evaluated separately.

**Hypothesis status:** UNTESTED as a comparative performance proposition.

This distinction is not a claim that every continuation requires complete historical proof. Required evidence strength depends on the intended operation and its governing obligations.

## 5. Candidate comparison conditions

A future separately authorized study could compare:

**A — Existing durable Git/GitHub surfaces**

Recovery using already available commits, PRs, Issues, comments, native relationships, reports, and artifacts, without introducing a new storage system.

**B — Explicit work-centric recording and recovery**

A caller explicitly supplies relevant records and associations. A mechanical boundary establishes and verifies the supported publication and retrieval postconditions.

This is a conceptual comparison condition, not a claim that the current Proto-Lithify CLI implements work-record publication or retrieval.

**C — Enriched session-context recovery**

A system captures agent sessions and uses indexing, retrieval, summaries, extracted knowledge, or equivalent mechanisms to reconstruct relevant context.

Products such as Entire may provide examples for later investigation. Their exact capabilities, behavior, and guarantees must be verified against dated primary evidence before comparative claims are made.

**D — Hybrid recovery**

Explicit work records provide identifiable continuation information, while session-context mechanisms supply additional relevant material when required.

No condition is selected as the preferred product architecture.

No new database, graph engine, embedding index, universal schema, or recording mechanism is prescribed.

## 6. Evidence from the AFR six-case investigation

The existing artifact-first recoverability study supplies bounded empirical motivation.

Its accepted synthesis reports that:

- all six examined starting artifacts were associated with expected PRs;
- substantial work relationships and records could be recovered through existing Git/GitHub surfaces;
- exact identities and explicit relationships supported cross-checking;
- useful STOP, correction, and continuation information was retained;
- information was distributed across multiple existing surfaces;
- complete originating prompts and historical agent receipt were not established;
- some referenced source material was unavailable as recoverable content;
- record retrieval did not independently establish substantive truth.

These are findings from the declared six-case corpus, not general reliability measurements.

The investigations were exploratory rather than blind.

All six case-level evaluator dispositions remained PARTIAL, and the raw investigator reports had structural deficiencies.

The study did not compare a completed work-record system with enriched contextual memory.

It did not establish:

- universal recovery completeness;
- a causal performance advantage;
- comparative inference efficiency;
- lower monetary cost;
- automatic prompt delivery verification;
- the necessity or redundancy of a particular memory architecture;
- Lithify product conformance.

The study's existing four candidate mechanisms remain unchanged:

- AFR-C01 — Exact-identity navigation across existing records.
- AFR-C02 — Separate record recovery from delivery and truth claims.
- AFR-C03 — Evidence locators with explicit availability limits.
- AFR-C04 — Stage-specific disposition pointers.

H1–H4 are additional research questions informed by these findings, not findings established by the AFR campaign.

## 7. Requirements for any future comparative investigation

Any future experiment requires separate authorization and a preregistered protocol.

That protocol should define:

1. The exact engineering tasks and initial states.
2. The applicable authorities and acceptance criteria.
3. The information available to each participating agent.
4. The recording and retrieval operations allowed in each condition.
5. The expected continuation outcomes.
6. The independent evaluation procedure.
7. The allowed recovery and intervention boundaries.
8. The measurement method and uncertainty treatment.
9. Confidentiality, retention, and access constraints.
10. The conditions under which the experiment must stop.

Measurement dimensions should remain distinct:

- continuation correctness;
- unsupported or incorrectly promoted claims;
- recoverability and missing-information handling;
- publication and retrieval correctness;
- total elapsed time;
- inference tokens and cache use;
- API and tool invocations;
- monetary cost;
- required human intervention;
- operational failure and recovery behavior;
- storage and retention overhead.

The cost of producing durable records must be included.

If systems perform materially different work, the evaluation must not normalize that difference away.

Failure to recover necessary information must remain distinguishable from confidently proceeding with incorrect context.

A comparison should include favorable cases, unfavorable cases, and counterexamples.

## 8. Boundary with other systems

Proto-Lithify currently provides a bounded mechanical GitHub Project V2 and Issue-relationship adapter.

Its implemented commands do not constitute a general work-record publication, retrieval, semantic-memory, or workflow-execution system.

Lithify's accepted Product Intent includes explicitly requested durable work-state and work-record operations, but its specification and realization remain product-owned.

Workflow progression belongs to the invoking system and applicable execution substrate.

Repository governance belongs to the applicable repository-governance system.

Git convergence and publication remain separate responsibilities.

A proposed contextual-continuity capability must not silently move those responsibilities into Proto-Lithify.

## 9. Research disposition

**CURRENT_DISPOSITION: HYPOTHESES_RECORDED_ONLY**

The hypotheses are available for later empirical investigation.

No experiment is initiated.

No implementation is authorized.

No product architecture is selected.

No competing system is declared insufficient.

No hypothesis is accepted as demonstrated.

No change to Lithify Product Intent or derived obligations is made.

A later research or product decision must identify its own authority, evidence, scope, and limitations.

## 10. References

- [Proto-Lithify empirical charter](empirical-role-and-evidence.md)
- [AFR research protocol](artifact-first-recoverability/protocol-v1.md)
- [AFR six-case synthesis](artifact-first-recoverability/results/afr-synthesis-v1.md)
- [PL-R research Issue #38](https://github.com/fanilosendrison/proto-lithify/issues/38)
- [Lithify specification](https://github.com/fanilosendrison/lithify/blob/main/docs/specification/lithify-spec.md)
