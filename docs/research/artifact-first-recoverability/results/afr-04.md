---
okf_version: "1.0"
kind: KnowledgeAsset
asset_type: research-case-assessment
domain: proto-lithify
severity: guideline
name: "AFR-04 empirical case assessment"
version: "0.1.0"
---

# AFR-04 — Artifact-first recoverability assessment

## Case metadata

```text
STUDY_ID=PL-R-AFR-20261104
PROTOCOL_REVISION=91727041cddcedcdd83903617d4061de78473a8c
CASE_ID=AFR-04
REPOSITORY=fanilosendrison/proto-scope
STARTING_ARTIFACT_SHA=9e5bf1cb7718317a95d725156f0eed69d9a9b9cb
OBSERVATION_TIME=2026-11-05T12:07:28Z–2026-11-05T12:11:47Z
AUTHORIZED_SURFACES=Public Git commits/history; public PR
  metadata/comments/reviews; public Issue bodies/comments/native relationships;
  public versioned documentation; directly linked public evidence; demonstrably
  public Project information
INVESTIGATOR_CONTEXT=Fresh independent session; repository and exact merge SHA
  were the only supplied case-specific discovery inputs; generic research and
  execution constraints were also supplied
INVESTIGATOR_MODE=NON_BLIND_EXPLORATORY
EVALUATION_DISPOSITION=PARTIAL
```

Independent source checks occurred within
`2026-11-05T12:16:24Z–2026-11-05T12:19:11Z`. Individual request timestamps were
not separately recorded.

The assessment follows the [accepted protocol][AP] and [report template][AT] at
the exact revision above. Publicly retrieved authority-file bytes matched the
supplied files.

The investigator’s effective runtime was `openai-codex-1`, model `gpt-6.1-sol`,
thinking `xhigh`, with bash available. Before/after metadata identified the
same retained session, `01a1ab9b-25d7-702e-b8da-6154bb2fde04`; context files,
skills, prompt templates and discovered extensions were disabled. Invocation
identity was not exposed.

Initialization supplied no subject. No PR number, Issue number or descriptive
controller label was supplied as a discovery hint. Technical confinement from
controller materials was not established; no blind claim is made. The exact
full generic instruction text and its hashes were not included in the
evaluation packet and are not reconstructed here.

The frozen investigator report omitted study, protocol-revision and case
identifiers. Their inclusion here is evaluation metadata, not investigator
recovery.

## Dimension assessment

`VERIFIED` below concerns only the specified identity, published content or
association. It does not authenticate the substantive truth of actor
statements.

