---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "research-case-assessment"
domain: "proto-lithify"
severity: "guideline"
name: "AFR-05 empirical case assessment"
version: "0.1.0"
---

# AFR-05 — Artifact-first recoverability assessment

## Case metadata

```text
STUDY_ID=PL-R-AFR-20261104
PROTOCOL_REVISION=91727041cddcedcdd83903617d4061de78473a8c
CASE_ID=AFR-05
REPOSITORY=fanilosendrison/proto-ring
STARTING_ARTIFACT_SHA=a1b27ca1e21423973a5557415488e4fcd535d01a
OBSERVATION_TIME=2026-11-05T12:23:31Z/2026-11-05T12:29:18Z
AUTHORIZED_SURFACES=Public GitHub commits/history; PR metadata, bodies,
  comments and reviews; Issue bodies, comments, timelines and native
  relationships; public Projects; versioned documentation; directly linked
  public evidence
INVESTIGATOR_CONTEXT=Generic research instructions plus repository and exact
  SHA only; no initial PR, Issue, descriptive case label, originating prompt or
  known relationship
INVESTIGATOR_MODE=NON_BLIND_EXPLORATORY
EVALUATION_DISPOSITION=PARTIAL
```

Study, revision and case identifiers above are evaluator/controller metadata,
not investigator recovery. The protocol and template were independently
retrieved at the exact [published revision][protocol].

Investigator session: `01a1aba9-ce5d-733e-a86f-93a9be8aec7f`. Effective runtime
observations before and after investigation report provider `openai-codex-1`,
model `gpt-6.1-sol`, thinking `xhigh`, and bash. Context-file injection,
skills, prompt templates and discovered extensions were disabled; the existing
provider extension remained enabled.

No technical sandbox or controller-material confinement is asserted.
Initialization supplied no subject. The supplied input-boundary account reports
no case-selection hints.

Independent evaluation session: `01a1abb2-8d82-79f6-ad28-2551e3e09d15`, with
the same observed provider/model/thinking and read/bash tools. Public rechecks
were completed by `2026-11-05T12:38:25Z`. No evaluator post-review runtime
state is claimed.

**Evaluation disposition: PARTIAL.** Public evidence supports the bounded
substantive classifications, but the frozen investigator report did not satisfy
the complete required reporting structure.

## Dimension assessment

`VERIFIED` applies only to the precise record identity, content or association
described. It does not certify all statements within that record.

