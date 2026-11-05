---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "research-case-assessment"
domain: "proto-lithify"
severity: "guideline"
name: "AFR-01 empirical case assessment"
version: "0.1.0"
---

# AFR-01 — Artifact-first recoverability assessment

## Case metadata

```text
STUDY_ID=PL-R-AFR-20261104
PROTOCOL_REVISION=91727041cddcedcdd83903617d4061de78473a8c
CASE_ID=AFR-01
REPOSITORY=fanilosendrison/proto-lithify
STARTING_ARTIFACT_SHA=09214e07e7095dd3cd9b8fc31e68a3878ac07e76
OBSERVATION_TIME=2026-11-05T11:10:29Z
OBSERVATION_END=2026-11-05T11:15:46Z
EVALUATOR_PUBLIC_READ_START=2026-11-05T11:21:45Z
EVALUATOR_PUBLIC_READ_END=2026-11-05T11:24:56Z
AUTHORIZED_SURFACES=Public GitHub commit/history objects; PR metadata, comments
  and reviews; Issue bodies, comments and native relationships; linked public
  Project information; versioned repository documentation; directly linked
  public evidence.
INVESTIGATOR_CONTEXT=Generic research instructions and the repository/exact-SHA
  pair were the only case-specific starting input; no PR, Issue, descriptive
  case label, or historical report was supplied as a discovery hint.
INVESTIGATOR_MODE=NON_BLIND_EXPLORATORY
EVALUATION_DISPOSITION=PARTIAL
```

The input boundary is controller-attested; a verbatim initiating prompt is not
published here. Technical confinement from controller material was not
established, so this assessment does not claim blindness. Initialization
carried no research subject.

Investigator session: `01a1ab66-3540-7843-9c1f-2f1bc0960047`. Effective
metadata observed before and after investigation identified provider
`openai-codex-1`, model `gpt-6.1-sol`, thinking `xhigh`, and the `bash` tool.
Context files, skills, prompt templates, and discovered extensions were
disabled; an existing provider extension remained enabled. Invocation identity
was `NOT_EXPOSED`.

Independent evaluator session: `01a1ab6f-ffe2-7dbc-8f12-ba3529db5b67`. Its
supplied pre-evaluation metadata identified the same provider/model/thinking
configuration and `read`/`bash` tools. No evaluator post-review runtime state
is claimed.

This report follows the [accepted protocol][PROTOCOL] and [report
template][TEMPLATE]. It is an evaluator-authored assessment of one frozen
exploratory investigation, not a completed six-case synthesis.

## Dimension assessment

`VERIFIED` below concerns only the stated identity, published content, or
association. It does not authenticate every substantive assertion within a
record.

