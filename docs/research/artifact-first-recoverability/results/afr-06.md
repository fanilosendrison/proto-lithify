---
okf_version: "1.0"
kind: KnowledgeAsset
asset_type: research-case-assessment
domain: proto-lithify
severity: guideline
name: "AFR-06 empirical case assessment"
version: "0.1.0"
---

# AFR-06 — Artifact-first recoverability assessment

## Case metadata

```text
STUDY_ID=PL-R-AFR-20261104
PROTOCOL_REVISION=91727041cddcedcdd83903617d4061de78473a8c
CASE_ID=AFR-06
REPOSITORY=fanilosendrison/proto-lithify
STARTING_ARTIFACT_SHA=025bc880281d42f67aaf4b5ae0b410e0e8056e6e
OBSERVATION_TIME=2026-11-05T12:42:34Z
OBSERVATION_WINDOW=2026-11-05T12:42:34Z/2026-11-05T12:46:40Z
AUTHORIZED_SURFACES=Public Git commits/history; PR metadata/comments/reviews;
  Issue bodies/comments/native relationships; public Projects; versioned
  documentation; explicitly linked public evidence, including GitHub Actions
  metadata
INVESTIGATOR_CONTEXT=Fresh session; generic research instructions plus
  repository and exact merge SHA were the only initial case-specific inputs;
  initialization contained no subject; no initial PR, Issue, controller label
  or report hint was supplied
INVESTIGATOR_MODE=NON_BLIND_EXPLORATORY
EVALUATION_DISPOSITION=PARTIAL
```

The governing [protocol][A01] and [report template][A02] are identified at the
integrated protocol revision above.

The investigator session was `01a1abbb-6357-7534-a355-03a59b0f531a`, using
`openai-codex-1 / gpt-6.1-sol / xhigh`, with bash as its exposed tool.
Effective pre/post metadata reported disabled context files, skills, prompt
templates and discovered extensions. Technical confinement against controller
material was not established; no blind-experiment claim is made. Effective
runtime metadata is not treated as a case-selection hint.

The independent evaluator session was `01a1abc3-3272-7bd2-b2dc-f4d7c575e070`,
using the same reported provider/model/thinking setting, with read and bash.
Public verification occurred after the supplied evaluator-session observation
at `2026-11-05T12:51:04.054032Z` and before the final verification clock at
`2026-11-05T12:53:29Z`. Individual API-request timestamps were not measured.

This is an evaluator-authored publication draft derived from a frozen
investigator report. Its complete presentation does not imply that the frozen
report passed structural validation.

## Dimension assessment

`VERIFIED` below establishes only the particular record identity, content or
association stated. It does not establish all statements within a record as
true.