DIMENSION | CLASSIFICATION | OBSERVED_IDENTITY | EVIDENCE_URL | OBSERVATION | LIMITATION
--------- | -------------- | ----------------- | ------------ | ----------- | ----------
D01 EXACT_ARTIFACT_IDENTITY | VERIFIED | Commit `a1b27ca1e21423973a5557415488e4fcd535d01a`; tree `5ad78576922a5bfa209322130f989e4f1d555b49` | [Exact commit][S] | REST and GraphQL establish exact repository, commit, sole parent, tree and change metadata. | Git metadata does not establish mission intent, executing-agent identity or instruction receipt.
D02 ARTIFACT_TO_PR | VERIFIED | PR #139; head and recorded merge equal starting SHA | [PR #139][PR139] | Commit association queries return one PR; PR metadata and native merge event agree on the exact artifact. | Single-parent publication is provider-recognized merging, not a claim that this is a two-parent Git merge commit.
D03 ARTIFACT_TO_WORK | VERIFIED | API-01, Issue #134 | [Exact-source acceptance][acceptance] | PR references #134; acceptance explicitly identifies SHA, tree, subtree and PR #139. | Establishes published work association, not completeness of the original mission.
D04 WORK_TO_INSTRUCTION | VERIFIED | Issue #134 requirements and exact-SHA package instructions | [Issue #134][I134]; [README][readme] | Published instruction content and its association with API-01 are observable. | Current editable Issue content does not establish historical wording or actual delivery to the executing agent.
D05 WORK_TO_CONTEXTUAL_SOURCES | REFERENCED_NOT_VERIFIED | `proto-ring-api01-v1-candidate.zip`; recorded SHA-256 `549f34fb743e2cdaf6fb2c6a9ee05f1ee85b61b8e37b377db6a7f3eef13896d8` | [PR provenance][PR139]; [public contract][context] | PR identifies an original archive; public derivative documents and a required contextual contract were retrieved. | Original archive bytes, digest comparison and delivery were not recovered. Public derivatives cannot substitute for the original archive.
D06 WORK_TO_EXECUTION_REPORT | VERIFIED | PR #139 R2 report; CI run `41875856412` at starting SHA | [PR report][PR139]; [main CI][CI] | SHA-bound report content exists; provider records separately show exact-SHA CI success and four successful jobs. | Reported local package validations were not rerun; CI success does not establish untested host/runtime guarantees.
D07 WORK_TO_DECISIONS_AND_REVIEWS | VERIFIED | Contract-only owner acceptance; published review summaries | [Acceptance comment][acceptance] | A public decision reports GO on the exact source and identifies its acceptance boundary. | Underlying review receipt/manifest are privately retained. Their content and substantive verdict were not independently audited.
D08 WORK_TO_CHANGE_HISTORY | VERIFIED | Five-commit PR chain; corrective parent; editorial child `e639d8d5a364b81619a62d73037d9ac19a171a48` | [PR history][PR139]; [editorial child][editorial]; [correction][cleanup] | Provider records establish the linear chain, bytecode correction and direct editorial continuation. | This is examined Git history, not a complete audit of every historical ref operation.
D09 WORK_TO_CONTINUATION_INFORMATION | VERIFIED | Issues #135–#137; PR #141; API-03 handoff | [API-03 handoff][handoff]; [PR #141][PR141] | Published handoff and downstream records identify continuation source, integration points and remaining work. | Continuation implementation, downstream CI and reported validation truth were not independently audited.
D10 PROJECT_AND_NATIVE_RELATIONSHIPS | VERIFIED | Project #8 item `PVTI_lAHOAdFdvs4BkTxizhFdk0s`; parent #28; dependency spine | [Project #8][project]; [Issue #134][I134] | Public item fields and native parent/dependency projections were observed; PR #139 has zero native closing-Issue references. | Current scheduling metadata is not execution evidence or proof of historical Project state.

## Exact discovery sequence

The starting case-specific input was the repository and full starting SHA.
Instructions authorized public-source reads, prohibited mutation/source
execution/private discovery, imposed at most 100 logical API invocations,
required one API invocation per bash command, and limited relationship
discovery to artifact 0 → associated PR 1 → work 2 → directly linked
context/continuation 3.

Instruction text is not reproduced as a private transcript. The input boundary
and observable execution are recorded here.

All REST paths below are relative to `repos/fanilosendrison/proto-ring/`. `S`
denotes the full starting SHA. GraphQL requests were pure queries.

1. GET `commits/S`: initial response was display-truncated.
2. GET `commits/S`: narrower identity/file projection.
3. GET repository metadata: public identity.
4. GET `commits/S/pulls?per_page=100&page=1`: recovered PR #139 at hop 1.
5. GET `pulls/139`: exact head, merge and state.
6. GET `pulls/139/commits?per_page=100&page=1`: five commits.
7. GET `issues/134`: work at hop 2; display-truncated.
8. GET `issues/134`: metadata and first 11,000 body characters.
9. GraphQL: PR #139 and Issue #134 native relationships, comments, reviews and
   Project membership.
10. GET `issues/134/comments?per_page=100&page=1`: owner acceptance.
11. GET `issues/139/timeline?per_page=100&page=1`: nested content caused
    display truncation.
12. Same timeline with a narrow projection: nine events.
13. GET `issues/134/timeline?per_page=100&page=1`: twenty events and
    continuation references.
