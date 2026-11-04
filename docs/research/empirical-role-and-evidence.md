---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "research-charter"
domain: "proto-lithify"
severity: "guideline"
name: "Proto-Lithify empirical role and evidence boundary"
---

# Proto-Lithify empirical role and evidence boundary

## Status and authority

This document records the repository's empirical research role and the method
for delimiting its evidence. It does not amend Lithify Product Intent, select
Lithify architecture, or change Proto-Lithify's executable capabilities.

The existing CLI contract, architecture, installation contract, and contributor
directives retain their respective authority. Research proposals do not modify
those contracts. Agent workflow policy remains with the calling system,
dotagents, and the applicable repository profiles.

## Purpose and present implementation

Proto-Lithify is a concrete GitHub prototype and an empirical investigation
ground informed by actual agent-assisted engineering work. Its current runtime
is a mechanical Project V2 and Issue-relationship adapter: it performs the
explicit operations declared in `docs/cli-contract.md` and produces bounded,
observation-backed receipts.

The research role also permits separately scoped investigation of real work
practices, including instructions, execution reports, handoffs, decisions, and
associations between work and its records. This statement is not a claim that
the current CLI implements record publication, retrieval, review management,
or every observed GitHub operation.

New capabilities require separately authorized work, contract changes where
necessary, implementation, and qualification. The research charter itself
implements none of them.

## Relationship to Lithify

Lithify is specified independently from its accepted Product Intent.
Proto-Lithify's implementation, command vocabulary, GitHub object mappings,
observed workflows, and research proposals are not normative premises for that
derivation. Lithify is not required to generalize this CLI or preserve its
architecture.

Proto-Lithify produces empirical evidence that Lithify may later confront with
an independently established obligation baseline. The prototype does not own
Lithify's derivation, interpretation of Product Intent, or adoption decisions.
The same mechanism may be retained, adapted, replaced, or rejected after that
confrontation. No result is assumed in advance.

The product-side method is owned by Lithify's specification, Section 1. This
reference establishes the responsibility boundary, not an executable runtime
dependency or a requirement that research wait for Lithify's implementation.

## Observe the workflow without assuming it is optimal

Actual work practices are evidence about a concrete environment, not proof
that those practices should be preserved. Record friction, successful cases,
failures, counterexamples, and alternatives rather than treating the current
organization as the desired universal model.

Separate at least these questions when they arise:

- Which outcome did the caller intend, and under which authority?
- Which representation or GitHub operation was actually used?
- Which content, identity, association, or state was observed?
- What required reconstruction, interpretation, or inaccessible local context?
- Which claim was demonstrated, and which limitation remains?

A choice to use an Issue, Project, PR, comment, review, or versioned artifact is
an empirical mapping or caller-policy choice. It does not by itself establish
a Lithify primitive or transfer semantic workflow decisions to the adapter.

## Evidence discipline

Keep proposed scenarios, reported observations, reproduced observations,
executed experiments, independently qualified results, and recommendations
explicitly distinguishable. These are methodological distinctions, not a new
runtime enum or a universal work-record schema.

For a material empirical claim, preserve the relevant scenario, source and
revision, environment and policy context, procedure actually performed,
observations, references to retained evidence, and limitations. Identify which
parts were supplied by another actor and which were independently observed.
A historical report is not silently upgraded to an independently reproduced
result. A passing synthetic test is not a live-provider qualification.

Treat correctness, operational reliability, retrieval and continuation costs,
latency, token consumption, API usage, and economic cost as distinct quantities
when studied. Declare the question and comparison method before interpreting
an experiment. Do not infer causality, statistical strength, universal utility,
or preservation guarantees from anecdotal success.

Keep negative, inconclusive, partial, and rejected results. Preserve original
results when correcting an interpretation. Neither a successful tool call nor
a published report proves the substantive truth of all reported claims.

## Work management and research artifacts

Use GitHub Issues and the existing Engineering Project for independently
tracked research or implementation work. Keep live status and dependencies on
their existing canonical operational surfaces, not in this document.

Store accepted research deliverables and scope-bound evidence in appropriate
versioned or otherwise qualified evidence locations. Use comments for bounded
handoffs and references where the active workflow requires them. Do not impose
a new mapping of every prompt, report, or decision through this charter.

New findings, normative decisions, and implementation changes follow the
existing classification and authorization processes. An experiment may
identify a question for Lithify without answering it on Lithify's behalf.

## Existing qualification program and future investigations

PL-Q (#28), including the PL-06 synthesis (#34), retains its original bounded
qualification scope. This charter does not extend that program, change its
acceptance criteria, or relabel its historical evidence.

The PL-06 requirements-to-evidence matrix is an empirical coverage assessment
against identified Lithify authority. It is not independent derivation, final
product conformance, or authority to select Lithify's realization.

Investigations of work-record practices beyond the qualified adapter scope
must be separately scoped and authorized. No such experiment is started by
this document, and no implementation is claimed from its existence.

## Evidence handoff and later confrontation

An evidence handoff identifies the exact prototype realization and contracts,
scenarios and methods actually examined, retained results, known limitations,
failed or unexamined cases, and recommendations explicitly labeled as such.
A handoff is not an adoption decision.

Lithify subsequently owns the comparison with its independently accepted
obligation baseline. It distinguishes evidence of support, an actual
incompatibility, missing evidence, and an unexamined obligation. Any normative
change or realization selection follows Lithify's own authority process.

Proto-Lithify research may proceed in parallel with Lithify derivation. Do not
create a circular dependency in which empirical work requires completion of
Lithify while Lithify's derivation requires that empirical work as a premise.

## References

- [CLI contract](../cli-contract.md)
- [Architecture](../architecture.md)
- [Installation](../installation.md)
- [Contributor directives](../../AGENTS.md)
- [Engineering Project profile](../repository-governance/proto-lithify-engineering.md)
- [Qualification program](https://github.com/fanilosendrison/proto-lithify/issues/28)
- [Evidence synthesis](https://github.com/fanilosendrison/proto-lithify/issues/34)
- [Lithify specification](https://github.com/fanilosendrison/lithify/blob/main/docs/specification/lithify-spec.md)