DIMENSION | CLASSIFICATION | OBSERVED_IDENTITY | EVIDENCE_URL | OBSERVATION | LIMITATION
--------- | -------------- | ----------------- | ------------ | ----------- | ----------
D01 EXACT_ARTIFACT_IDENTITY | VERIFIED | Commit `09214e07e7095dd3cd9b8fc31e68a3878ac07e76`; public repository ID `1367065261` | [Commit][C]; [repository API][REPO] | GitHub returns the exact commit, two parents, tree, dates, signature metadata, statistics, and 14 changed paths. | Provider metadata was checked; mission intent and implementation correctness do not follow.
D02 ARTIFACT_TO_PR | VERIFIED | PR #26, ID `5023223629` | [Association endpoint][ASSOC]; [PR #26][P26] | The association endpoint returns #26; merged PR metadata names the exact artifact and matching base/head parents. Its timeline records that merge. | One candidate was returned within the examined collection; no universal association-recovery claim follows.
D03 ARTIFACT_TO_WORK | VERIFIED | Issue #7, ID `5539834944`; work ID `proto-lithify-issue7-residual-robustness-closure-20261026` | [Issue #7][W7]; [PR #26][P26]; [final report][FINAL] | PR text and the native closing reference identify #7. Its final report identifies the exact artifact. | This verifies the published work association, not a complete original mission or authorization.
D04 WORK_TO_INSTRUCTION | VERIFIED | Current Issue #7 contract; `AGENTS.md` at baseline `33a0db79e04677be7b366f63563299fc2bcd2f24` | [Issue #7][W7]; [baseline directives][AGENTS] | The published contract and explicitly referenced baseline contributor instructions were recovered. | Actual historical delivery/receipt, earlier Issue-body versions, and the separate implementation task remain unproved.
D05 WORK_TO_CONTEXTUAL_SOURCES | REFERENCED_NOT_VERIFIED | Two external references; transfer and review artifacts named by hashes | [Issue #7][W7]; [PR #26][P26]; [final report][FINAL] | The records associate external documentation and claimed transfer/review materials with the work. | External content and unpublished artifact bytes were not recovered; historical availability to the executor is unproved.
D06 WORK_TO_EXECUTION_REPORT | VERIFIED | Issue comments `6422386893` and `6425340115`; exact-SHA CI runs | [STOP report][STOP]; [final report][FINAL]; [main CI][MAINCI] | Work-linked STOP and final reports exist. Provider run/job records separately establish the observed candidate/main CI outcomes. | Local test totals, transfer checks, and no-publication assertions remain actor-reported.
D07 WORK_TO_DECISIONS_AND_REVIEWS | VERIFIED | Published review summaries for earlier and final candidates; correction commit `c762ece36fcf86234ce6d24c9c446ad2c7a007a8` | [PR #26][P26]; [final report][FINAL]; [correction][HEAD] | Review-summary content and candidate identities are observable; GitHub confirms the intervening test correction. | Native reviews and inline comments were empty. External reviewer identity, packets, and final GO were not independently authenticated.
D08 WORK_TO_CHANGE_HISTORY | VERIFIED | Thirteen PR commits; prerequisite merge `2acf402e315d96fa27d748844cf4836953884dec`; final head | [PR commits][COMMITS]; [PR #25][P25]; [correction][HEAD] | The parent-linked PR history reaches the final head from the prerequisite integration baseline. | Git history does not establish unpublished local execution history or preserved-worktree bytes.
D09 WORK_TO_CONTINUATION_INFORMATION | VERIFIED | STOP condition; Issue #24; PR #25; final Issue #7 report | [STOP report][STOP]; [Issue #24][W24]; [PR #25][P25]; [final report][FINAL] | Published records describe the stopping condition and continuation; the prerequisite merge is the artifact’s exact first parent. | Separate authorization delivery and historical transfer integrity remain unverified.
D10 PROJECT_AND_NATIVE_RELATIONSHIPS | VERIFIED | Project #9 `PVT_kwHOAdFdvs4BkT5y`; item `PVTI_lAHOAdFdvs4BkT5yzg8Ivu8`; closing/blocker relationships | [Project #9][PROJECT]; [Issue #7][W7]; [blockers API][BLOCKERS]; [GraphQL][GQL] | Native projections connect #26 to #7, #25 to #24, and #7’s Project item to #26. Four native blockers were returned. | Current Project fields are not a complete historical record; projected relationships do not prove substantive completion.

## Exact discovery sequence

The investigator began with the repository and exact merge SHA. The operational
boundary was public read-only retrieval, at most 100 logical API invocations,
one API invocation per API-bearing bash command, explicit REST GET or pure
GraphQL query, no automatic pagination, and at most three
relationship-discovery hops. These instructions are summarized rather than
reproduced as an initiating prompt.

The source artifact was fixed; no alternate case or investigation rerun was
used. In actual order:

1. **E01:** [Exact commit API][COMMITAPI]; output exceeded the display limit.
2. **E02:** Same commit endpoint, projected to identity, metadata, statistics,
   and changed paths.
3. **E03:** [Commit-associated PRs][ASSOC]; one candidate, #26.
4. **E04:** [PR #26 metadata][PRAPI]; merged state, exact merge/base/head
   identities, and body.
5. **E05:** [PR #26 commits][COMMITS]; 13 commits and parent links.
6. **E06:** [Issue #7 API][ISSUEAPI], following `Closes #7`.
7. **E07:** [Issue #7 comments][WORKCOMMENTS]; STOP and final reports.
8. **E08:** [Repository metadata][REPO]; public visibility and repository
   identity.
9. **E09:** [PR discussion comments][DISCUSSION]; empty.
10. **E10:** [Native reviews][REVIEWS]; empty.
11. **E11:** [Inline review comments][INLINE]; empty.
12. **E12:** [GraphQL][GQL] projections of #26/#7 closing references, Project
    membership, sub-issues, and tracked-in Issues.
13. **E13:** [Issue #7 timeline][WORKTIMELINE]; output exceeded the display
    limit.
14. **E14:** Same timeline, narrower projection; 23 events.
15. **E15:** [PR #26 timeline][PRTIMELINE]; 17 events, including exact-SHA
    merge and branch deletion.
16. **E16:** [Baseline `AGENTS.md`][AGENTSAPI], referenced by #7.
17. **E17:** [Baseline-root `code-implementation.md`][MISSING]; HTTP 404.
18. **E18:** [Issue #24][W24], directly referenced by PR #26 and work records.
19. **E19:** [Issue #24 comments][PRECOMMENTS]; publication/review summary.
20. **E20:** [PR #25][P25]; prerequisite merge matches the starting artifact’s
    first parent.
21. **E21:** GraphQL retrieval of Project `PVT_kwHOAdFdvs4BkT5y` and item
    `PVTI_lAHOAdFdvs4BkT5yzg8Ivu8`.
22. **E22:** [Issue #7 native blockers][BLOCKERS]; #2, #3, #4, and #8.
23. **E23:** [Run `40384949899`][FAILCI]; failed pull-request event on the
    earlier candidate.
24. **E24:** [Run `40386077214`][HEADCI]; successful pull-request event on the
    final head.
25. **E25:** [Run `40386675025`][MAINCI]; successful push event on the exact
    merge artifact.
26. **E26:** [Failed-run jobs][FAILJOBS]; Tests failed and later validation
    steps were skipped.
27. **E27:** [Exact-main jobs][MAINJOBS]; listed validation steps succeeded.
28. **E28:** [Final-head commit][HEAD]; one-file test correction and tree
    equality with the merge artifact.
29. **E29:** GraphQL retrieval of the earlier candidate tree and PR #25’s
    native closing reference.
30. **E30:** [PR #25 files][PREFILES]; two cancellation-test files.
31. **E31:** [Prerequisite push CI][PRECI]; success on the exact prerequisite
    merge.
32. **E32:** Exact-artifact commit endpoint projected to documentation/package
    patches.
33. **E33:** GraphQL projection of the linked Project item’s Pull Request
    field; exactly #26.

REST collections explicitly requested `per_page=100&page=1`. GraphQL
connections declared bounded sizes and exposed page information. No automatic
pagination was observed.

Hop accounting was admissible: artifact/repository at hop 0; associated PR #26
at hop 1; work #7 and directly PR-linked prerequisite #24 at hop 2; linked
instructions, Project, runs, and continuation PR #25 at hop 3. Comments,
reviews, jobs, files, and native relationship projections were containment
reads, not permission for further downstream exploration. No fourth-hop object
was investigated.

Unexamined surfaces included repository-wide searches, Project-wide item
collections, historical Issue-body revisions, complete Project field history,
external documentation content, CI logs, and unpublished
authorization/review/transfer materials.

## Artifact and PR identity verification

Independent reads confirmed:

- Repository: `fanilosendrison/proto-lithify`, ID `1367065261`, public.
- Artifact: `09214e07e7095dd3cd9b8fc31e68a3878ac07e76`.
- First parent: `2acf402e315d96fa27d748844cf4836953884dec`.
- Second parent/final PR head: `c762ece36fcf86234ce6d24c9c446ad2c7a007a8`.
- Tree: `12bab7de0036619a2805f30c9f15d67c1b410122`.
- Author and committer date: `2026-10-26T19:25:51Z`.
- GitHub signature metadata: `verified=true`, reason `valid`.
- Change statistics: 14 files, 1,327 additions, 93 deletions.
- PR #26: ID `5023223629`, merged at `2026-10-26T19:25:52Z`, exact matching
  merge/base/head identities.

The commit message names PR #26, but association was not inferred from that
message alone: the [association endpoint][ASSOC], [PR metadata][P26], and
[merge timeline][PRTIMELINE] independently agree.

The controller’s expected PR was used only as an evaluation oracle.
Investigator E03–E04 had already recovered #26; the oracle contributes no
recovery credit.

Changed paths were `README.md`, `docs/architecture.md`, `docs/cli-contract.md`,
`docs/installation.md`, `package.json`, three files under `src/`, and six under
`tests/`. The [commit API][COMMITAPI] provides their exact identities. No
implementation was executed.

## Work and mission recovery

[Issue #7][W7], “Close residual robustness gaps in Project inspection, access
denial, and standalone activation,” contains:

```text
proto-lithify-issue7-residual-robustness-closure-20261026
```

Its current published contract groups work into:

- R1: access-denial and diagnostic-redaction coverage.
- R2: complete and terminating Project fields/views pagination.
- R3: standalone activation-failure preservation.
- R4: rejection of malformed or unsupported Project catalog observations.

PR #26 explicitly closes #7, and GraphQL returns #7 as its sole native closing
reference. The [final work report][FINAL] names both PR #26 and the exact merge
artifact.

This establishes the published engineering-work association. It does not
establish that the current Issue body equals the complete original mission,
that all instructions were historically supplied, or that the separate
implementation authorization was received.

## Instructions and sources

The investigator recovered the current [Issue contract][W7] and [contributor
directives at baseline `33a0db79e04677be7b366f63563299fc2bcd2f24`][AGENTS]. The
Issue explicitly references those directives and an applicable
`code-implementation.md`.

The contract publishes test-first obligations, offline-fixture expectations,
scope exclusions, validation/review gates, and a separate-authorization
requirement. The directives publish contributor, runtime, testing, and
validation boundaries.

**Record existence and work association are verified; historical executor
receipt is not.** No unpublished prompt was inferred from a diff.

The single tested root location for `code-implementation.md` returned:

```text
HTTP 404
message: Not Found
```

That failure applies only to the [exact path and baseline][MISSING]. The
referenced source’s actual location/version remains unresolved.

Issue #7 cites:

- <https://docs.github.com/en/graphql/reference/projects>
- <https://github.blog/changelog/2026-08-07-connecting-issues-and-multi-select-field-support/>

Their R4 association is observable. Their content was not retrieved, and their
availability to the historical executor was not established.

PR #26 and the final report also name transfer and review artifacts by hashes.
These are recoverable references, not recovered bytes or authenticated
historical delivery.

## Execution reports and review evidence

The [STOP report][STOP], comment `6422386893`, was posted at
`2026-10-26T17:07:32Z`. It reports that:

- R1 baseline fixtures passed, so this was coverage-only rather than a newly
  reproduced defect.
- R2–R4 counterexamples motivated bounded corrections.
- Repeated qualification encountered cancellation-test uncertainty.
- Publication stopped and resumption required separately authorized
  cancellation-test repair.

The published report and its association are verified. Its local execution
transcript, preservation assertions, and no-publication assertion were not
independently reconstructed.

The [final report][FINAL], comment `6425340115`, was posted at
`2026-10-26T19:27:25Z`. It reports 20/20 focused tests and three
unchanged-source full-suite passes of 172/172, along with transfer checks and
review GO. Those local totals and unpublished-byte assertions remain
actor-reported.

Independent GitHub run reads establish:

- [Run `40384949899`][FAILCI]: `pull_request` event, candidate
  `e8a8d06e1e323e53a0ab7c906b89e1a27420793d`, conclusion `failure`. Its [job
  projection][FAILJOBS] records failure at Tests.
- [Run `40386077214`][HEADCI]: `pull_request` event, final head
  `c762ece36fcf86234ce6d24c9c446ad2c7a007a8`, conclusion `success`.
- [Run `40386675025`][MAINCI]: `push` event on `main`, exact artifact
  `09214e07e7095dd3cd9b8fc31e68a3878ac07e76`, conclusion `success`. Its [job
  projection][MAINJOBS] records successful installation, lint, typecheck,
  tests, build, standalone qualification, and diff check.

The run objects returned empty `pull_requests` arrays. Their event types and
exact candidate identities were observed; a populated native run-to-PR array
was not.

The provider records do not independently establish all local repetitions,
reported test totals, or the report’s ext4 inode-reuse explanation. No CI logs
were examined.

## Decisions, corrections and continuation

The [STOP report][STOP] specifies a resumption condition rather than silently
expanding scope. [Issue #24][W24] and [PR #25][P25] publish the separately
scoped cancellation-test prerequisite.

PR #25:

- Natively closes #24.
- Merged as `2acf402e315d96fa27d748844cf4836953884dec`.
- Changes only `tests/gh-process-cancellation.test.ts` and
  `tests/gh-process-control.test.ts`.
- Has successful [push CI][PRECI] on that exact merge.

That merge is the starting artifact’s first parent. This verifies integration,
not the unpublished transfer process.

The [final correction commit][HEAD] changes a launcher-replacement fixture from
removal/recreation to creation of a replacement symlink followed by rename. Its
tree equals the merge artifact’s tree.

Two review-summary identities remain distinct:

- [PR #26][P26]: earlier candidate `e8a8d06e1e323e53a0ab7c906b89e1a27420793d`,
  tree `45eca062a62d1d8f3eff51881ea2aad37ad22359`, packet hash
  `531c2069df23ef31ad68a1d11e46e25fdfbf72ae1706d1376d0506a97ce2631f`.
- [Final Issue report][FINAL]: candidate
  `c762ece36fcf86234ce6d24c9c446ad2c7a007a8`, tree
  `12bab7de0036619a2805f30c9f15d67c1b410122`, packet hash
  `128a42d92dbdd638867d7f4b665d9615bd76aa2e434844b1c5cbce31f9f008e4`.

Both summaries report `gpt-5.6-sol`, `xhigh`, and GO. These are historical
actors’ published claims, not the observed investigator/evaluator model
metadata. The earlier summary does not authenticate final-candidate review.

A further documentary difference persists: Issue #7 requests cleanup of owned
temporary activation links, while [final installation documentation][INSTALL]
describes intentional non-deleting quarantine. The evolution is observable; an
underlying approval discussion was not recovered.

## Empirical extraction from observed engineering practice

### Directly observed records and changes

- **Redundant association surfaces:** commit parents, PR metadata, native
  closing references, and timelines agree on the artifact-to-work chain.
  Recovery remained possible after recorded branch deletion. Sources:
  [commit][C], [PR #26][P26], [timeline][PRTIMELINE]. Limitation: this is one
  case, not a measured reliability effect.
- **Publication of negative outcomes:** the [STOP report][STOP] preserves an
  already-safe R1 result and a failed qualification gate. The observed practice
  is publication of those distinctions; the underlying local runs were not
  authenticated.
- **Explicit continuation linkage:** [#24][W24], [#25][P25], and the [final
  report][FINAL] retain a cross-work continuation narrative, corroborated by
  the exact integration parent. Preserved-worktree and transfer-byte claims
  remain unverified.
- **Corrective test change:** [commit
  `c762ece36fcf86234ce6d24c9c446ad2c7a007a8`][HEAD] contains a concrete fixture
  correction. Failed and successful provider runs bracket the two candidates.
  This does not independently establish the reported filesystem root cause.
- **Review through textual summaries:** [PR #26][P26] and the [final
  report][FINAL] publish external-review summaries while [native
  reviews][REVIEWS] and [inline comments][INLINE] are empty. This is an
  observed alternative recording arrangement, not evidence that no review
  occurred.
- **Useful Project indirection:** [Issue #7’s Project item][PROJECT] links #26
  although #26 has no direct Project item. This supplied an additional
  observable relationship without a Project-wide search.
- **Practical recovery friction:** the investigator reconciled two
  review-summary identities and repeated two API reads with narrower
  projections after output truncation. Historical manual effort and
  unnecessary-work counts were not measured.
- **Missing evidence and contract drift:** hash-only packet references do not
  supply their bytes; the instruction-to-quarantine change lacks a recovered
  approval trail. Sources: [Issue #7][W7], [PR #26][P26], [final
  report][FINAL], [installation documentation][INSTALL].

### Interpretations and non-normative hypotheses

These are evaluator interpretations of already recovered evidence, not
additional investigator discoveries:

- Redundant exact-identity links may support recovery after branch deletion.
  Counterexample: redundancy did not recover unpublished review packets or
  instruction receipt.
- Candidate-specific review pointers may reduce reconciliation ambiguity.
  Counterexample: existing history already identifies the final artifact
  without authenticating the final review.
- Published STOP conditions and integration identities may support continuation
  across separately scoped work. Counterexample: the original authorization and
  transfer integrity remain unverified.

No candidate mechanism is selected. Existing alternatives include narrative
Issue comments, PR summaries, Git history, provider CI records, and native
Project links. The case does not establish that one arrangement is necessary or
causally superior.

## GitHub Project observations

During the investigator window and independent evaluator reread:

- Public [Project #9, “Proto-Lithify Engineering”][PROJECT] had ID
  `PVT_kwHOAdFdvs4BkT5y`.
- Issue #7 had one non-archived item, `PVTI_lAHOAdFdvs4BkT5yzg8Ivu8`.
- Observed fields were `Status=Done`, `Kind=Follow-up`, and `Priority=P1`.
- The item’s Pull Request field contained exactly #26.
- PR #26 had no direct Project item.
- Issue #7 had no sub-issues or tracked-in Issues in the examined projections.
- [Native blockers][BLOCKERS] returned #2, #3, #4, and #8, all
  closed/completed.

GraphQL page information reported no further pages for these examined
connections. Project-wide items were not enumerated.

Timeline status-change events were observed, but complete historical field
values were not reconstructed. Current `Done` state does not independently
establish substantive work completion or historical instruction availability.

## Ambiguities and inaccessible sources

Three reconciliation questions remain:

1. **Final review trail:** two candidate/tree/packet identities are published,
   but the underlying packets and reviewer authentication are unavailable
   within the examined surfaces.
2. **Contract evolution:** the recovered instruction requests cleanup; final
   documentation specifies quarantine. The authorization or review discussion
   reconciling them was not recovered.
3. **Referenced instruction-source identity:** `code-implementation.md` has no
   exact recovered location/version; the sole tested baseline-root path
   returned 404.

Additional evidence gaps include actual instruction receipt, original
authorization text, local execution transcripts, transfer bytes,
external-document content, and historical completeness. These are not converted
into claims of nonexistence.

The exact auxiliary-source failure was HTTP 404 at [the tested path][MISSING].
No private source was opened. No frozen repository/artifact/PR access failure
occurred, so no campaign STOP escalation was triggered.

## Reconstruction cost measurements

The frozen trace and controller usage capture supply different measurement
scopes. Investigator costs below exclude independent evaluator retrieval.

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
    **Value:** 33 logical `gh api` invocations: 29 REST GET and 4 pure GraphQL;
    HTTP transport attempts NOT_MEASURED **Measurement provenance:** Complete
    frozen tool trace, independently counted; one API invocation per
    API-bearing bash command.

[^cost-2]:
    **Value:** 33 numbered reads, E01–E33; two narrower rereads following
    output truncation; one HTTP 404 **Measurement provenance:** Frozen
    invocation order and returned observations. No repository-wide search or
    automatic pagination observed.

[^cost-3]:
    **Value:** 526.593 seconds substantive; 586.222 seconds whole session; 317
    seconds public-observation interval **Measurement provenance:** Runtime
    usage capture for substantive/session durations; two trace date outputs for
    the 317-second interval.

[^cost-4]:
    **Value:** 35: 33 API-bearing bash calls and 2 date-only bash calls
    **Measurement provenance:** Frozen trace contains 35 matched starts and
    ends.

[^cost-5]:
    **Value:** Capture category `input=56,497`; `cacheRead=1,336,064`;
    `cacheWrite=0` **Measurement provenance:** Supplied whole-session runtime
    usage capture; per-phase allocation NOT_MEASURED.

[^cost-6]:
    **Value:** 15,147 **Measurement provenance:** Supplied whole-session
    runtime usage capture.

[^cost-7]:
    **Value:** NOT_MEASURED **Measurement provenance:** No verified
    subscription-charge attribution; catalog estimates are not actual charges.

[^cost-8]:
    **Value:** NOT_MEASURED **Measurement provenance:** No reliable
    intervention counter was supplied; zero is not inferred.

Whole-session elapsed time includes initialization/non-substantive overhead.
The difference from substantive time is 59.629 seconds; it is not network
latency or a manual-intervention measurement. The 317-second observation
interval excludes some preparation and report production.

The supplied token categories total 1,407,708 tokens. They include
whole-session initialization overhead; a separate initialization token
allocation was not exposed. No inference-efficiency comparison is made.

## Recovery coverage

`RECOVERY_COVERAGE`: all ten dimensions were examined. Nine retain narrowly
verified record/identity/association claims. D05 retains
referenced-but-unverified contextual materials.

Instruction records were recovered without establishing historical receipt.
Execution and review summaries were recovered without authenticating every
underlying execution or review claim. Current Project relationships were
recovered without complete historical state.

These are dimension-level outcomes within the declared boundary, not a
percentage of universal reliability. No additional investigator recovery is
credited from evaluator corroboration.

## Unknown historical completeness

`HISTORICAL_COMPLETENESS=UNKNOWN`.

The recovered records are not established as everything originally available to
the executor. Original authorization, historical Issue-body versions, actual
source delivery, unpublished review/transfer material, and complete Project
history were not recovered.

Successful artifact-to-work reconstruction does not establish complete intent,
complete execution history, or a complete historical prompt.

## Negative findings and counterexamples

- PR discussion comments, native reviews, and inline review comments were empty
  in the examined collections. External review may nevertheless have occurred.
- The exact tested `code-implementation.md` path returned 404. No conclusion
  about other paths or historical existence follows.
- Transfer and review hashes were published without recovered artifact bytes.
- The PR body retains an earlier review identity than the final Issue report.
- The published R1 baseline result was already safe, countering an assumption
  that every newly added test represented a reproduced defect.
- An initially passing baseline suite was followed by reported qualification
  failure; one pass was not treated as complete robustness evidence.
- Current native Project links aided recovery but did not supply original
  authorization or complete provenance.
- Broad commit/timeline responses exceeded output limits; narrower projections
  were required.

No absence within these surfaces is generalized to historical nonexistence.

## Evidence provenance

The supplied protocol and template were read completely. Their Git blob
identities match the independently retrieved public objects at revision
`91727041cddcedcdd83903617d4061de78473a8c`:

- Protocol blob: `828e249f9e50a274e91cc5c84c986fa62b884111`.
- Template blob: `1479cf3b193fc2790663603dc8adcb97d3810711`.

Frozen investigator provenance:

- Report SHA-256:
  `2566d5ecedba8fe2508e5f63b6c0f284e0637c4e805d5cc330b2af83bda60559`.
- Tool-trace SHA-256:
  `a860d1394db121268f87af9f9b56e7e351622c9efdf6eb275bd626422c048707`.
- Both hashes were independently checked against supplied controller metadata.
- The complete available tool trace, effective pre/post metadata, trace audit,
  and usage capture were examined. Raw session transcripts and private
  reasoning were not read.
- Investigator public observations occurred during
  `2026-11-05T11:10:29Z–11:15:46Z`; finer per-request timestamps were not
  measured.
- Independent public checks occurred during `2026-11-05T11:21:45Z–11:24:56Z`.

Public sources substantiate source-content claims; runtime capture
substantiates measurement claims. Content hashes establish frozen identity, not
substantive truth or public accessibility of the retained raw artifacts. No
inaccessible machine path is offered as public proof.

[PROTOCOL]:
  https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/protocol-v1.md
[TEMPLATE]:
  https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/report-template-v1.md
[C]:
  https://github.com/fanilosendrison/proto-lithify/commit/09214e07e7095dd3cd9b8fc31e68a3878ac07e76
[COMMITAPI]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/commits/09214e07e7095dd3cd9b8fc31e68a3878ac07e76
[REPO]: https://api.github.com/repos/fanilosendrison/proto-lithify
[ASSOC]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/commits/09214e07e7095dd3cd9b8fc31e68a3878ac07e76/pulls?per_page=100&page=1
[P26]: https://github.com/fanilosendrison/proto-lithify/pull/26
[PRAPI]: https://api.github.com/repos/fanilosendrison/proto-lithify/pulls/26
[COMMITS]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/pulls/26/commits?per_page=100&page=1
[W7]: https://github.com/fanilosendrison/proto-lithify/issues/7
[ISSUEAPI]: https://api.github.com/repos/fanilosendrison/proto-lithify/issues/7
[WORKCOMMENTS]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/issues/7/comments?per_page=100&page=1
[STOP]:
  https://github.com/fanilosendrison/proto-lithify/issues/7#issuecomment-6422386893
[FINAL]:
  https://github.com/fanilosendrison/proto-lithify/issues/7#issuecomment-6425340115
[DISCUSSION]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/issues/26/comments?per_page=100&page=1
[REVIEWS]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/pulls/26/reviews?per_page=100&page=1
[INLINE]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/pulls/26/comments?per_page=100&page=1
[GQL]: https://api.github.com/graphql
[WORKTIMELINE]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/issues/7/timeline?per_page=100&page=1
[PRTIMELINE]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/issues/26/timeline?per_page=100&page=1
[AGENTS]:
  https://github.com/fanilosendrison/proto-lithify/blob/33a0db79e04677be7b366f63563299fc2bcd2f24/AGENTS.md
[AGENTSAPI]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/contents/AGENTS.md?ref=33a0db79e04677be7b366f63563299fc2bcd2f24
[MISSING]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/contents/code-implementation.md?ref=33a0db79e04677be7b366f63563299fc2bcd2f24
[W24]: https://github.com/fanilosendrison/proto-lithify/issues/24
[PRECOMMENTS]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/issues/24/comments?per_page=100&page=1
[P25]: https://github.com/fanilosendrison/proto-lithify/pull/25
[PREFILES]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/pulls/25/files?per_page=100&page=1
[PRECI]:
  https://github.com/fanilosendrison/proto-lithify/actions/runs/40375296623
[PROJECT]: https://github.com/users/fanilosendrison/projects/9
[BLOCKERS]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/issues/7/dependencies/blocked_by?per_page=100&page=1
[FAILCI]:
  https://github.com/fanilosendrison/proto-lithify/actions/runs/40384949899
[HEADCI]:
  https://github.com/fanilosendrison/proto-lithify/actions/runs/40386077214
[MAINCI]:
  https://github.com/fanilosendrison/proto-lithify/actions/runs/40386675025
[FAILJOBS]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/actions/runs/40384949899/jobs?per_page=100&page=1
[MAINJOBS]:
  https://api.github.com/repos/fanilosendrison/proto-lithify/actions/runs/40386675025/jobs?per_page=100&page=1
[HEAD]:
  https://github.com/fanilosendrison/proto-lithify/commit/c762ece36fcf86234ce6d24c9c446ad2c7a007a8
[INSTALL]:
  https://github.com/fanilosendrison/proto-lithify/blob/09214e07e7095dd3cd9b8fc31e68a3878ac07e76/docs/installation.md

## Independent evaluation

**Disposition: PARTIAL. Structural validation: FAIL. Evidence validation: PASS
for the precise bounded claims.**

The frozen report identifies the correct repository/artifact and contains
exactly ten correctly named dimension assessments with accepted statuses. It
does not follow the prescribed report structure, omits study/protocol/case
metadata, lacks the complete eight-quantity cost presentation, and does not
directly provide all required dimension-table fields. This draft supplies an
evaluator-authored presentation without changing the frozen submission.

Original-to-final status review:

- **D01:** `VERIFIED → VERIFIED`. Exact repository and commit metadata
  independently match.
- **D02:** `VERIFIED → VERIFIED`. Association endpoint, PR metadata, parents,
  and merge event agree.
- **D03:** `VERIFIED → VERIFIED`. Explicit/native #7 association and final
  exact-artifact reference match.
- **D04:** `VERIFIED → VERIFIED`. The original claim concerns published
  instruction records and expressly excludes proven receipt.
- **D05:** `REFERENCED_NOT_VERIFIED → REFERENCED_NOT_VERIFIED`. References
  exist; underlying external/unpublished materials and historical supply remain
  unverified.
- **D06:** `VERIFIED → VERIFIED`. Report existence/association and provider CI
  facts are supported; local assertions remain attributed.
- **D07:** `VERIFIED → VERIFIED`. Published summaries and corrections exist;
  external review authenticity was not originally claimed as independently
  established.
- **D08:** `VERIFIED → VERIFIED`. The 13-commit chain, prerequisite
  integration, and final correction match.
- **D09:** `VERIFIED → VERIFIED`. Published STOP/continuation records and exact
  integration relationship match.
- **D10:** `VERIFIED → VERIFIED`. Native closing, blocker, Project-item, and
  PR-field relationships independently match current projections.

There are **zero unsupported dimension-level VERIFIED claims** and **zero
classification corrections**.

A descriptive declaration is corrected: public patch material was inspected,
including the deliberately retrieved E28 test patch. The trace does not support
the blanket statement that no repository code was inspected. It does support no
observed local repository inspection, source execution, mutation, or
private-source access.

The complete trace confirms 33 logical API invocations and 35 tool calls, with
no observed request-ceiling or hop breach. Successful API execution was not
treated as qualification.

Three unresolved reconciliation ambiguities remain: final review evidence,
cleanup-to-quarantine authorization, and the referenced instruction file’s
identity/location. Other missing historical evidence remains explicitly
unknown.

**EVALUATOR_ONLY_DISCOVERY: 0 new case-source findings.** Independent source
corroboration, controller identity checks, runtime supplements, and explicitly
labeled evaluator hypotheses are not investigator recovery.

Frozen report identity:
`2566d5ecedba8fe2508e5f63b6c0f284e0637c4e805d5cc330b2af83bda60559`. Frozen
trace identity:
`a860d1394db121268f87af9f9b56e7e351622c9efdf6eb275bd626422c048707`.

## Bounded conclusion

The investigation recovered a substantiated public chain:

**exact artifact → PR #26 → Issue #7 → published instruction records,
STOP/final reports, prerequisite #24/#25, change history, and exact-SHA CI
observations.**

It did not establish actual instruction receipt, complete historical
authorization, unpublished transfer integrity, authenticated external review,
or historical completeness.

The frozen submission remains **PARTIAL** because of reporting noncompliance;
its narrow association findings remain supported. No evaluator-only source
recovery is added to that conclusion.

Practices worth retaining as empirical observations include exact-identity
cross-links, explicit negative-outcome reporting, traceable prerequisite
integration, and the distinction between provider CI facts and actor-reported
local qualification. Candidate explanations about redundancy,
candidate-specific review pointers, and continuation records remain hypotheses.

These observations retain research value without Lithify adoption.
Proto-Lithify owns empirical extraction; Lithify owns independent derivation
and adoption. No accepted requirement, architecture, Product Intent amendment,
new CLI capability, causal inference, representative sampling claim, universal
reliability percentage, or historical-completeness claim follows.