14. GET `commits/S?per_page=100&page=1`: 100 changed paths and README patch.
15. Same commit, explicit page 2: nine remaining paths.
16. GraphQL: identified Project item and fields.
17. GET exact-SHA package README contents.
18. GET `actions/runs?head_sha=S&per_page=100&page=1`: three CI runs.
19. GET `actions/runs/41875856412/jobs?per_page=100&page=1`: four jobs and step
    conclusions.
20. GET exact-SHA `.github/workflows/ci.yml`.
21. GET `issues/135`: continuation at hop 3.
22. GET `issues/136`: continuation at hop 3.
23. GET `issues/137`: continuation at hop 3.
24. GET `issues/28`: native parent at hop 3.
25. GraphQL: parent children, continuation dependencies and #135/#136 comments.
26. GET `pulls/141`: reached directly through #134’s timeline at hop 3.
27. GET editorial commit `e639d8d5a364b81619a62d73037d9ac19a171a48`, directly
    referenced by PR #139.
28. GET historical correction commit
    `93622fa4d4b8725f58f04bdce733f4e842653211`.
29. GET corrective parent `3e9a6bf5f1eb217ae42401f5b34b64810a07d127`.
30. GET `actions/runs/41736386233`: historical failure.
31. GET exact-SHA specification: lines 1–90 and 536 onward.
32. GET required contextual contract at audited base: first 6,500 characters.
33. GET exact-SHA semantic dataset: qualification declarations.
34. GraphQL: final exact commit, associated PRs and API subtree recheck.

Four date-only calls accompanied retrieval. Final identity rechecking was
bounded by `12:29:07Z` and `12:29:18Z`.

The trace contains 34 logical API invocations, below the 100-invocation
ceiling, with no automatic pagination or fourth-hop object retrieval. Comments,
reviews and native relationship projections were containment reads, not
authorization for additional downstream traversal.

Unexamined surfaces include original archive bytes, private review material,
raw local validation outputs, complete historical instruction revisions, most
contextual source files, continuation implementation and additional
timeline-linked work. Neither source code nor repository tests were executed.

## Artifact and PR identity verification

The public repository has database ID `1381053944`. The exact [commit][S] has:

- Sole parent: `3e9a6bf5f1eb217ae42401f5b34b64810a07d127`.
- Tree: `5ad78576922a5bfa209322130f989e4f1d555b49`.
- API subtree: `effe8bb52de4899e666c800683ad17db8ff7efeb`.
- Commit timestamp: `2026-11-04T14:01:51Z`.
- 109 changed files: 73 added and 36 modified; 4,234 additions and 1,021
  deletions.
- All changed paths under `docs/api/v1/`.

Its subject is “feat(api): implement R2 error attribution and uniqueness
controls.” That wording does not independently establish production
implementation.