DIMENSION | CLASSIFICATION | OBSERVED_IDENTITY | EVIDENCE_URL | OBSERVATION | LIMITATION
--------- | -------------- | ----------------- | ------------ | ----------- | ----------
D01 EXACT_ARTIFACT_IDENTITY | VERIFIED | Proto-Lithify commit `025bc880281d42f67aaf4b5ae0b410e0e8056e6e`; tree `6d74d0157babaf8d2493dece7faf1866ecb98792` | [Exact commit][S01] | GitHub returned the exact SHA, two parents, tree, message and three changed paths; independently rechecked. | Provider-returned Git identity and signature status were not independently cryptographically recomputed.
D02 ARTIFACT_TO_PR | VERIFIED | Proto-Lithify PR #37, database ID `5159742863` | [Commit association][S02]; [PR #37][S03] | The association endpoint returned #37; its merge SHA equals the starting artifact, and its base/head match the artifact parents. | Establishes this PR association, not original instructions or complete mission history.
D03 ARTIFACT_TO_WORK | VERIFIED | Task marker `lithify-proto-lithify-methodological-separation-20261104` | [PR #37][S03]; [companion #2][S05]; [handoff][S07] | Matching task markers, reciprocal companion links and the matching handoff identify a public cross-repository work association. | No dedicated originating assignment Issue or complete original intent was established.
D04 WORK_TO_INSTRUCTION | REFERENCED_NOT_VERIFIED | Referenced supplied mandate; public scope summary; baseline `AGENTS.md` | [PR scope][S03]; [review record][S06]; [baseline directives][S11] | Public records reference prescribed task text and a revision-bound review packet; repository directives are readable. | The original instruction packet and actual receipt by the historical executor were not independently established.
D05 WORK_TO_CONTEXTUAL_SOURCES | VERIFIED | Exact-revision CLI contract, architecture, installation, governance profile and Lithify specification excerpts | [Charter][S10]; [CLI][S12]; [architecture][S13]; [installation][S14]; [governance][S15]; [specification][S16] | Work records and charter references associate these publicly retrievable contextual documents with the work; exact-revision contents were recovered. | Publication and association do not establish historical supply, reading or availability to a particular executor.
D06 WORK_TO_EXECUTION_REPORT | VERIFIED | PR execution narratives; handoff; Actions runs `41890624845` and `41901508348` | [PR report][S03]; [handoff][S07]; [PR CI][S17]; [jobs][S18]; [main CI][S19] | Associated execution narratives exist; GitHub independently reports successful run and job conclusions for identified subjects. | Local results, failure causes, test counts, publication receipts and actual synthetic checkout remain report-based where logs were not retrieved.
D07 WORK_TO_DECISIONS_AND_REVIEWS | VERIFIED | Canonical comment `6640557544`; specification §1.1 at companion candidate | [Review record][S06]; [versioned decision][S16] | The comment reproduces two documentary review reports bound to candidate SHA/tree pairs; the specification contains the methodological decision. | Does not authenticate historical review sessions, independently verify the packet digest or prove every review conclusion.
D08 WORK_TO_CHANGE_HISTORY | VERIFIED | Two PR development commits, exact merge and companion candidate/merge trees | [PR commits][S04]; [artifact][S01]; [companion merge][S20]; [companion candidate][S21] | Git ancestry, merge parents and matching candidate/merge trees were recovered and independently corroborated. | Not a complete historical workflow reconstruction; per-commit path descriptions in the report rely on commit messages rather than retrieved individual diffs.
D09 WORK_TO_CONTINUATION_INFORMATION | VERIFIED | Handoff `6640684840`; Lithify Issues #1 and #3 | [Handoff][S07]; [downstream #1][S08]; [derivation #3][S09] | Public handoff and future-work records identify continuation scope and entry conditions. | Existence, open state and dependency links do not establish readiness, completed derivation or an accepted obligation baseline.
D10 PROJECT_AND_NATIVE_RELATIONSHIPS | VERIFIED | Public Project #9; Proto Issues #28/#34; Lithify #1/#3; PR #37 projections | [Project #9][S24]; [#28][S22]; [#34][S23]; [Lithify #1][S08]; [Lithify #3][S09]; [PR #37][S03] | Direct API projections establish observed memberships, selected fields, hierarchy and dependency directions; #37 returned zero closing-Issue references. | Observation-time projections only; no complete Project inventory, archive-inclusive membership audit or originating-Issue nonexistence claim is made.

## Exact discovery sequence

The investigator was directed to conduct public-source, read-only
artifact-first recovery without source execution, mutation or private-session
access. Limits were 100 logical API requests and three relationship-discovery
hops: artifact 0, associated PR 1, work 2, directly linked context or
continuation 3. Each bash API call had to contain one explicit REST GET or pure
GraphQL query, without automatic pagination.

The complete trace establishes this sequence:

1. **E01, hop 0:** Read the exact commit, metadata, parents, tree and returned
   patches.[S01]
2. **E02, hop 1:** Read the exact commit’s associated-PR endpoint, returning
   #37.[S02]
3. **E03, hop 1:** Read PR #37, including its task marker, scope, candidate
   identities and references.[S03]
4. **E04, hop 1 containment:** Read its two-commit history.[S04]
5. **E05, hop 1 containment:** Query #37’s closing-Issue references, reviews,
   comments, Project items and timeline. The timeline exposed companion Lithify
   #2 and downstream Lithify #1.
6. **E06, hop 2:** Read companion Lithify PR #2.[S05]
7. **E07, hop 2 containment:** Read its comments, recovering canonical review
   comment `6640557544`.[S06]
8. **E08, hop 2:** Read Lithify Issue #1.[S08]
9. **E09, hop 2:** Read Proto-Lithify Issue #28, directly referenced by
   #37.[S22]
10. **E10, hop 2:** Read Proto-Lithify Issue #34, directly referenced by
    #37.[S23]
11. **E11, hop 2 containment:** Read Lithify #1 comments, recovering the
    integration handoff and its direct continuation link to Lithify #3.[S07]
12. **E12, hop 2 containment:** Read Proto #34 comments. Later study references
    were observed but not followed.
13. **E13, hops 2–3 containment:** Query the already identified work objects’
    native relationships and Project membership projections.
14. **E14, hop 3:** Read Lithify Issue #3.[S09]
15. **E15, directly linked PR evidence:** Read Actions run `41890624845`.[S17]
16. **E16, run containment:** Read that run’s jobs and step conclusions.[S18]
17. **E17, directly linked source context:** Retrieve baseline `AGENTS.md`,
    exact-artifact CLI contract and governance profile.[S11][S12][S15]
18. **E18, hop 3 context:** Retrieve selected specification sections and
    companion candidate/merge Git objects.[S16][S20][S21]
19. **E19, exact-artifact containment:** Read push runs filtered to the
    starting SHA, recovering main run `41901508348`.[S19]
20. **E20, containment:** Query Lithify #3 comments/native relationships and
    the synthetic commit named in the PR report.[S09][S25]
21. **E21, directly linked source context:** Retrieve exact-artifact
    architecture and installation documents.[S13][S14]

Two date-only calls bracketed the retrieval window.

The trace shows one `gh api` invocation per API-bearing bash call, 15 explicit
REST GETs and six query-only GraphQL operations. No automatic pagination,
mutation, source execution, observed error or fourth-hop traversal occurred.
Comments, reviews and native projections were treated as containment; their
links did not authorize unrestricted downstream traversal.

REST collections were read on explicitly requested first pages. Relevant
GraphQL relationship connections returned `hasNextPage: false`; selected
Project field values were observed rather than treated as a complete Project
catalog.

Unexamined surfaces included CI logs, raw local validation outputs, the
original instruction packet, the raw review packet, shared operational-protocol
content, a complete Project inventory and unrelated repository history.
References to Proto-Lithify #38/#39 were not opened as case-recovery objects.

## Artifact and PR identity verification

The starting commit is:

`025bc880281d42f67aaf4b5ae0b410e0e8056e6e`

Its parents are:

- First: `54392f679c3d27318f5acfa93fb0e259fb723240`
- Second: `ce4cd1b46f436576e07fa6ea56baae586ee2cc87`

Its tree is `6d74d0157babaf8d2493dece7faf1866ecb98792`. GitHub records
author/committer time `2026-11-04T19:54:43Z` and reports a valid verified
signature. These are provider observations, not an independent signature
computation.[S01]

The returned change contains:

- `AGENTS.md`: 19 additions.
- `README.md`: 17 additions and four deletions.
- `docs/research/empirical-role-and-evidence.md`: 156 additions.

Proto-Lithify PR #37 is titled **“docs: define empirical role and Lithify
evidence boundary.”** Its merge SHA equals the starting artifact; its base and
head equal the two artifact parents. GitHub records merge time
`2026-11-04T19:54:44Z`.[S02][S03]

The investigator recovered #37 through the exact commit-association endpoint.
Independent evaluation corroborated that recovery; the evaluation oracle was
not its discovery source.

## Work and mission recovery

PR #37 and companion Lithify PR #2 contain the task marker:

`lithify-proto-lithify-methodological-separation-20261104`

The downstream handoff uses the matching handoff marker and names both merged
PRs and integrated SHAs.[S03][S05][S07]

The published mission description concerns documenting the empirical research
role and separating Proto-Lithify evidence from Lithify derivation/adoption
authority. This is recovered record content, not an inference about unpublished
intent from the resulting diff.

Lithify PR #2, **“docs: establish independent derivation and prototype evidence
boundary,”** is the companion—not a second PR association for the starting
commit. Its candidate is `a5234578730aa774c28d5ce6447f57643e10bcdb`; its merge
is `131f0a28d7c479128004326d03e87dd48cb6411c`. Both have tree
`0bcfda4f8693553905b2484c30b705ca55499c81`.[S05][S20][S21]

Its history includes the previously published extension at
`ef3d5e959d3e3dd85b896459f6705d2c53bc334f`. The entire companion diff cannot be
attributed to this mission.

No dedicated originating Issue was established. Proto #28 and #34 are
qualification context; Lithify #1 is downstream confrontation work. Zero native
closing-Issue references on #37 do not prove that an originating assignment
never existed.

## Instructions and sources

Three distinctions remain necessary:

- **Published instruction-like content:** PR #37 records scope and a three-path
  allowlist. Baseline `AGENTS.md` contains contributor directives and
  validation/publication instructions.[S03][S11]
- **Referenced historical instructions:** The PR and reviews refer to supplied
  prescribed text and a revision-bound packet.[S03][S06]
- **Actual historical receipt:** Neither record existence nor those references
  independently establish what the historical executor actually received or
  read.

The canonical review comment identifies packet SHA-256:

`894d27e4f7257f0c62858f300658fb699334e72a5e2c336b6fb6aec5584dfd9e`

The investigator recovered the reference and supply claim, not the packet
itself. Its digest was not recomputed. D04 therefore remains
`REFERENCED_NOT_VERIFIED`.[S06]

Recovered contextual documents include:

- Baseline contributor directives at
  `54392f679c3d27318f5acfa93fb0e259fb723240`.[S11]
- CLI contract, architecture, installation and governance profile at the exact
  starting artifact.[S12][S13][S14][S15]
- Selected Lithify specification sections at companion candidate
  `a5234578730aa774c28d5ce6447f57643e10bcdb`.[S16]
- The associated public work records.[S08][S09][S22][S23]

D05 verifies these published contents and work associations only. Their
historical supply to an executor remains unverified. The final charter is an
output artifact, not proof of an earlier prompt.

## Execution reports and review evidence

PR #37 reports successful installation, lint, typecheck, tests, build,
standalone qualification and diff checks, including 172/172 tests and 1/1
standalone test. It also preserves a narrative of initial lint failure and six
initial test failures, attributed to generated-report formatting and task-local
ESM scope, followed by environment/artifact corrections and rerunning unchanged
validation.[S03]

These are actor-reported execution facts. Raw local outputs, failure diagnoses
and publisher receipts were not independently recovered.

GitHub independently reports:

- Run `41890624845`: successful `pull_request` run associated with head
  `ce4cd1b46f436576e07fa6ea56baae586ee2cc87`.[S17]
- Its single job `126786737199`, named `proto-lithify / validate`: successful,
  with successful listed validation steps.[S18]
- Run `41901508348`: successful `push` run on `main`, with the exact starting
  artifact SHA and matching tree.[S19]

The PR CI run’s `pull_requests` array was empty. Its event, exact head SHA and
explicit PR-body link still support the run association. Test counts and
checkout details were not inferred from job conclusions.

Synthetic commit `c93226c563768790aa755e86025262de116eef9b` has the reported
parents and matching tree. Its existence does not independently establish that
it was the checkout actually executed; that statement remains report-based
without the checkout log.[S25]

Canonical comment `6640557544` reproduces two documentary review reports, both
recording GO and zero findings for the exact candidate pair. Their existence,
content and candidate associations are recoverable.[S06]

The comment expressly limits those reviews: the same selected provider/model
was used; the reviews are not separate-human approvals, model diversity, CI
success or live qualification. Historical session authenticity, packet receipt
and all substantive findings were not independently established.

## Decisions, corrections and continuation

The candidate specification contains **§1.1 Recorded methodological decision —
2026-11-04**. Publication of that decision text is verified; the underlying
authorization exchange was not inspected.[S16]

The PR and review comment report that an earlier unavailable-review-route
disposition was superseded. No separate original STOP/PARTIAL report was
recovered; its absence is scoped to the examined surfaces.[S03][S05][S06]

The integration handoff identifies:

- Lithify merge `131f0a28d7c479128004326d03e87dd48cb6411c`.
- Proto-Lithify merge `025bc880281d42f67aaf4b5ae0b410e0e8056e6e`.
- Future derivation work in Lithify #3.
- Separate derivation and empirical-evidence entry conditions for Lithify
  #1.[S07]

Merge identities, trees and Proto-Lithify main-CI success were independently
corroborated. The handoff’s broader historical assertions were not
automatically promoted.

Lithify #3 remains an observed open future-work record. Its body explicitly
says creation does not establish readiness or constitute a complete execution
brief.[S09] No completed derivation baseline or final realization decision was
established.

PR bodies retain earlier draft/unintegrated snapshots while provider metadata
shows both PRs merged. The later handoff and merge timestamps resolve the
chronology; this is not an unresolved artifact-identity ambiguity.

## Empirical extraction from observed engineering practice

### Direct observations

- **Cross-repository task markers and reciprocal links supported association
  recovery.** The same task marker appears in both PRs, with a matching handoff
  marker on Lithify #1.[S03][S05][S07] This worked without establishing an
  originating Issue or private assignment history.
- **Exact revisions supported content comparisons.** Candidate and merge trees
  could be compared across both repositories.[S01][S20][S21] This supports
  identity checking, not truth of all accompanying reports.
- **Review reports existed outside native review objects.** PR #37 returned
  zero native reviews, while a companion-PR comment reproduced two substantial
  reports.[S03][S06] Native-review absence was therefore not review-record
  absence.
- **Publication snapshots and later operational state occupied different
  records.** Stale draft/unintegrated prose coexisted with merged metadata and
  a later handoff.[S03][S05][S07] Chronology required reconciliation rather
  than treating every sentence as current state.
- **Failures and corrections were retained narratively.** The PR preserves
  initial validation failures and subsequent correction claims.[S03] Their
  causes and successful reruns were not independently reproduced.
- **Continuation information combined prose and native relationships.** Issue
  bodies state acceptance boundaries, while dependency projections identify
  live prerequisite directions.[S08][S09][S23]

### Friction and limits

Recovery crossed two repositories and multiple object types. Scope, validation
and review summaries recur across the PR bodies, review comment and
handoff.[S03][S05][S06][S07]

This demonstrates repeated information placement, not a measured amount of
unnecessary manual work. Manual intervention count and participant time spent
maintaining those summaries are `NOT_MEASURED`.

The original instruction packet, raw review input and local execution outputs
were not recovered. Substantial public documentation did not remove these
evidence gaps.

### Interpretations and non-normative hypotheses

The observed arrangements suggest hypotheses that exact revision bindings and
stable cross-record identifiers may reduce later association ambiguity. This
case does not establish a causal benefit or comparative efficiency.

The canonical comment illustrates an alternative to native review objects;
matching task markers illustrate an alternative to closing-Issue linkage.
Neither representation is selected as necessary or universally preferable.

A useful future research question is whether distinguishing historical
snapshots from current-state records reduces reconciliation effort. No
implementation, schema, architecture or product requirement follows from that
question.

These are empirical observations and bounded hypotheses in Proto-Lithify’s
research remit. Lithify retains independent derivation and adoption authority.

## GitHub Project observations

Direct native projections recovered the following observation-time state:

- Lithify #1 was blocked by Lithify #3 and Proto-Lithify #34.
- Converse blocking projections from #3 and #34 pointed to Lithify #1.
- Proto #34 had parent #28 and was blocked by #33.
- Proto #28 exposed six native sub-Issues, #29 through #34.
- Proto #28 and #34 each had one observed membership in public **Proto-Lithify
  Engineering Project #9**, with `Status=Backlog`, `Kind=Follow-up`,
  `Priority=P1`.
- PR #37, companion PR #2, Lithify #1 and Lithify #3 returned zero Project
  items in the examined projections.[S03][S05][S08][S09][S22][S23][S24]

These were direct API observations, independently rechecked during evaluation.
They do not establish a historical Project snapshot, an archive-inclusive
membership inventory, readiness or completion.

## Ambiguities and inaccessible sources

No unresolved competing identity remained for the starting artifact or its PR.

The following remained unverified or unobtained within scope:

- Exact original instruction packet and historical receipt.
- Raw review packet and authenticated historical review execution.
- Raw local validation failures, complete outputs and publisher receipts.
- Actual CI synthetic checkout without its log.
- A dedicated originating assignment Issue.
- Completed derivation and final downstream realization decisions.

These are evidence gaps, not necessarily protocol-status `AMBIGUOUS` findings.
No contradictory candidate identity required that classification.

All observed investigator API calls succeeded. No identified public case object
returned an access denial or existence failure, so no `INACCESSIBLE` dimension
or campaign STOP escalation was warranted. Unobtained material was not assumed
private or globally nonexistent.

## Reconstruction cost measurements

The following quantities describe the investigator run. Evaluator verification
is excluded.

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
    **Value:** 21 logical `gh api` invocations: 15 REST GET, 6 GraphQL queries;
    HTTP transport attempts NOT_MEASURED **Measurement provenance:** Complete
    frozen tool trace, independently counted; agrees with controller audit

[^cost-2]:
    **Value:** 21 ordered API retrieval steps, E01–E21; maximum
    relationship-discovery depth 3 **Measurement provenance:** Complete
    command/result trace and discovery sequence

[^cost-3]:
    **Value:** 483.195 seconds substantive request-to-completion; 490.280
    seconds whole session; 246 seconds clock-bracketed retrieval window
    **Measurement provenance:** Runtime usage capture for first two values;
    trace date outputs for retrieval window; 7.085 seconds additional
    initialization/session overhead is not retrieval time

[^cost-4]:
    **Value:** 23 bash calls, including two date-only calls **Measurement
    provenance:** 23 matched tool-start/tool-end pairs in complete trace

[^cost-5]:
    **Value:** Capture reports input 92,326; cache-read 531,072; cache-write 0;
    input plus cache-read 623,398 **Measurement provenance:** Whole-session
    runtime usage capture, including initialization; no substantive-only token
    split exposed

[^cost-6]:
    **Value:** 14,205 **Measurement provenance:** Whole-session runtime usage
    capture, including initialization

[^cost-7]:
    **Value:** NOT_MEASURED **Measurement provenance:** No verified
    subscription-charge attribution; catalog/SDK estimates are not actual
    charges

[^cost-8]:
    **Value:** NOT_MEASURED **Measurement provenance:** No reliable
    intervention-count measurement supplied

The token capture reports total usage of 637,603 tokens. Its categories and
whole-session scope are preserved rather than presented as a controlled
efficiency result.

The investigator’s original report marked tokens and monetary cost
`NOT_MEASURED`; the measured token figures above are evaluator supplementation
from the supplied usage capture, not an investigator measurement claim.

Independent source validation used 12 additional logical `gh api` invocations.
These were verification reads, not a rerun of investigator discovery, and are
not added to the investigator’s 21-request count. Evaluator monetary cost and
total elapsed processing time were not measured.

## Recovery coverage

`RECOVERY_COVERAGE`: All ten dimensions were assessed.

Nine dimensions support narrowly scoped `VERIFIED` findings about public
identities, contents or associations. D04 remains `REFERENCED_NOT_VERIFIED` for
the original instruction/receipt claim.

Coverage includes the exact artifact, associated PR, public task marker,
contextual-source contents, associated reports/reviews, identified Git history
and continuation/native relationships. It excludes independent verification of
historical prompt receipt, all local execution assertions and complete original
context.

These dimension counts are not a percentage of universal reliability.

## Unknown historical completeness

`HISTORICAL_COMPLETENESS=NOT_ESTABLISHED`

The recovered records were not shown to constitute everything originally
available to participants. No complete original-packet inventory, independently
verified receipt record or complete historical execution archive was recovered.

Public record abundance, successful API retrieval and matching hashes/trees do
not establish historical completeness or future availability.

## Negative findings and counterexamples

- Zero closing-Issue references on #37 did not prevent recovery of its public
  task association.[S03]
- Zero native reviews did not mean that no public review reports existed.[S06]
- An empty PR array on the CI run did not eliminate the independently supported
  head-SHA and explicit-link association.[S03][S17]
- A successful run/job conclusion did not verify every locally reported test
  count or failure diagnosis.[S17][S18]
- A real synthetic commit did not prove that its checkout executed.[S25]
- Public source documents and a referenced packet digest did not prove
  historical receipt.[S06][S11]
- An open continuation Issue and native blockers did not establish an accepted
  derivation baseline.[S08][S09]

The original instruction packet, local raw evidence and originating assignment
Issue were not located within the declared examined surfaces. No
repository-wide or private-source search was performed, and global absence is
not inferred.

## Evidence provenance

Frozen investigator content SHA-256:

`75cab22891d76c7819a56ff51291c42cae7a184274a0ef0035b7dc2a79233350`

Frozen tool-trace SHA-256:

`af3d6ded07bab301b4087e3a627f210e1cb822c7a8d0c372b118f888709961bd`

Both hashes were independently recomputed and matched the supplied controller
metadata. No public download URL for these frozen research artifacts was
established; public GitHub objects below provide source traceability for the
case claims.

Effective investigator metadata was captured before the substantive request at
`2026-11-05T12:42:31.596593Z` and after completion at
`2026-11-05T12:50:34.782145Z`. Provider, model and thinking settings agreed
across these captures.

The protocol revision and its public protocol/template objects were
independently retrieved as evaluation authority. That authority check and
runtime supplementation are not historical case recovery.

All historical subject evidence used here came from public GitHub reads. No
private conversation, raw agent session, credential or unpublished instruction
was retrieved as subject evidence.

[A01]:
  https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/protocol-v1.md
[A02]:
  https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/report-template-v1.md
[S01]:
  https://github.com/fanilosendrison/proto-lithify/commit/025bc880281d42f67aaf4b5ae0b410e0e8056e6e
[S02]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/commits/025bc880281d42f67aaf4b5ae0b410e0e8056e6e/pulls?per_page=100&page=1
[S03]: https://github.com/fanilosendrison/proto-lithify/pull/37
[S04]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/pulls/37/commits?per_page=100&page=1
[S05]: https://github.com/fanilosendrison/lithify/pull/2
[S06]:
  https://github.com/fanilosendrison/lithify/pull/2#issuecomment-6640557544
[S07]:
  https://github.com/fanilosendrison/lithify/issues/1#issuecomment-6640684840
[S08]: https://github.com/fanilosendrison/lithify/issues/1
[S09]: https://github.com/fanilosendrison/lithify/issues/3
[S10]:
  https://github.com/fanilosendrison/proto-lithify/blob/025bc880281d42f67aaf4b5ae0b410e0e8056e6e/docs/research/empirical-role-and-evidence.md
[S11]:
  https://github.com/fanilosendrison/proto-lithify/blob/54392f679c3d27318f5acfa93fb0e259fb723240/AGENTS.md
[S12]:
  https://github.com/fanilosendrison/proto-lithify/blob/025bc880281d42f67aaf4b5ae0b410e0e8056e6e/docs/cli-contract.md
[S13]:
  https://github.com/fanilosendrison/proto-lithify/blob/025bc880281d42f67aaf4b5ae0b410e0e8056e6e/docs/architecture.md
[S14]:
  https://github.com/fanilosendrison/proto-lithify/blob/025bc880281d42f67aaf4b5ae0b410e0e8056e6e/docs/installation.md
[S15]:
  https://github.com/fanilosendrison/proto-lithify/blob/025bc880281d42f67aaf4b5ae0b410e0e8056e6e/docs/repository-governance/proto-lithify-engineering.md
[S16]:
  https://github.com/fanilosendrison/lithify/blob/a5234578730aa774c28d5ce6447f57643e10bcdb/docs/specification/lithify-spec.md
[S17]:
  https://github.com/fanilosendrison/proto-lithify/actions/runs/41890624845
[S18]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/actions/runs/41890624845/jobs?per_page=100&page=1
[S19]:
  https://github.com/fanilosendrison/proto-lithify/actions/runs/41901508348
[S20]:
  https://github.com/fanilosendrison/lithify/commit/131f0a28d7c479128004326d03e87dd48cb6411c
[S21]:
  https://github.com/fanilosendrison/lithify/commit/a5234578730aa774c28d5ce6447f57643e10bcdb
[S22]: https://github.com/fanilosendrison/proto-lithify/issues/28
[S23]: https://github.com/fanilosendrison/proto-lithify/issues/34
[S24]: https://github.com/users/fanilosendrison/projects/9
[S25]:
  https://github.com/fanilosendrison/proto-lithify/commit/c93226c563768790aa755e86025262de116eef9b

## Independent evaluation

**Disposition: PARTIAL. Structural validation: FAIL. Evidence validation: PASS
at the declared narrow scopes.**

The frozen report contains exactly ten accepted dimension names and statuses,
with a resolvable E01–E21 source sequence. However, it does not follow the
accepted template, omits explicit study/revision/case metadata, lacks the
prescribed evidence/limitation table columns and does not separately report all
eight cost quantities. This draft supplies evaluator presentation and runtime
provenance without altering the frozen report.

Original-to-final classifications are preserved:

- D01 EXACT_ARTIFACT_IDENTITY: `VERIFIED` → `VERIFIED`; exact Git identity
  corroborated.
- D02 ARTIFACT_TO_PR: `VERIFIED` → `VERIFIED`; association endpoint and merge
  identities corroborated.
- D03 ARTIFACT_TO_WORK: `VERIFIED` → `VERIFIED`; public
  marker/companion/handoff association corroborated, not original assignment
  receipt.
- D04 WORK_TO_INSTRUCTION: `REFERENCED_NOT_VERIFIED` →
  `REFERENCED_NOT_VERIFIED`; original packet and receipt remain unverified.
- D05 WORK_TO_CONTEXTUAL_SOURCES: `VERIFIED` → `VERIFIED`; published contents
  and associations only.
- D06 WORK_TO_EXECUTION_REPORT: `VERIFIED` → `VERIFIED`; report
  existence/association and provider CI conclusions only.
- D07 WORK_TO_DECISIONS_AND_REVIEWS: `VERIFIED` → `VERIFIED`; published reports
  and decision text only.
- D08 WORK_TO_CHANGE_HISTORY: `VERIFIED` → `VERIFIED`; ancestry/tree identities
  corroborated.
- D09 WORK_TO_CONTINUATION_INFORMATION: `VERIFIED` → `VERIFIED`; continuation
  records and associations only.
- D10 PROJECT_AND_NATIVE_RELATIONSHIPS: `VERIFIED` → `VERIFIED`; observed
  native and Project projections only.

Classification corrections: **0**. Unsupported dimension-level VERIFIED claims:
**0**.

A subsidiary wording qualification applies to individual development-commit
path attribution: the investigator retrieved commit messages and ancestry, not
individual commit diffs. The supported D08 claim remains the exact ancestry and
tree relationship.

Independent public checks covered the commit and PR association; both PR
bodies; canonical review comment; handoff and continuation bodies; exact source
revisions; Git candidate/merge objects; CI run/job conclusions; and
native/Project projections. These checks did not authenticate historical
instruction delivery or reproduce local execution.

`EVALUATOR_ONLY_DISCOVERY`: **0 additional historical case findings**.
Authority checks, runtime measurements and editorial qualifications are
separately identified evaluator contributions, not investigator recovery.

Unresolved competing-identity ambiguities: **0**. Historical receipt,
completeness and substantive report-truth gaps remain explicit unknowns, not
silently resolved facts.

No public frozen-case access failure occurred. Successful tool execution alone
was not treated as qualification.

## Bounded conclusion

This **PARTIAL** assessment supports a bounded exploratory finding: the
investigator recovered the exact artifact-to-PR association and substantial
public work, source, report, review, history and continuation relationships
within 21 logical API invocations and three discovery hops.

The original instruction packet, actual historical receipt, raw review inputs,
every local execution assertion and historical completeness were not
established. No evaluator-only historical discovery is credited to the
investigator.

The retained empirical observations concern revision binding, cross-repository
markers, comment-based review records, narrative failure preservation and
reconciliation of historical prose with current metadata. Hypotheses about
their benefits remain untested and non-normative.

These findings remain useful as Proto-Lithify empirical knowledge without
Lithify adoption. They establish no architecture, new CLI capability, accepted
requirement, causal effect, representative sampling result or universal
reliability. Lithify independently owns derivation and any later adoption
decision.
