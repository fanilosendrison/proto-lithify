---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "research-report-template"
domain: "proto-lithify"
severity: "strict"
name: "Artifact-first recoverability empty case assessment template"
version: "0.1.0"
---

# Artifact-first recoverability case assessment template v1

## Case metadata

```text
STUDY_ID=PL-R-AFR-20261104
PROTOCOL_REVISION=<exact commit>
CASE_ID=<AFR-01..AFR-06>
REPOSITORY=<repository>
STARTING_ARTIFACT_SHA=<exact SHA>
OBSERVATION_TIME=<ISO8601>
AUTHORIZED_SURFACES=<enumeration>
INVESTIGATOR_CONTEXT=<exact description>
INVESTIGATOR_MODE=<BLIND|NON_BLIND_EXPLORATORY>
```

This empty template is governed by [protocol v1](protocol-v1.md); it contains no
observed results or predetermined outcomes. The [case register](case-register-v1.md)
is controller-held evaluation metadata, not initial investigator context.
The campaign requires protocol publication, independent review, acceptance, and
separate execution authorization. Do not supply PR identifiers or descriptive
controller labels as initial hints. Only repository and exact merge SHA are
initial case-specific inputs. Unproven isolation requires
`NON_BLIND_EXPLORATORY`.

## Dimension assessment

Replace placeholders only with actual observations from authorized public
surfaces. Use exactly one classification from the protocol vocabulary per row:
`VERIFIED`, `REFERENCED_NOT_VERIFIED`, `NOT_LOCATED_WITHIN_SCOPE`, `INACCESSIBLE`,
`AMBIGUOUS`, `NOT_APPLICABLE`, or `NOT_EXAMINED`. Include the exact source,
relevant association, and verification strength in the observation. For
unobtained evidence, state the reason rather than fabricate an identity or URL.

DIMENSION | CLASSIFICATION | OBSERVED_IDENTITY | EVIDENCE_URL | OBSERVATION | LIMITATION
--------- | -------------- | ----------------- | ------------ | ----------- | ----------
D01 EXACT_ARTIFACT_IDENTITY | | | | | …
D02 ARTIFACT_TO_PR | | | | | …
D03 ARTIFACT_TO_WORK | | | | | …
D04 WORK_TO_INSTRUCTION | | | | | …
D05 WORK_TO_CONTEXTUAL_SOURCES | | | | | …
D06 WORK_TO_EXECUTION_REPORT | | | | | …
D07 WORK_TO_DECISIONS_AND_REVIEWS | | | | | …
D08 WORK_TO_CHANGE_HISTORY | | | | | …
D09 WORK_TO_CONTINUATION_INFORMATION | | | | | …
D10 PROJECT_AND_NATIVE_RELATIONSHIPS | | | | | …

## Exact discovery sequence

<Starting input, exact investigator instructions, available tools, source
revision, retrieval steps and examined search boundary; no controller hints.>

## Artifact and PR identity verification

[Exact observed identities and independently checkable association evidence.]

## Work and mission recovery

<Observed associations, actor reports, verified claims and unexamined information.>

## Instructions and sources

<Observed records versus independently established receipt or availability to the
executing agent; do not infer unpublished prompts from diffs.>

## Execution reports and review evidence

<Record observation, association verification and substantive truth separately.>

## Decisions, corrections and continuation

<Published decisions, corrections, review findings and cross-execution information.>

## GitHub Project observations

<Public Project state and native relationships, exact identities, observation
time, inaccessible or unexamined surfaces.>

## Ambiguities and inaccessible sources

<Competing evidence, exact access failures and authorized-permission limits.>

## Reconstruction cost measurements

<Record reliable measurements and their provenance; use NOT_MEASURED for every
quantity without reliable measurement. Do not estimate costs from PR lengths or
claim comparative inference efficiency.>

QUANTITY | VALUE | MEASUREMENT_PROVENANCE
-------- | ----- | ----------------------
GitHub API request count | | …
Search and retrieval steps | | …
Total elapsed time | | …
Tool invocations | | …
Model input tokens | | …
Model output tokens | | …
Monetary inference cost | | …
Manual intervention count | | …

## Recovery coverage

<RECOVERY_COVERAGE: recoverability by declared dimension within the examined
boundary; retain negative, unknown and inaccessible outcomes.>

## Unknown historical completeness

<HISTORICAL_COMPLETENESS: distinguish available recovered records from all
originally available information; any stronger claim needs separate evidence.>

## Negative findings and counterexamples

<Scoped searches and their limits; absence of evidence is not nonexistence.>

## Evidence provenance

<Exact revisions, observation times, URLs, preserved observations and access
boundaries. No private context or unpublished instructions are retrieved evidence.>

## Independent evaluation

<Preserved raw classifications, independently observed authoritative GitHub
object checks, evaluator corrections and their evidence, unresolved findings;
apply the protocol's mechanically checkable evaluation rules.>

## Bounded conclusion

<What the case evidence establishes and does not establish. Candidate
improvements are not accepted requirements. No architecture adoption, amendment
of Lithify Product Intent, new CLI capability, universal reliability, or historical
completeness follows. The later six-case synthesis is diagnostic, not representative;
no general reliability percentage without all six comparably examined cases.>