REST and GraphQL associated exactly [PR #139][PR139], titled “docs(api): stage
API-01 v1 contract candidate for hostile review.” Its head and recorded merge
commit equal the starting SHA; base is
`1eb84e1b4474b155d2271d1decb66d0cd86a555f`. GitHub records merging at
`2026-11-04T17:15:47Z`. The native merge event independently names the same
artifact.

The reported historical guarded `updateRefs` invocation was not observed.
Resulting Git identities and provider-recognized merging were observed.

## Work and mission recovery

[Issue #134][I134], “API-01 — Define the public read-only repository-governance
API contract,” states that it owns contract design and responsibility
boundaries, not production implementation.

The PR explicitly references #134. The [owner acceptance comment][acceptance],
created `2026-11-04T17:42:29Z`, names the starting SHA, tree, API subtree, PR
\#139 and parent #28, accepting **CONTRACT ONLY**.

The PR describes R2 dispositions concerning operation/error attribution,
host-plan boundaries, duplicate environment IDs and post-effect interruption
metadata. These are published remediation claims, not an independent technical
qualification performed by this study.

The recovered association is therefore artifact → PR #139 → API-01
contract-design work. It is not inferred solely from the commit subject.

## Instructions and sources

Published instruction records include:

- [Issue #134][I134]: objectives, required source audit, acceptance criteria
  and dated decision sections.
- [Exact-SHA README][readme]: validation commands, dependencies, review gates
  and provenance.
- [Exact-SHA specification][spec]: contract and review instructions, including
  explicit treatment of unresolved guarantees and unexecuted scenarios.

Their existence, examined content and work association are established.
**Historical receipt by the executing agent is not established.** Issue/PR
bodies are mutable and contain retrospective material; present content and
dated headings do not reconstruct an exact historical prompt.

PR #139 records the original archive’s filename and digest, but no public
archive retrieval location was located in the examined records.
Import-integrity and byte-equivalence assertions remain participant reports.

The required [RepositoryGovernanceState contract][context] was partly retrieved
at audited base `1eb84e1b4474b155d2271d1decb66d0cd86a555f`. Other required
contracts and engine paths were referenced but not fully examined.
Retrievability does not establish historical use or availability to a
particular agent.

No unpublished prompt was inferred from a diff.

## Execution reports and review evidence

[PR #139][PR139] contains R2 validation reporting: 197 schema cases, five
discovery operations, ten tooling controls, five local-context controls, 13
identity vectors, 11 native-path cases, 215 manifest entries and 176 neutral
Python tests. These are observable report contents; they were not rerun.

The [semantic dataset][semantic] independently contains 87 records marked
`qualified:false`. This verifies stored qualification declarations, not global
historical nonexecution.

GitHub records three successful runs at the exact starting SHA:

- [41843546340](https://github.com/fanilosendrison/proto-ring/actions/runs/41843546340),
  candidate push.
- [41843555131](https://github.com/fanilosendrison/proto-ring/actions/runs/41843555131),
  pull-request event.
- [41875856412][CI], main push.

The main run’s Rust, Windows Rust/RepositoryState, Python 3.11 and Python 3.12
jobs were observed successful. The [exact-SHA workflow][workflow] identifies
existing Rust and neutral-Python gates. Provider conclusions do not
independently establish every package-local validation claim or runtime
security guarantee.

Public summaries report earlier NO_GO reviews and a later exact-source GO. The
acceptance comment states that the underlying review receipt and manifest
remain privately retained, identifying manifest digest
`15b27044d44bba225491a2ca7852d8e9fe96248d8175a0eafba9476d31211c97`.

The study verifies that this decision was publicly recorded and associated with
the artifact. It does not verify the underlying review transcript, citation
validity or substantive GO.

PR #139 has zero native reviews, discussion comments and review comments. Its
description explicitly distinguishes headless review from native GitHub
approval.

## Decisions, corrections and continuation

The PR history contains this linear chain:

`d2f3cb4ff70d6a6281ac836e8252f6ade0191d70` →
`829cdb6b9653c2f62931890c85a0de743236a063` →
`93622fa4d4b8725f58f04bdce733f4e842653211` →
`3e9a6bf5f1eb217ae42401f5b34b64810a07d127` →
`a1b27ca1e21423973a5557415488e4fcd535d01a`.

[Commit `93622fa4d4b8725f58f04bdce733f4e842653211`][bytecode] added a tracked
bytecode file despite its cleanup-oriented subject. [CI run
41736386233][failedCI] reports failure at that SHA. The PR attributes failure
to tracked-cache cleanliness; logs establishing that detailed cause were not
independently examined. The [next commit][cleanup] removes only that bytecode
file.

The [editorial child][editorial] directly follows the reviewed artifact and
changes four documentation/manifest files. It synchronizes accepted-status
wording without transferring the earlier review to a new source identity.

Continuation records include:

- [Issue #135 completion report][completion].
- [Issue #136 handoff][handoff], describing integration points and outstanding
  execution/output services.
- [PR #141][PR141], merged at head/merge SHA
  `46ec80d6c3b5af962f3b376912afbf6683509abb`, with base equal to the editorial
  child.
- [Issue #137][I137], retaining integrated qualification responsibilities.

Continuation report contents and PR identity are recoverable. Their
implementation and substantive validation claims were not independently audited
here.

## Empirical extraction from observed engineering practice

### Observed practices

- **Repeated exact identities supported cross-checking.** [PR #139][PR139],
  [acceptance][acceptance] and [editorial documentation][editorial] repeat
  source/tree boundaries that agree with provider objects. This case
  demonstrates usable redundancy, not a measured causal improvement.
- **Acceptance boundaries were explicitly published.** The [acceptance
  comment][acceptance] separates contract acceptance from production
  implementation, host qualification and runtime scenario execution.
- **Corrective history remained visible.** The [bytecode addition][bytecode],
  [failed CI][failedCI] and [removal][cleanup] preserve a negative outcome and
  correction.
- **Continuation used a distinct handoff.** The [API-03 handoff][handoff] names
  downstream integration points and remaining responsibilities. Its content
  remains participant reporting.
- **Native relationships and prose served different purposes.** The work
  association is explicit in [PR prose][PR139] and [acceptance][acceptance],
  while parent/dependency scheduling is exposed through [Issue #134][I134] and
  [parent #28][I28]. Native PR closure linkage is absent.

### Friction and counterevidence

Evidence was distributed across Git objects, long edited bodies, comments, CI
objects, documentation, a Project item and continuation records. Three
oversized retrievals required narrower projections.

Candidate wording remains in the immutable reviewed package, while later
editable records describe acceptance. The [editorial child][editorial] makes
this temporal distinction recoverable, but reading one snapshot alone can
mislead.

Public summaries permit recovery of decision scope while withholding the
underlying raw review. This is useful documentary recovery but a counterexample
to assuming public auditability of review truth.

The commit-subject/diff mismatch demonstrates that intent-like message text
cannot replace inspection of actual changes.

Repeated publication and correction are observed. The amount of unnecessary
human effort is **NOT_MEASURED**; no manual-intervention count or
counterfactual necessity is inferred.

### Interpretations and non-normative hypotheses

- Repeating exact source identities across decision boundaries may help later
  cross-checking; this case does not establish comparative effectiveness.
- Distinguishing immutable source status from later acceptance decisions may
  reduce temporal confusion; that remains an untested hypothesis.
- Native scheduling links, prose associations and standalone handoffs are
  alternative observed arrangements, not interchangeable truth guarantees.
- A centralized receipt is not shown necessary: this case recovered substantial
  history from distributed records, while still failing to recover original
  archive bytes and raw reviews.

These are Proto-Lithify research interpretations and candidate hypotheses, not
accepted requirements, capabilities or architecture selections.

## GitHub Project observations

At the investigation observation window, [Issue #134][I134] had public [Project
\#8, “Proto-Ring Engineering”][project] item `PVTI_lAHOAdFdvs4BkTxizhFdk0s`
with:

- Status: Done.
- Kind: Agent Task.
- Priority: P0.

Native relationships established parent #28 and prerequisite sequence #134 →
\#135 → #136 → #137. Issues #134/#135 were closed; #28/#136/#137 remained open.

PR #139 had no Project item and zero native closing-Issue references. Issue
\#134 closed at `2026-11-04T18:03:28Z`, after PR merging. Automatic PR-driven
closure was not established.

These are observed current fields and relationships, not proof of execution,
completion truth or earlier Project values. Broader Project history was not
examined.

## Ambiguities and inaccessible sources

Five unresolved evidentiary categories remain:

1. **Instructions:** exact historical wording, delivery and agent receipt.
2. **Original archive:** bytes, digest comparison and actual delivery.
3. **Review evidence:** underlying private receipt, manifest contents and
   separately described citation-audit note.
4. **Historical execution/publication:** truth of local validation,
   prepublication comparison and guarded-ref-operation reports.
5. **Completeness:** whether recovered records comprise all historically
   relevant information.

The private review is explicitly identified as nonpublic in
[acceptance][acceptance]. No private access was attempted; no HTTP failure is
fabricated. The original archive lacks a located retrieval URL rather than an
observed access-denied response.

No competing artifact or PR identity remained after checking. The uncertainty
count does not imply five `AMBIGUOUS` dimension statuses.

The frozen repository, artifact and expected PR were publicly accessible. No
case-existence/access failure requiring campaign STOP occurred.

## Reconstruction cost measurements

Measurements below concern the investigator, not evaluator effort. Runtime
usage values are controller-supplied measurement supplements, not
investigator-recovered subject evidence.

QUANTITY | VALUE | MEASUREMENT_PROVENANCE
-------- | ----- | ----------------------
GitHub API request count | [^cost-1] | Same note
Search and retrieval steps | [^cost-2] | Same note
Total elapsed time | [^cost-3] | Same note
Tool invocations | [^cost-4] | Same note
Model input tokens | [^cost-5] | Same note
Model output tokens | [^cost-6] | Same note
Monetary inference cost | [^cost-7] | Same note
Manual intervention count | [^cost-8] | Same note

[^cost-1]:
    **Value:** 34 logical invocations: 30 REST GET, 4 GraphQL; HTTP transport
    attempts NOT_MEASURED **Measurement provenance:** Complete tool trace,
    independently counted; one invocation per API-bearing bash command

[^cost-2]:
    **Value:** 34 ordered API retrieval steps; four separate clock calls;
    maximum discovery depth 3 **Measurement provenance:** Command sequence and
    returned relationship records

[^cost-3]:
    **Value:** 545.948 seconds substantive; 553.376 seconds whole session; 347
    seconds recorded retrieval window **Measurement provenance:** Runtime usage
    capture and investigator clock observations; whole-session initialization
    overhead 7.428 seconds

[^cost-4]:
    **Value:** 38 bash calls: 34 API-bearing and four date-only **Measurement
    provenance:** 38 paired trace starts/ends; no recorded tool errors

[^cost-5]:
    **Value:** Provider input 98,812; cache-read 2,456,064; cache-write 0
    **Measurement provenance:** Whole-session usage capture, including
    initialization; no initialization-only token allocation exposed

[^cost-6]:
    **Value:** 15,920; reported all-category total 2,570,796 **Measurement
    provenance:** Whole-session usage capture, including initialization

[^cost-7]:
    **Value:** NOT_MEASURED **Measurement provenance:** No verified
    subscription-charge attribution; catalog estimates are not actual charges

[^cost-8]:
    **Value:** NOT_MEASURED **Measurement provenance:** No reliable count
    supplied

The raw report correctly limited its 347-second elapsed value to retrieval, not
final report preparation. Its token values were `NOT_MEASURED`; the measured
values above are evaluator-added usage supplements. No inference-efficiency
comparison is made.

## Recovery coverage

**RECOVERY_COVERAGE:** All ten dimensions were examined.

Nine dimensions support narrowly scoped `VERIFIED` claims about identities,
published content or relationships. D05 retains `REFERENCED_NOT_VERIFIED` for
the original source archive, despite separately retrievable public derivatives
and contextual documentation.

Instruction receipt, archive provenance, underlying private review and raw
local validation remain unrecovered. These negatives are not erased by
successful recovery of associated public records.

The dimension count is descriptive coverage within this case, not a universal
reliability percentage.

## Unknown historical completeness

**HISTORICAL_COMPLETENESS: NOT ESTABLISHED.**

Public records and examined immutable snapshots do not establish everything
originally available to participants. Current Issue/PR bodies cannot prove
historical prompt delivery; private review custody and the unrecovered archive
leave substantive gaps.

No missing prompt, record or output is inferred never to have existed.

## Negative findings and counterexamples

Within examined bodies, comments, review projections, timelines and selected
versioned files:

- No historical executing-agent prompt or delivery receipt was located.
- No public location for original candidate ZIP bytes was located.
- No complete execution transcript or raw local validation output was
  recovered.
- No explicitly labeled API-01 STOP/PARTIAL execution report was located.
- PR #139 had zero native reviews and closing-Issue references.
- All 87 stored semantic scenarios were marked unqualified.
- A cleanup-oriented commit added bytecode before a later correction.
- Merged PR/closed Issue status did not imply production implementation or
  runtime qualification.
- Published GO reporting did not imply an accessible raw review or native
  approval.

These findings preserve their examined boundary. They do not establish global
absence, technical incompatibility or substantive falsity of participant
reports.

## Evidence provenance

Frozen investigator content SHA-256:

`88a9b786d1f4027019926d0ff35d9d9249f346d380c11ee9240419b1d84e5e51`

Frozen tool-trace SHA-256:

`a670cf101bdfcb7eaf19b1237cb5e42f6ffdc69c74583890ccae27893cbf66d5`

Both were independently recalculated and matched controller metadata. The
frozen materials were inspected for evaluation; they are not represented as
publicly accessible transcripts. Public claims are separately supported by the
GitHub references below.

The evaluator read the supplied protocol, template, complete captured tool
trace, report, controller trace audit, effective pre/post runtime metadata and
usage capture. Raw session JSONL, private reasoning, credentials and private
review material were not read.

Independent public reads corroborated artifact/PR/work identity,
instructions/context records, exact-SHA CI, corrective/editorial history,
continuation records and Project/native associations. The expected PR oracle
was not credited as investigator discovery.

[protocol]:
  https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/protocol-v1.md
[S]:
  https://github.com/fanilosendrison/proto-ring/commit/a1b27ca1e21423973a5557415488e4fcd535d01a
[PR139]: https://github.com/fanilosendrison/proto-ring/pull/139
[I134]: https://github.com/fanilosendrison/proto-ring/issues/134
[acceptance]:
  https://github.com/fanilosendrison/proto-ring/issues/134#issuecomment-6637682924
[readme]:
  https://github.com/fanilosendrison/proto-ring/blob/a1b27ca1e21423973a5557415488e4fcd535d01a/docs/api/v1/README.md
[spec]:
  https://github.com/fanilosendrison/proto-ring/blob/a1b27ca1e21423973a5557415488e4fcd535d01a/docs/api/v1/proto-ring-api-01-v1-spec.md
[context]:
  https://github.com/fanilosendrison/proto-ring/blob/1eb84e1b4474b155d2271d1decb66d0cd86a555f/docs/contracts/repository-governance-state.md
[semantic]:
  https://github.com/fanilosendrison/proto-ring/blob/a1b27ca1e21423973a5557415488e4fcd535d01a/docs/api/v1/conformance/semantic-cases.json
[CI]: https://github.com/fanilosendrison/proto-ring/actions/runs/41875856412
[workflow]:
  https://github.com/fanilosendrison/proto-ring/blob/a1b27ca1e21423973a5557415488e4fcd535d01a/.github/workflows/ci.yml
[editorial]:
  https://github.com/fanilosendrison/proto-ring/commit/e639d8d5a364b81619a62d73037d9ac19a171a48
[bytecode]:
  https://github.com/fanilosendrison/proto-ring/commit/93622fa4d4b8725f58f04bdce733f4e842653211
[cleanup]:
  https://github.com/fanilosendrison/proto-ring/commit/3e9a6bf5f1eb217ae42401f5b34b64810a07d127
[failedCI]:
  https://github.com/fanilosendrison/proto-ring/actions/runs/41736386233
[I28]: https://github.com/fanilosendrison/proto-ring/issues/28
[I137]: https://github.com/fanilosendrison/proto-ring/issues/137
[completion]:
  https://github.com/fanilosendrison/proto-ring/issues/135#issuecomment-6645413866
[handoff]:
  https://github.com/fanilosendrison/proto-ring/issues/136#issuecomment-6645401322
[PR141]: https://github.com/fanilosendrison/proto-ring/pull/141
[project]: https://github.com/users/fanilosendrison/projects/8

## Independent evaluation

**Disposition: PARTIAL. Structural validation: FAIL. Evidence validation: PASS
for the scoped claims. Starting-artifact verification: PASS.**

The frozen report has exact repository/SHA recovery and ten accepted dimension
rows, but omits required study/revision/case metadata, the full template
section structure, complete per-row evidence fields and some context/cost
declarations. This evaluator-authored draft does not retroactively change that
result.

Original → final statuses and reasons:

- D01 EXACT_ARTIFACT_IDENTITY: `VERIFIED → VERIFIED`; exact commit/tree/parent
  checked.
- D02 ARTIFACT_TO_PR: `VERIFIED → VERIFIED`; sole associated PR and merge
  identity checked.
- D03 ARTIFACT_TO_WORK: `VERIFIED → VERIFIED`; explicit PR/Issue/exact-source
  acceptance association.
- D04 WORK_TO_INSTRUCTION: `VERIFIED → VERIFIED`; published records only, with
  receipt explicitly unproved.
- D05 WORK_TO_CONTEXTUAL_SOURCES:
  `REFERENCED_NOT_VERIFIED → REFERENCED_NOT_VERIFIED`; original archive not
  substituted with public derivatives.
- D06 WORK_TO_EXECUTION_REPORT: `VERIFIED → VERIFIED`; report
  existence/association and provider CI results, not independent local-test
  truth.
- D07 WORK_TO_DECISIONS_AND_REVIEWS: `VERIFIED → VERIFIED`; public decision and
  summaries, not the private review’s substantive correctness.
- D08 WORK_TO_CHANGE_HISTORY: `VERIFIED → VERIFIED`; provider history and
  corrective/editorial diffs.
- D09 WORK_TO_CONTINUATION_INFORMATION: `VERIFIED → VERIFIED`; handoff content
  and continuation identities, not implementation qualification.
- D10 PROJECT_AND_NATIVE_RELATIONSHIPS: `VERIFIED → VERIFIED`; observed current
  metadata and native associations.

Unsupported `VERIFIED` claims: **0**. Classification corrections: **0**. Five
unresolved evidentiary categories remain as listed above.

**EVALUATOR_ONLY_DISCOVERY: 0 substantive case findings.** Rechecks
corroborated investigator recovery. Controller-provided identifiers and
runtime/cost measurements are explicit supplements, not recovered
engineering-history evidence. Candidate hypotheses are evaluator
interpretations of already encountered evidence.

The trace supports 34 logical API invocations and 38 tool calls, with no
observed request/hop breach. Transport attempts were not separately measured.
Successful tools alone did not determine qualification.

## Bounded conclusion

The evidence supports recovery of an exact artifact → PR #139 → API-01
contract-design association, published instruction records, reporting and
decision boundaries, corrective history, native scheduling relationships and
continuation handoffs.

It does not establish historical prompt receipt, original archive provenance,
private review truth, all reported local executions or historical completeness.
The frozen output remains **PARTIAL** because of reporting-structure
deficiencies, despite admissible substantive classifications.

Repeated exact identities, explicit acceptance limits, preserved failures and
distinct handoffs merit retention as empirical observations. Their usefulness
remains relevant even without Lithify adoption. Proposed explanatory mechanisms
remain non-normative hypotheses.

Proto-Lithify owns empirical extraction; Lithify owns independent derivation
and adoption. No requirement, architecture, new CLI capability, Product Intent
amendment, causal inference or universal reliability follows. This single case
is diagnostic, not representative, and does not replace a separately bounded
six-case synthesis.