DIMENSION | CLASSIFICATION | OBSERVED_IDENTITY | EVIDENCE_URL | OBSERVATION | LIMITATION
--------- | -------------- | ----------------- | ------------ | ----------- | ----------
D01 EXACT_ARTIFACT_IDENTITY | VERIFIED | Commit `9e5bf1cb7718317a95d725156f0eed69d9a9b9cb` in `fanilosendrison/proto-scope` | [Exact commit][C] | GitHub returned the exact SHA, parents, tree and two-file change; independently corroborated. | GitHub signature verification was observed, not independently cryptographically checked.
D02 ARTIFACT_TO_PR | VERIFIED | PR #31; head `2b121bd12bed07b129fa611642ff8917821113fb` | [Commit association][CA]; [PR #31][P] | The commit-association endpoint returned one candidate; PR merge SHA equals the starting SHA, and PR base/head match its parents. | This excludes conflicting candidates only on the examined association surface, not every possible repository reference.
D03 ARTIFACT_TO_WORK | VERIFIED | Issue #25, “DT-01.B.6 — Consolidate bounded DT-01.B findings” | [Issue #25][W]; [PR #31][P] | PR #31 and Issue #25 expose reciprocal native closing relationships. | This establishes the associated work item, not the complete original mission or private intent.
D04 WORK_TO_INSTRUCTION | VERIFIED | Issue #25 instructions; methodology blob `3ec7db5ec59609086d1ddb1b0aa373b67f9d27c8` | [Issue #25][W]; [Baseline methodology][M] | The issue publishes work-specific instructions, including application of protocol E; the required methodology was retrieved. | Actual historical executing-agent receipt of these instructions or an exact prompt remains unproved.
D05 WORK_TO_CONTEXTUAL_SOURCES | VERIFIED | Revision-bound source manifest in the consolidated analysis; retrieved methodology | [Published analysis][A]; [Methodology][M] | The analysis contains source paths, revisions, blobs and digest references; the methodology’s provider blob identity matches its manifest entry. | Other corpus entries are references rather than independently reacquired sources; historical delivery and corpus completeness are unproved.
D06 WORK_TO_EXECUTION_REPORT | VERIFIED | Issue #25 completion comment `6389988947` | [Completion record][DONE] | A public completion record binds candidate, merge, report blob and tree identities to this work. | Readback, scans and CI applicability remain actor reports except for separately checked provider metadata.
D07 WORK_TO_DECISIONS_AND_REVIEWS | VERIFIED | STOP comment `6389793105`; corrected GO comment `6389965218` | [STOP record][STOP]; [GO record][GO] | Both review records exist, identify candidates and preserve findings and disposition changes. | They are Issue comments, not native PR reviews. Model attribution, packet receipt and substantive review correctness are unproved.
D08 WORK_TO_CHANGE_HISTORY | VERIFIED | Merge parents, one PR branch commit, report and README blobs | [Commit][C]; [PR commits][PC]; [PR files][PF] | Git ancestry, branch publication and file identities are recoverable; comments preserve reported correction findings. | The rejected candidate’s named blob returned HTTP 404; complete rejected bytes and complete prepublication history were not recovered.
D09 WORK_TO_CONTINUATION_INFORMATION | VERIFIED | Parent #15; successor #16; retained #16 → #15 dependency | [Parent disposition][PD]; [Successor #16][S] | The parent disposition explicitly references the starting artifact; successor content and its native dependency are observable. | Successor-linked PR/commit objects were not followed; later public records do not establish their availability during the original execution.
D10 PROJECT_AND_NATIVE_RELATIONSHIPS | VERIFIED | PR31 → Issue25 closure; Issue25 → Issue15 parent; Issue25 → Issue24 dependency; Issue16 → Issue15 dependency | [PR #31][P]; [Issue #25][W]; [Issue #16][S] | Native relationship projections corroborate the work links. | Public Project state was not established. Incidental non-public Project-reference metadata was not followed or used as public evidence.

## Exact discovery sequence

The investigator was limited to public read operations, at most 100 API
requests, one `gh api` invocation per bash command, explicit REST GET or pure
GraphQL queries, no automatic pagination, and at most three
relationship-discovery hops:

- Artifact: hop 0.
- Associated PR: hop 1.
- Associated work: hop 2.
- Directly linked context or continuation: hop 3.

Object containment projections—comments, reviews and native relationships—did
not authorize following another downstream artifact. No source-repository code
was executed.

REST paths below are relative to
`https://api.github.com/repos/fanilosendrison/proto-scope/`.

- **R01**, hop 0: Exact commit GET; output display-truncated, with part of the
  analysis patch visible.
- **R02**, hop 0: Same commit with a narrowed projection; exact metadata,
  parents, tree and file identities recovered.
- **R03**, hop 1:
  `commits/9e5bf1cb7718317a95d725156f0eed69d9a9b9cb/pulls?per_page=100&page=1`;
  one candidate, PR #31.
- **R04**, hop 1: `pulls/31`; merged state and exact base/head/merge identities
  recovered.
- **R05**, hop 2: `issues/25`, reached through `Closes #25`; instructions and
  work identity recovered.
- **R06**, hop 2: Issue #25 comments, first page of 100; three comments
  returned.
- **R07**, hop 1–3: Pure GraphQL query for repository visibility, native
  closure, parent, dependencies and Project projections.
- **R08**, hop 1: PR #31 commits, first page of 100; one branch commit
  returned.
- **R09**, hop 1: PR #31 files, first page of 100; two files and README patch
  examined.
- **R10**, hop 1: PR discussion comments; empty array.
- **R11**, hop 1: Native PR reviews; empty array.
- **R12**, hop 1: PR review comments; empty array.
- **R13**, hop 2: Issue #25 timeline; output display-truncated. Visible events
  included publication references, closure and Project event types.
- **R14**, hop 0: Analysis Contents API at the starting SHA; lines 1–210
  examined.
- **R15**, hop 3: Parent Issue #15 body and current state.
- **R16**, hop 3: Parent comments; one artifact-bound disposition comment
  returned.
- **R17**, hop 3: Successor Issue #16 body and current state.
- **R18**, hop 3: Successor comments; three records returned. Downstream
  publication objects were not followed.
- **R19**, hop 3: Rejected-candidate blob
  `aa382b2ea4bb1e16529c0071a373198c66a33b33`; HTTP 404, no retry.
- **R20**, hop 3: Full methodology content at baseline
  `5f1cd2f6fbb7c9bb5e21f29b13cd97e522c42692`.
- **R21**, hop 0: Repeated analysis Contents request followed by local response
  processing; `UnicodeDecodeError`, no computed digest obtained.
- **R22**, hop 0, 3: Pure GraphQL query for head/merge status and check suites,
  plus successor dependency.

Two additional bash calls recorded UTC dates.

The trace establishes 22 logical API invocations, not 22 independently observed
HTTP transport attempts. No automatic pagination or hop-bound breach was found.
No broader search, complete contextual reacquisition, downstream PR #32
inspection, or private conversation retrieval occurred.

R07 incidentally returned non-public Project-reference metadata through a
public Issue projection. No Project object was subsequently opened. Its
identifiers and content are excluded from this public report.

Independent evaluation used 13 additional logical public GitHub API
invocations: ten case-source checks and three protocol/template authority
checks. These were validation reads, not an investigator rerun, and are
excluded from investigator costs.

## Artifact and PR identity verification

The [starting commit][C] has:

- First parent: `5f1cd2f6fbb7c9bb5e21f29b13cd97e522c42692`.
- Second parent: `2b121bd12bed07b129fa611642ff8917821113fb`.
- Tree: `1b22ab965097c5c4d4be7782294611921c8aed5d`.
- Author/committer timestamp: `2026-10-24T21:51:56Z`.
- Change statistics: 849 additions, zero deletions, two files.
- Report blob: `7665e22fdc180afd187992fc510c7e379d839976`.
- README blob: `e033cdf04cc7648dd33fc4e21dda44ff7e73a184`.

Its message names merge PR #31, but that text was not the sole association
evidence.

[PR #31][P], “docs: consolidate bounded DT-01.B case analysis,” was created at
`2026-10-24T21:51:34Z` and merged at `21:51:56Z`. Independent reads confirmed:

```text
PR merge SHA = starting artifact SHA
PR base SHA = merge first parent
PR head SHA = merge second parent
PR head tree = merge tree
```

The PR contains one branch commit and the same two changed files:

- `docs/research/derivtrace/README.md`: ten additions.
- `docs/research/derivtrace/dt-01-b-consolidated-case-analysis.md`: 839
  additions.

The frozen expected PR agrees with this recovery, but was not supplied to the
investigator and is not credited as a discovery step.

## Work and mission recovery

[Issue #25][W] is the directly associated work record. Its published objective
is to consolidate DT-01.B evidence, counterexamples, classifications,
limitations and independent criticism, while assessing parent #15 separately.

Its instructions require:

- Application of protocol E from DT-01.B.1.
- An integrated dimension-by-case-by-question analysis.
- Preservation of negative findings and residual unknowns.
- Explicit assessment of parent acceptance criteria.
- No conceptual model, schema, implementation or new normative requirement.
- No automatic parent closure.

Native GitHub projections establish that PR #31 closes Issue #25, Issue #25 is
a child of #15, and #25 retains a dependency on #24.

These observations recover a public work definition. They do not establish a
complete original mission, all contemporaneous instructions, or unexposed
participant intent.

## Instructions and sources

The [Issue #25 body][W] is an observable instruction record associated with the
work. The [baseline methodology][M] was retrieved at commit
`5f1cd2f6fbb7c9bb5e21f29b13cd97e522c42692`, with provider blob identity
`3ec7db5ec59609086d1ddb1b0aa373b67f9d27c8`.

The methodology separates exact discrimination targets, observation boundaries,
diagnostic challenges and exclusive examination classifications. Its existence
and content do not prove that the original executing agent received it.

The [published analysis][A], Section 2, records a baseline-bound manifest for
the questionnaire, predecessor analyses, methodology, research plan and
specification. It supplies revisions, blob identities, digests and byte counts.
It also reports Issue/comment acquisition at `2026-10-24T21:17:14Z` and
expressly acknowledges mutable records.

The investigator retrieved the methodology, not the entire manifest corpus. R21
failed before producing an independent digest of the final analysis. Published
digest references therefore remain references unless separately corroborated.

No authenticated original executing-agent prompt or delivery record was
recovered. Review-packet identifiers and public source links do not establish
actual historical receipt or availability.

## Execution reports and review evidence

Three [Issue #25 comments][WC], all published under GitHub account
`fanilosendrison`, provide the principal records:

- **STOP review**, [comment 6389793105][STOP], `2026-10-24T21:32:11Z`:
  `STOP_CORRECTIONS_REQUIRED`, one major and one minor finding.
- **Corrected review**, [comment 6389965218][GO], `21:50:09Z`:
  `GO_FOR_RESEARCH_PUBLICATION`, F-01/F-02 qualified, twenty AC targets
  audited, zero blocker/major/minor findings.
- **Completion report**, [comment 6389988947][DONE], `21:52:37Z`: publication
  identities, readback `PASS` and `NO_APPLICABLE_CI`.

The corrected review names report blob
`7665e22fdc180afd187992fc510c7e379d839976` and tree
`1b22ab965097c5c4d4be7782294611921c8aed5d`, matching provider artifact
metadata.

Both reviews explicitly describe packet-only examination and disclaim
independent repository/hash authentication. Their claimed `gpt-5.6-sol/xhigh`
execution is an attribution within the published record, not independently
authenticated provider evidence.

Native PR reviews, review comments and discussion comments were empty on the
examined surfaces. This is a counterexample to treating native PR review
objects as the only location of review evidence.

Head and merge commit projections returned null legacy status, null
status-check rollup and zero check suites. These observations do not prove that
no validation occurred or that CI was historically inapplicable.

## Decisions, corrections and continuation

The [STOP record][STOP] identifies:

- **F-01, major:** direct question/dimension credit assigned through thematic
  adjacency rather than the exact contrast tested.
- **F-02, minor:** twelve parent acceptance criteria plus separate Validation
  incorrectly described as thirteen criteria.

The [corrected GO record][GO] reports narrower direct mappings, explicit
fixed-assumption accounting and correction of the count. The PR and final
artifact preserve the negative result:

```text
CASE_SELECTION_ADEQUACY=BOUNDED_ADEQUACY_REFUTED
```

This assessment verifies that the conclusion was published and retained; it
does not independently repeat the underlying research.

The [parent disposition comment][PD] at `2026-10-24T22:03:52Z` explicitly cites
the starting artifact, PR and report blob. GitHub shows [Issue #15][PAR] closed
as completed at `22:04:17Z`. Earlier publication-time statements that #15
remained open are temporally distinct, not necessarily contradictory.

[Successor Issue #16][S] is closed as completed and retains a native dependency
on #15. Its [publication comment][SD] references PR #32 and merge
`210f0ab8f1711d4d8c255bd4c8f3aeb8f3fb68b2`. Those downstream objects were not
opened by the investigator or evaluator; their identities are retained as
references only.

## Empirical extraction from observed engineering practice

### Observations

- **Repeated exact identity bindings supported cross-checking.** The
  [commit][C], [PR][P], [corrected review][GO] and [completion record][DONE]
  repeat compatible merge, candidate, blob and tree identities. This supported
  bounded association recovery, not independent validation of every digest or
  substantive statement.
- **Rejected review findings remained visible.** The [STOP][STOP] and [GO][GO]
  records coexist. The record preserves corrective decisions rather than only
  the final approval. Actual review execution remains actor-attributed.
- **Review evidence existed outside native PR reviews.** Issue comments contain
  substantial reviews while native PR review surfaces are empty. A
  PR-review-only examination would miss those records.
- **Published decisions outlasted accessible candidate bytes.** One branch
  commit is visible in [PR history][PC], while comments name an earlier
  rejected candidate whose [blob endpoint][OLD] returned 404. Decision recovery
  and complete candidate recovery therefore diverge.
- **Negative research and publication qualification coexisted.** The
  [analysis][A] and [PR][P] preserve refuted bounded adequacy while the [GO
  record][GO] qualifies publication. Publication approval is not equivalent to
  an affirmative research result.
- **Parent disposition was separate and later.** The [completion record][DONE]
  leaves parent disposition pending; the later [parent comment][PD] assesses it
  separately. Recovery requires attention to record time.
- **Completed dependencies remained represented.** [Issue #16][S] retains its
  dependency on closed #15. This preserves a native relationship after
  completion.
- **Retrieval encountered practical friction.** R01 and R13 were
  display-truncated; R21 failed during response processing; R02 repeated a
  commit read with a narrower projection. These are observed retrieval costs,
  not evidence of participant manual effort or comparative agent efficiency.

### Interpretations, alternatives and hypotheses

Cross-surface identity repetition may help later readers reconcile publication
and review records. Its counterexample is that compatible identities still do
not establish packet delivery, substantive truth or complete history.

Issue comments and native PR reviews were alternative record locations in this
case. Native work relationships and prose references provided complementary
association evidence; neither is selected as a required representation.

A bounded hypothesis is that retaining rejection records improves recovery of
correction rationale even when earlier bytes are unavailable. This case
supports the plausibility of that hypothesis, not a causal estimate or
universal recommendation.

No unnecessary participant manual effort was measured. No storage design,
schema, architecture or product requirement is derived.

## GitHub Project observations

Public Project state was not established.

R07 queried Project projections on the public PR and work Issue. The
investigator disclosed an incidental non-public Project reference and did not
follow it. Its identifying metadata is withheld and is not admissible public
evidence.

R13 exposed Project-related event types, but no qualified public Project status
values. No inference about current or historical Project state follows.

D10 remains narrowly verified for native closure, parent and dependency
relationships, not for Project-state recovery.

## Ambiguities and inaccessible sources

Seven unresolved evidence questions remain:

1. **Instruction receipt:** no authenticated original prompt or delivery
   record.
2. **Contextual delivery:** no complete original packet bytes, source-supply
   evidence or complete corpus reacquisition.
3. **Review execution and truth:** public attribution does not authenticate
   model execution, procedural independence or substantive correctness.
4. **Rejected candidate:** blob `aa382b2ea4bb1e16529c0071a373198c66a33b33`
   returned HTTP 404 during both investigation and independent checking.
5. **Public Project state:** not established within authorized public evidence.
6. **Historical validation:** readback, scans, reproduction and CI
   applicability remain partly actor-reported; no rerun was authorized.
7. **Historical completeness:** no evidence establishes that recovered records
   include everything originally available.

These are unresolved evidence questions, not seven competing artifact
identities. No conflicting PR candidate was found on the examined association
endpoint.

The ancillary blob failure does not establish historical nonexistence. The
frozen starting artifact and expected PR were accessible; no frozen-case access
failure requiring campaign STOP was found.

## Reconstruction cost measurements

The following values concern the investigator, not evaluator source checks.
Runtime capture supplements omissions in the frozen report.

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
    **Value:** 22 logical invocations: 20 REST GETs and 2 GraphQL queries; HTTP
    transport attempts NOT_MEASURED **Measurement provenance:** Complete frozen
    trace and controller audit; one invocation per API-bearing bash command.

[^cost-2]:
    **Value:** R01–R22; maximum followed discovery depth 3; no automatic
    pagination **Measurement provenance:** Commands and returned records in the
    frozen trace.

[^cost-3]:
    **Value:** 434.331 seconds substantive; 442.562 seconds whole session; 259
    seconds retrieval interval **Measurement provenance:** Runtime usage
    capture; first/last investigator UTC date calls bound retrieval.

[^cost-4]:
    **Value:** 24 bash calls **Measurement provenance:** Frozen trace: 22
    API-bearing calls and 2 date-only calls.

[^cost-5]:
    **Value:** 77,238 input; separately exposed cache-read 993,408 and
    cache-write 0 **Measurement provenance:** Whole-session runtime usage
    capture, including initialization.

[^cost-6]:
    **Value:** 13,606 **Measurement provenance:** Whole-session runtime usage
    capture, including initialization.

[^cost-7]:
    **Value:** NOT_MEASURED **Measurement provenance:** No verified
    subscription-charge attribution; catalog estimates are not actual charges.

[^cost-8]:
    **Value:** NOT_MEASURED **Measurement provenance:** No reliable
    intervention-count measurement supplied.

The runtime capture reports 1,084,252 total tokens across its exposed
categories. Phase-specific initialization tokens were not separately exposed.
Whole-session elapsed time exceeds substantive elapsed time by 8.231 seconds;
that difference includes initialization/session overhead.

The frozen report’s 259 seconds measured retrieval, not total substantive
response time. One HTTP 404, one response-processing failure and two
display-truncated outputs remain recorded. No inference-efficiency comparison
is made.

## Recovery coverage

`RECOVERY_COVERAGE`: all ten dimensions support the narrowly scoped
published-record or relationship claims in the dimension table.

Coverage is nevertheless incomplete within several dimensions:

- D04 does not establish historical instruction receipt.
- D05 does not authenticate the complete contextual corpus or delivery.
- D06–D07 do not independently validate execution or review truth.
- D08 lacks complete rejected-candidate bytes.
- D09 does not verify downstream publication objects.
- D10 does not recover qualified public Project state.

Ten verified scoped claims are not a universal reliability percentage or proof
that every possible component was recovered.

## Unknown historical completeness

`HISTORICAL_COMPLETENESS=NOT_ESTABLISHED`.

No independent evidence identifies all instructions, conversations, contextual
materials, intermediate candidates or validation results originally available.

Public Issue/comment bodies are mutable. Exact artifact identities and current
public records do not establish complete historical custody or availability.
Missing evidence does not prove that a prompt, packet, candidate or validation
record never existed.

## Negative findings and counterexamples

- Examined PR review/comment endpoints returned empty arrays, yet substantive
  review records were recovered from Issue comments.
- Head/merge check projections returned no statuses or check suites; this does
  not prove no testing or no applicable CI.
- The rejected-candidate blob endpoint returned 404; this does not prove that
  the candidate never existed.
- No authenticated original prompt or delivery record was located in the
  examined work surfaces.
- The full contextual corpus and downstream PR #32 were not examined.
- Public Project status was not recovered; Project event types alone were
  insufficient.
- A published GO and completed work coexist with `BOUNDED_ADEQUACY_REFUTED`,
  countering any equation of publication approval with positive research
  adequacy.
- One visible branch commit did not contain all recoverable correction history;
  comments supplied additional decision records.

All negatives are limited to the declared surfaces, request bounds and
observation times.

## Evidence provenance

The frozen investigator content was preserved unchanged:

```text
INVESTIGATOR_REPORT_SHA256=c0107cc7056d86e69fac4f83e0d2f4252ae0f2538d7a8a83984b32731f4f24c8
TOOL_TRACE_SHA256=b73ada65e448a8c2ec18cf6a0161f775517ce3cf52625b69a7ddc804fc4ba826
INVESTIGATOR_SESSION_UUID=01a1ab9b-25d7-702e-b8da-6154bb2fde04
EVALUATOR_SESSION_UUID=01a1aba2-3de8-7075-bfc6-f29f683134ae
```

Both hashes were recomputed and matched controller metadata. The complete tool
trace, runtime-before/runtime-after records, usage capture and trace audit were
examined. Raw private sessions and reasoning were not read or published.

Evaluator runtime metadata observed before evaluation identified
`openai-codex-1`, `gpt-6.1-sol`, thinking `xhigh`, with read and bash
available. No evaluator post-review runtime state is claimed.

Independent source checks corroborated:

- Exact commit and commit-to-PR association.
- PR merge/base/head/tree identities and two-file change.
- Reciprocal PR/Issue closure, parent and dependency relationships.
- Issue instruction content and cited review/completion records.
- Published analysis manifest and methodology blob.
- Parent disposition, successor dependency and commit check projections.
- Rejected-candidate 404.
- Exact published protocol/template revision and supplied-file equality.

These checks validate the declared records and associations, not every
proposition inside them. Public source URLs below provide traceable evidence;
the content hashes identify preserved research outputs but do not substitute
for public source proof.

## Independent evaluation

**Disposition: PARTIAL.**

The frozen report’s structural validation is **FAIL**. It omitted
study/revision/case metadata, required template sections and columns, per-row
evidence URLs, effective runtime context and complete cost accounting. This
draft supplies the missing presentation and controller-captured measurements
without changing the frozen result.

Evidence validation is **PARTIAL overall**: critical identity and association
checks passed, while the explicitly bounded historical and inaccessible
components remain unresolved.

Original-to-final classifications:

- D01: **VERIFIED → VERIFIED** — exact artifact identity corroborated.
- D02: **VERIFIED → VERIFIED** — PR association and merge equality
  corroborated.
- D03: **VERIFIED → VERIFIED** — native work closure corroborated.
- D04: **VERIFIED → VERIFIED** — published instruction content; receipt remains
  unproved.
- D05: **VERIFIED → VERIFIED** — manifest/reference content and retrieved
  methodology; complete delivery remains unproved.
- D06: **VERIFIED → VERIFIED** — associated completion record; actor claims
  remain qualified.
- D07: **VERIFIED → VERIFIED** — associated STOP/GO records, not authenticated
  model execution.
- D08: **VERIFIED → VERIFIED** — recoverable publication history; rejected
  bytes remain inaccessible.
- D09: **VERIFIED → VERIFIED** — parent/successor records and dependency;
  downstream artifacts remain references.
- D10: **VERIFIED → VERIFIED** — native relationships only; public Project
  state remains unestablished.

There are **zero unsupported VERIFIED dimension claims** and **zero
classification corrections**. The original scopes already distinguish record
content from receipt and truth.

Disagreements concern report compliance and measurement completeness, not the
recovered PR/work identities. The 259-second figure is retained as a retrieval
interval; runtime capture separately supplies substantive and whole-session
elapsed times.

**EVALUATOR_ONLY_DISCOVERY: zero substantive case discoveries.** Authority
checks and runtime supplementation are evaluator provenance, not additional
investigator recovery.

The trace demonstrates 22 logical API invocations, one per API-bearing command,
no automatic pagination and no followed hop beyond three. The incidental
non-public Project-reference return remains an access-boundary limitation.
Exploratory classification does not erase it.

Seven unresolved evidence questions are retained in the ambiguity section.
Successful API execution alone does not qualify historical execution,
completeness or the frozen report’s structural compliance.

## Bounded conclusion

The investigator recovered and the evaluator corroborated a public chain:

**exact merge commit → PR #31 → Issue #25 → published instructions, contextual
references, review decisions and completion record → parent disposition and
successor information.**

This supports bounded artifact-first record recovery. It does not authenticate
original prompt receipt, complete source delivery, review execution, all
historical validation or historical completeness.

Useful empirical observations include cross-surface identity binding, preserved
rejection history, reviews outside native PR review objects, separate parent
disposition and retained completed dependencies. The hypothesis that these
arrangements aid later recovery remains non-normative and non-causal.

The frozen assessment remains **PARTIAL** because required reporting structure
was incomplete and several evidence components remain unavailable or
unverified. No evaluator-only substantive discovery is credited as investigator
recovery.

Proto-Lithify owns empirical extraction. Lithify retains independent derivation
and adoption authority. No finding establishes a requirement, architecture, new
CLI capability, Product Intent amendment or universal reliability. The six-case
corpus is diagnostic rather than representative; this case supports neither
causal inference nor historical completeness.

[AP]:
  https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/protocol-v1.md
[AT]:
  https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/report-template-v1.md
[C]:
  https://github.com/fanilosendrison/proto-scope/commit/9e5bf1cb7718317a95d725156f0eed69d9a9b9cb
[CA]:
  https://api.github.com/repos/fanilosendrison/proto-scope/commits/9e5bf1cb7718317a95d725156f0eed69d9a9b9cb/pulls?per_page=100&page=1
[P]: https://github.com/fanilosendrison/proto-scope/pull/31
[PC]:
  https://api.github.com/repos/fanilosendrison/proto-scope/pulls/31/commits?per_page=100&page=1
[PF]:
  https://api.github.com/repos/fanilosendrison/proto-scope/pulls/31/files?per_page=100&page=1
[W]: https://github.com/fanilosendrison/proto-scope/issues/25
[WC]:
  https://api.github.com/repos/fanilosendrison/proto-scope/issues/25/comments?per_page=100&page=1
[M]:
  https://github.com/fanilosendrison/proto-scope/blob/5f1cd2f6fbb7c9bb5e21f29b13cd97e522c42692/docs/research/derivtrace/dt-01-b-methodology.md
[A]:
  https://github.com/fanilosendrison/proto-scope/blob/9e5bf1cb7718317a95d725156f0eed69d9a9b9cb/docs/research/derivtrace/dt-01-b-consolidated-case-analysis.md
[STOP]:
  https://github.com/fanilosendrison/proto-scope/issues/25#issuecomment-6389793105
[GO]:
  https://github.com/fanilosendrison/proto-scope/issues/25#issuecomment-6389965218
[DONE]:
  https://github.com/fanilosendrison/proto-scope/issues/25#issuecomment-6389988947
[PAR]: https://github.com/fanilosendrison/proto-scope/issues/15
[PD]:
  https://github.com/fanilosendrison/proto-scope/issues/15#issuecomment-6390095927
[S]: https://github.com/fanilosendrison/proto-scope/issues/16
[SD]:
  https://github.com/fanilosendrison/proto-scope/issues/16#issuecomment-6390416712
[OLD]:
  https://api.github.com/repos/fanilosendrison/proto-scope/git/blobs/aa382b2ea4bb1e16529c0071a373198c66a33b33
