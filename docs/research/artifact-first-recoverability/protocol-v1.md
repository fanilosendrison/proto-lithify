---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "research-protocol"
domain: "proto-lithify"
severity: "strict"
name: "Artifact-first work-history recoverability protocol"
version: "0.1.0"
---

# Artifact-first work-history recoverability protocol v1

<!-- study-id: PL-R-AFR-20261104 -->

## Authority and execution gate

This is a preregistered documentary setup, not a result or authorization to
execute the campaign. The six-case read-only retrospective campaign begins only
after this protocol and corpus are publicly versioned, independently reviewed,
and accepted under the repository process, followed by separate audit authorization.
Publication, review, integration, protocol acceptance, and campaign execution
are distinct dispositions.

The [empirical charter](../empirical-role-and-evidence.md) governs the research
boundary. The current implementation provides only the operations in the
[CLI contract](../../cli-contract.md) and
[architecture](../../architecture.md). This investigation neither implements
nor claims existing work-record publication or retrieval capability.

PL-Q [#28](https://github.com/fanilosendrison/proto-lithify/issues/28), PL-04
[#32](https://github.com/fanilosendrison/proto-lithify/issues/32), PL-05
[#33](https://github.com/fanilosendrison/proto-lithify/issues/33), and PL-06
[#34](https://github.com/fanilosendrison/proto-lithify/issues/34) retain their
original scopes and qualification requirements. This study is separate empirical
work, not a retroactive requirement or native blocker for that program.
Mechanical operation and agentic-comparison evidence alone do not qualify
artifact-to-mission, instruction, contextual-source, or execution-report recovery.
Missing evidence is not demonstrated product incompatibility.

Lithify owns independent derivation
([#3](https://github.com/fanilosendrison/lithify/issues/3)) and later confrontation
([#1](https://github.com/fanilosendrison/lithify/issues/1)). Live Lithify main at
`a2415343881087672f1a0c0b213b8a3cf993d9dc` contains the accepted artifact-first
Product Intent amendment in Section 0.15 and Section 0.16. This observation does
not amend that authority or establish a derived obligation baseline. Any later
confrontation must identify its exact accepted obligation revision and separately
qualified empirical evidence. GitHub practices are not normative premises;
no architecture, universal schema, backend mapping, or adoption is selected here.

## Objective

Evaluate the recoverability of engineering-work history from an exact repository
change artifact. The recovery direction is:

```text
Exact artifact identity
    ↓
Observed change and Git history
    ↓
Associated pull request, if established
    ↓
Associated engineering work, if established
    ↓
Published instructions and contextual sources
    ↓
Execution reports, reviews and decisions
    ↓
Information available to a later autonomous agent
```

Every arrow represents a relationship to investigate, not a relationship assumed
to exist.

## Starting knowledge

The investigator's initial case-specific input consists exclusively of:

- Repository full name.
- Exact Git merge commit SHA.

The investigator must not receive the originating Issue number, task prompt,
PR number, report text, or known relationships as initial discovery hints.
The [frozen case register](case-register-v1.md) is held by the research controller
and used for later evaluation. A later execution must prevent leakage of its PR
identifiers and descriptive labels into the investigator's initial context.
If that isolation cannot be established, classify the run as
`NON_BLIND_EXPLORATORY` rather than claiming blind artifact-first recovery.
These mode labels are not dimension classifications.

## Authorized surfaces and limits

Use only:

- Public Git commit objects and repository history.
- Public GitHub PR metadata, comments, and reviews.
- Public Issue bodies, comments, and native relationships.
- Publicly accessible GitHub Project information.
- Public versioned repository documentation.
- Public, explicitly linked evidence artifacts.
- Public evidence needed to verify a directly encountered relationship.

No private workspace, local chat history, agent session history, credentials,
hidden source material, or unpublished instruction is admissible as retrieved
evidence. Do not inspect private repositories, mutate case-source repositories,
infer unpublished prompts from diffs, execute coding agents, or run cost-bearing
benchmarks. Preserve the exact access failure if an expected public case resource
is inaccessible; stop rather than substitute a case.

The study is bounded to the six frozen cases and the authorized surfaces actually
examined at recorded observation times. Declare the search boundary and retrieval
steps per case, including unexamined surfaces and execution constraints. Absence
within that boundary is not global nonexistence. No runtime change, backend
mutation experiment, automatic private-conversation capture, storage design,
universal record schema, or requirement of complete provenance is authorized.

## Recovery dimensions

For every case, assess these ten dimensions:

```text
D01 EXACT_ARTIFACT_IDENTITY
D02 ARTIFACT_TO_PR
D03 ARTIFACT_TO_WORK
D04 WORK_TO_INSTRUCTION
D05 WORK_TO_CONTEXTUAL_SOURCES
D06 WORK_TO_EXECUTION_REPORT
D07 WORK_TO_DECISIONS_AND_REVIEWS
D08 WORK_TO_CHANGE_HISTORY
D09 WORK_TO_CONTINUATION_INFORMATION
D10 PROJECT_AND_NATIVE_RELATIONSHIPS
```

For each dimension, identify the exact observation or source, observed identity,
relevant association, verification strength, limitations, evidence URL, and
classification. Separate observed facts, actor reports, verified claims,
unexamined information, scoped negative findings, inaccessible sources,
ambiguities, and candidate improvements. Improvements are not accepted requirements.

## Classification vocabulary

Use exactly these dimension statuses:

```text
VERIFIED
REFERENCED_NOT_VERIFIED
NOT_LOCATED_WITHIN_SCOPE
INACCESSIBLE
AMBIGUOUS
NOT_APPLICABLE
NOT_EXAMINED
```

- `VERIFIED`: The declared evidence establishes the exact identity, content, or
  association actually claimed.
- `REFERENCED_NOT_VERIFIED`: A statement or reference exists, but the claimed
  underlying fact has not been independently established.
- `NOT_LOCATED_WITHIN_SCOPE`: The declared authorized surfaces were examined and
  did not locate the requested information. This does not establish global
  nonexistence.
- `INACCESSIBLE`: An identified relevant source could not be accessed under the
  authorized permissions.
- `AMBIGUOUS`: Multiple candidates, inconsistent identities, or contradictory
  records prevent exact identification.
- `NOT_APPLICABLE`: The dimension is demonstrably irrelevant to the specific
  case, based on explicit evidence. Mere lack of information is insufficient.
- `NOT_EXAMINED`: The dimension was not evaluated, including when access or
  execution constraints stopped the assessment before examination.

Do not introduce alternative classification labels without an explicit protocol
revision and review.

## Evidence strength

Separate three claims:

1. A record was observed.
2. The record was associated with a particular work item or artifact.
3. The substantive statements within the record are correct.

Verification of claims 1 and 2 must never be represented as verification of
claim 3.
A PR body saying that an agent executed a particular prompt is not independently
verified evidence that the agent actually received the exact prompt. A linked
source is not proof that the source was available to the executing agent unless
that relationship is independently established. A Git commit message is not
automatically an authoritative mission record. Retrieval and interpretation
remain separate.

## Completeness

Distinguish:

- `RECOVERY_COVERAGE`: Which declared dimensions were recoverable within the
  investigation boundary?
- `HISTORICAL_COMPLETENESS`: Whether the observed records constitute all relevant
  information originally available.

The study may measure recovery coverage. It must not claim historical completeness
without separately established evidence.

## Reconstruction cost

Record when actually measured:

- GitHub API request count.
- Search and retrieval steps.
- Total elapsed time.
- Tool invocations.
- Model input/output tokens.
- Monetary inference cost.
- Manual intervention count.

Use `NOT_MEASURED` for quantities without reliable measurements. This is a
measurement sentinel, not a dimension classification. Do not estimate token costs
from PR lengths. Do not compare agent inference efficiency unless a separately
authorized controlled experiment exists.

## Independent evaluation

For a later execution campaign, preserve:

- Exact starting artifact identity.
- Investigator instructions.
- Available tools.
- Source revision.
- Observations and URLs.
- Retrieval steps.
- Raw classifications.
- Evaluator corrections.
- Unresolved findings.

The investigator's reconstructed associations must be checked against
independently observed authoritative GitHub objects. A plausible narrative is
not sufficient. Preserve raw investigator output separately from evaluator
corrections; identify the evidence and scope of every corrected claim.

## Mechanically checkable evaluation rules

Use the [empty report template](report-template-v1.md) for each case.
An evaluator checks the following without treating structural validity as proof
of substantive truth:

1. The study identity is `PL-R-AFR-20261104`; protocol revision is an exact
   published commit; repository and starting SHA equal the controller's frozen
   case entry.
2. Exactly one assessment row exists for each of D01–D10, with its exact dimension
   name and one classification from the seven-status vocabulary.
3. Each row declares its observed identity, evidence URL, observation, and
   limitation, or explicitly describes why evidence was not obtained. The
   observation identifies the claimed association and its verification strength.
4. `VERIFIED` claims cite evidence establishing precisely the identity, content,
   or association claimed; record observation is not evidence of substantive truth.
5. `REFERENCED_NOT_VERIFIED` preserves the reference and unverified claim;
   `NOT_LOCATED_WITHIN_SCOPE` identifies examined surfaces and search steps;
   `INACCESSIBLE` identifies the source and exact failure;
   `AMBIGUOUS` preserves competing or contradictory evidence;
   `NOT_APPLICABLE` cites explicit irrelevance evidence;
   `NOT_EXAMINED` states the examination constraint.
6. Initial context and tools are recorded. PR/Issue hints or controller-label
   leakage prohibit `BLIND`; use `NON_BLIND_EXPLORATORY` if isolation is unproven.
7. Each cost quantity is backed by reliable measurement or `NOT_MEASURED`.
   Recovery coverage and historical completeness are reported separately.
8. Raw classifications, independently observed association checks, evaluator
   corrections, and unresolved findings remain available. Missing or inaccessible
   outcomes cannot be omitted to improve the synthesis.
9. One case assessment per frozen case and one bounded synthesis are required
   for a full campaign report. Incomplete execution retains its actual coverage;
   no general reliability percentage is allowed unless all six cases were
   examined under comparable, documented conditions.

## Prohibited conclusions

The study MUST NOT infer:

- That unavailable prompts never existed.
- That missing records were never created.
- That a linked report is truthful.
- That recovered information is historically complete.
- That a GitHub representation is necessary for Lithify.
- That Proto-Lithify already implements the investigated capabilities.
- That one successful reconstruction proves universal reliability.
- That research findings amend Lithify Product Intent.

## Output

Produce one case assessment per frozen case and one bounded synthesis after
separate execution authorization. Do not aggregate scores into a general
reliability percentage unless all six cases were actually examined under
comparable and documented conditions. The six cases are a purposive diagnostic
sample, not a representative statistical sample. No study findings are claimed
by this setup.
