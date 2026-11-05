---
okf_version: "1.0"
kind: KnowledgeAsset
asset_type: research-case-assessment
domain: proto-lithify
severity: guideline
name: "AFR-02 empirical case assessment"
version: "0.1.0"
---

# AFR-02 — Artifact-first recoverability assessment

## Case metadata

```text
STUDY_ID=PL-R-AFR-20261104
PROTOCOL_REVISION=91727041cddcedcdd83903617d4061de78473a8c
CASE_ID=AFR-02
REPOSITORY=fanilosendrison/ruu
STARTING_ARTIFACT_SHA=621281abaa37259be6b9e2fa48bb80e40e36cd33
OBSERVATION_TIME=2026-11-05T11:31:19Z–2026-11-05T11:38:27Z
EVALUATOR_PUBLIC_OBSERVATION_TIME=2026-11-05T11:44:14Z–2026-11-05T11:46:03Z
AUTHORIZED_SURFACES=Public GitHub commit/history objects; PR
  metadata/comments/reviews; Issue bodies/comments/timelines/native
  relationships; public Projects; versioned documentation; directly linked
  public evidence and Actions records
INVESTIGATOR_CONTEXT=Fresh session; repository and exact merge SHA were the
  only initial case-specific inputs; generic read-only recovery instructions
  and runtime metadata were also supplied
INVESTIGATOR_MODE=NON_BLIND_EXPLORATORY
EVALUATION_DISPOSITION=PARTIAL
```

The governing
[protocol](https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/protocol-v1.md)
and
[template](https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/report-template-v1.md)
are identified at the integrated revision above.

The frozen report omitted the study identifier, protocol revision and case
identifier. Their inclusion here is evaluator/controller provenance
supplementation, not investigator recovery.

The investigator session was `01a1ab7a-1495-7940-bb28-4b80286deaf9`, using
provider `openai-codex-1`, model `gpt-6.1-sol`, thinking `xhigh`, and bash.
Pre/post runtime observations agree on that configuration. Context files,
skills, prompt templates and discovered extensions were disabled; the existing
provider-login extension remained enabled.

Initialization carried no subject. No controller PR/Issue identifiers or
descriptive case labels were supplied as initial discovery hints. Technical
confinement from controller material was not established; the run therefore
remains `NON_BLIND_EXPLORATORY`, not `BLIND`.

## Dimension assessment

Every `VERIFIED` classification below applies only to the stated identity,
published content or association.

DIMENSION | CLASSIFICATION | OBSERVED_IDENTITY | EVIDENCE_URL | OBSERVATION | LIMITATION
--------- | -------------- | ----------------- | ------------ | ----------- | ----------
D01 EXACT_ARTIFACT_IDENTITY | VERIFIED | `fanilosendrison/ruu@621281abaa37259be6b9e2fa48bb80e40e36cd33` | [Exact commit](https://github.com/fanilosendrison/ruu/commit/621281abaa37259be6b9e2fa48bb80e40e36cd33) | GitHub resolves the exact commit, ordered parents, tree and six-file change inventory. | GitHub signature status was observed, not independently cryptographically checked.
D02 ARTIFACT_TO_PR | VERIFIED | PR #66; PR ID `5035140349` | [Commit association](https://api.github.com/repos/fanilosendrison/ruu/commits/621281abaa37259be6b9e2fa48bb80e40e36cd33/pulls?per_page=100&page=1); [PR](https://github.com/fanilosendrison/ruu/pull/66) | The association endpoint returns #66; PR merge SHA equals the artifact, with matching base/head and ordered merge parents. | One candidate was returned on the examined association surface; no universal uniqueness claim follows.
D03 ARTIFACT_TO_WORK | VERIFIED | Issue #63; Issue ID `6036562766` | [Work](https://github.com/fanilosendrison/ruu/issues/63); [final receipt](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6445422947) | PR text explicitly references #63; the native timeline and final receipt corroborate the association. | This is an explicit work association, not an automatically closing PR relationship.
D04 WORK_TO_INSTRUCTION | VERIFIED | Issue #63 body and authorization comment `6413112725`, with later phase gates | [Phase A authorization](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6413112725) | Public, work-specific instructional content exists within the associated Issue. | Actual delivery to a historical executing agent is not established.
D05 WORK_TO_CONTEXTUAL_SOURCES | VERIFIED | `proto-ring#72`; receipt `6408854256`; provider commit `4ae1a2a549d7dae8e4cce7f727b9bc5330f3823f` | [Predecessor receipt](https://github.com/fanilosendrison/proto-ring/issues/72#issuecomment-6408854256); [provider commit](https://github.com/fanilosendrison/proto-ring/commit/4ae1a2a549d7dae8e4cce7f727b9bc5330f3823f) | The work explicitly references these public contextual identities, which resolve. | Agent availability/receipt, migration truth, provider safety and ADR-094 interpretation were not independently established.
D06 WORK_TO_EXECUTION_REPORT | VERIFIED | Published phased reports and final receipt; main run `40525087081` | [B2.3 report](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6442583456); [main CI](https://github.com/fanilosendrison/ruu/actions/runs/40525087081) | Work-associated execution reports exist; GitHub independently records successful qualification on the exact final SHA. | Local execution claims were not reproduced; CI success does not validate every assertion in the reports.
D07 WORK_TO_DECISIONS_AND_REVIEWS | VERIFIED | STOP/GO records including `6420289495` and `6445013004` | [B1 STOP review](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6420289495); [merge review](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6445013004) | Published findings, corrective instructions and merge decisions are associated with #63. | All 37 observed comments use one GitHub account; separate reviewer identities and independence are unproved.
D08 WORK_TO_CHANGE_HISTORY | VERIFIED | Three PR commits; synthetic merge `d866f73528dfbd5c4590dc9fe03b38c26e2f853b`; final artifact | [PR commits](https://api.github.com/repos/fanilosendrison/ruu/pulls/66/commits?per_page=100&page=1); [synthetic merge](https://github.com/fanilosendrison/ruu/commit/d866f73528dfbd5c4590dc9fe03b38c26e2f853b) | Published parent chains and candidate/synthetic/final tree equality are recoverable. | Earlier local patch hashes and uncommitted-state assertions were not independently reproduced.
D09 WORK_TO_CONTINUATION_INFORMATION | VERIFIED | Native child Issue #67; Issue ID `6062321120` | [Native children](https://api.github.com/repos/fanilosendrison/ruu/issues/63/sub_issues?per_page=100&page=1); [continuation](https://github.com/fanilosendrison/ruu/issues/67) | Native containment and #67’s body establish a post-#63 continuation beginning from the exact artifact. | Its 50 comments and complete subsequent history were not examined.
D10 PROJECT_AND_NATIVE_RELATIONSHIPS | VERIFIED | Project #3 `PVT_kwHOAdFdvs4Bi-ti`; item `PVTI_lAHOAdFdvs4Bi-tizhDiiCg` | [Public Project](https://github.com/users/fanilosendrison/projects/3); [GraphQL source](https://api.github.com/graphql) | Issue #63 belongs to the public Project with Status Done; native child and timeline relationships resolve; PR closing-issue references are empty. | These are observed current/native records, not a complete historical Project reconstruction.

## Exact discovery sequence

The investigator’s case-specific starting input was the repository and exact
merge SHA. The task boundary authorized public read-only reconstruction, at
most 100 logical API requests, one `gh api` command per bash invocation,
explicit REST GET or pure GraphQL queries, no automatic pagination, and at most
three relationship-discovery hops.

Verbatim private task instructions are not published here. Their exact text and
generic prompt hashes were not available in the authorized evidence files
examined by this evaluator; no values are invented.

The complete recorded trace contains 45 paired bash calls. The following
numbering counts its 43 API invocations, excluding two UTC clock reads:

1. **Requests 1–2:** Starting commit, first broadly and then through a compact
   projection after display truncation.
2. **Request 3:** Starting commit’s associated-PR collection, page 1,
   `per_page=100`.
3. **Requests 4–5:** PR #66 metadata and its three-commit collection.
4. **Request 6:** Issue #63, encountered through the PR.
5. **Request 7:** Pure GraphQL query for repository visibility, PR
   closing-Issue references and PR/Issue Project membership.
6. **Requests 8–16:** Issue #63 comments, explicitly requested pages 1–8 with
   five comments per page. Page 3 was reread after truncation. Later displays
   omitted fenced diffs/JSON while retaining narrative and identities.
7. **Requests 17–18:** PR #66 and Issue #63 timelines, page 1, `per_page=100`.
8. **Requests 19–21:** Formal PR reviews, PR discussion comments and inline
   review comments; all returned empty collections.
9. **Requests 22–24:** Exact Project item, #63 native children and continuation
   Issue #67.
10. **Requests 25–28:** Actions runs `40268008912`, `40515353953`,
    `40516774315`, `40525087081`.
11. **Requests 29–32:** Those runs’ explicitly bounded job collections,
    retaining both PR attempts.
12. **Requests 33–37:** Five job logs, locally filtered for selected timing,
    provider, checkout and failure lines.
13. **Request 38:** Referenced synthetic merge commit.
14. **Requests 39–42:** Public provider repository, predecessor Issue #72, its
    exact cited receipt and the directly referenced provider commit.
15. **Request 43:** Starting commit’s comments; empty.

Hop accounting was artifact **0**, associated PR **1**, associated work **2**,
and directly linked context/continuation **3**. Comments, reviews, jobs and
native relationships were containment projections, not permission to traverse
another downstream relationship. The provider Issue, receipt, commit, CI
records and continuation were directly referenced within already encountered
records. No fourth-hop object was opened.

The trace shows 41 explicit REST GETs and two pure GraphQL queries, one API
command per API-bearing bash invocation, no automatic pagination and no
mutation. The five Python snippets parse returned public text; they do not
execute repository source.

Unexamined surfaces include #67’s comments, downstream objects #68/#70/#73/#74,
ADR-094’s underlying document, private conversations and local-only packet
originals. The complete recorded trace itself includes two originally truncated
displays; unavailable omitted bytes were not reconstructed from unrelated local
files.

The evaluator subsequently made 25 separate public GitHub API reads, including
two authority-document checks. These were independent validation, not an
investigation rerun or additional investigator recovery.

## Artifact and PR identity verification

The exact
[starting commit](https://github.com/fanilosendrison/ruu/commit/621281abaa37259be6b9e2fa48bb80e40e36cd33)
has:

- First parent: `42cb2cb25a879f38478b50353b8da7bf587eb1d8`.
- Second parent: `319962ebb6cf14278a6abbeb91495266c1159b54`.
- Tree: `d1f7e2dfca0dbc711730dd1421b8780b6f5000ec`.
- Commit date: `2026-10-27T14:50:49Z`.
- Six changed files, 673 additions and 148 deletions.
- GitHub-reported signature status `verified=true`, reason `valid`.

[PR #66](https://github.com/fanilosendrison/ruu/pull/66), titled
“perf(proto-ring): amortize native provider custody,” has PR ID `5035140349`
and merge time `2026-10-27T14:50:50Z`.

Independent commit-association and PR reads establish that its merge SHA equals
the starting artifact, its base equals the first parent and its head equals the
second parent. This is stronger than matching a title or interpreting the merge
message.

The investigator retrieved this association in request 3. The evaluator’s
expected-PR oracle was used only to check the recovered result.

## Work and mission recovery

[Issue #63](https://github.com/fanilosendrison/ruu/issues/63), “Reduce native
Proto-Ring qualification overhead without weakening provider custody,” is the
recovered work record.

The PR says it “addresses #63” and “Refs #63.” The
[Issue timeline](https://api.github.com/repos/fanilosendrison/ruu/issues/63/timeline?per_page=100&page=1)
contains a PR cross-reference, and the
[final receipt](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6445422947)
names the PR, candidate, merge parents and tree.

The published mission is to measure native-provider qualification costs and
remove redundant work without weakening custody, authority, identity or
fail-closed guarantees. This mission comes from the work record, not inference
from the diff.

Issue #63 is closed with reason `completed`. Its published acceptance assertion
is `11/11 PASS`; that assertion is not independently adopted as proof of all
underlying criteria.

GraphQL returns no PR closing-Issue references. Explicit association is
therefore recoverable despite the absence of automatic closing semantics.

## Instructions and sources

The work contains a public sequence of phase-specific instructions:

- [Phase A](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6413112725):
  diagnostic profiling before optimization.
- [A2](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6416115739):
  censored baseline and bounded diagnostic counterfactual, not qualification
  evidence.
- [A2.3](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6417126527):
  one evidence-sink substitution with a recorded proof boundary.
- [B1](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6418671299):
  bounded process-scoped realization experiment.
- [B1 STOP/refinement](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6420289495):
  complete diff and per-call execution snapshots.
- [B2](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6421105942)
  and
  [carrier supplement](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6421137605):
  full qualification and persistent hostile-test wiring.
- [B2.1](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6425826491):
  request-duplication measurement without caching.
- [B2.2](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6436568788):
  narrowly bounded successful-result memoization.
- [B2.3](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6437976828):
  full retry, fresh environment and observational instrumentation.
- [B3A](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6442783265):
  exact-SHA publication/CI trial without merge.
- [B3B](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6445014369):
  merge topology and exact-main-SHA CI before closure.

These records establish published instructions and work association. They do
**not** establish actual historical receipt by any particular executing agent.

The contextual chain includes:

- [Predecessor migration Issue `proto-ring#72`](https://github.com/fanilosendrison/proto-ring/issues/72),
  observed closed/completed.
- Its
  [completion receipt `6408854256`](https://github.com/fanilosendrison/proto-ring/issues/72#issuecomment-6408854256),
  explicitly cited by #63.
- Exact
  [provider commit `4ae1a2a549d7dae8e4cce7f727b9bc5330f3823f`](https://github.com/fanilosendrison/proto-ring/commit/4ae1a2a549d7dae8e4cce7f727b9bc5330f3823f).
- [Baseline Actions run `40268008912`](https://github.com/fanilosendrison/ruu/actions/runs/40268008912).

The provider commit’s existence does not establish its implementation’s purity
or safety. ADR-094 is referenced and interpreted in the
[B1.1 review](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6421104890),
but its underlying document was not retrieved.

Published packet hashes and inline summaries are recoverable; standalone local
originals were outside scope. Neither investigator nor evaluator established
the executing agent’s complete source-supply bundle.

## Execution reports and review evidence

Published reports preserve both successful and unsuccessful stages:

- [A2.4 packet](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6418506315):
  censored baseline, NON_PASS diagnostic run, missing statuses, instrumentation
  conflict and reported host-precondition failures.
- [Phase-A review](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6418612769):
  corrections distinguishing diagnostic counts, production measurements and
  synthetic estimates.
- [B2 STOP report](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6424463588):
  reported `7200.011977764 s` timeout; downstream replay/smoke/clean campaigns
  were not run.
- [B2.1 report](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6427376200):
  reported 9,034 within-process duplicate requests and an unsuccessful
  reviewer-access attempt.
- [B2.2 report](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6437894053):
  reported avoided invocations and test results.
- [B2.3 report](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6442583456):
  reported two complete fresh-environment/cache campaigns, with RI times
  `3444.24532383 s` and `3498.488685361 s`; cache-specific byte telemetry
  remained unavailable.
- [Final receipt](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6445422947):
  exact merge identity and reported acceptance.

Independent GitHub checks corroborated these narrower execution facts:

- [Baseline job `121394529618`](https://github.com/fanilosendrison/ruu/actions/runs/40268008912/job/121394529618):
  successful push on baseline SHA; RI log interval `3325.1513882 s`.
- [Candidate job `122227774963`](https://github.com/fanilosendrison/ruu/actions/runs/40515353953/job/122227774963):
  successful push on candidate head; RI log interval `484.6221139 s`.
- [PR attempt 1, job `122232525826`](https://github.com/fanilosendrison/ruu/actions/runs/40516774315/job/122232525826):
  RI failure with `qualification_infrastructure_tests: VIOLATED`; later
  qualification steps skipped.
- [PR attempt 2, job `122249350743`](https://github.com/fanilosendrison/ruu/actions/runs/40516774315/job/122249350743):
  success. Both attempt logs identify checkout of synthetic merge
  `d866f73528dfbd5c4590dc9fe03b38c26e2f853b`.
- [Main job `122262354091`](https://github.com/fanilosendrison/ruu/actions/runs/40525087081/job/122262354091):
  successful qualification, replay, smoke and whitespace steps on the exact
  starting SHA.

Baseline and candidate records share workflow identity, `ubuntu-24.04` label
and CPython 3.12.8. Their log intervals support approximately **6.86×**
elapsed-time difference. This is a documentary before/after observation, not a
controlled causal benchmark or inference-efficiency comparison.

`TRANSIENT_NOT_REPRODUCED` is a published adjudication. Failure followed by
success is verified; its root cause is not.

All 37 observed #63 comments were posted through `fanilosendrison`, including
records titled “Independent … review.” Formal PR reviews and
discussion/inline-comment collections were empty. Review-record existence is
therefore verified without authenticating separate reviewer identities.

## Decisions, corrections and continuation

The published history retains explicit corrections:

- [B1 STOP review](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6420289495)
  identifies an incomplete diff and direct execution of a long-lived snapshot
  path.
- [B1.1 packet](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6420966693)
  reports the omitted untracked test file and a descriptor-bound per-call
  snapshot correction.
- [Carrier supplement](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6421137605)
  requires separately executed tests to be included in the persistent
  validation carrier.
- [Topology adjudication](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6443599349)
  accepts three published commits instead of the earlier one-commit
  instruction.
- [Retry adjudication](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6444637139)
  authorizes one unchanged PR retry while retaining failure evidence.

The public commit chain is:

```text
42cb2cb25a879f38478b50353b8da7bf587eb1d8
→ 009ebc27970e8392dfd1a9688ab8b9bad02b8335
→ 7fe3956cfb40585edeff4e2575f4274c47bb412b
→ 319962ebb6cf14278a6abbeb91495266c1159b54
```

The candidate head, synthetic merge and final merge expose the same tree,
`d1f7e2dfca0dbc711730dd1421b8780b6f5000ec`. This does not independently
reproduce the earlier local uncommitted patch hash.

[Issue #67](https://github.com/fanilosendrison/ruu/issues/67) is a native child
of #63 and explicitly starts from the final artifact. It preserves the
distinction between completed #63 acceptance and remaining local-runtime
investigation. Its subsequent discussion was not examined.

## Empirical extraction from observed engineering practice

### Observed practices

- **Identity-rich receipts aid cross-checking.** The
  [final receipt](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6445422947)
  carries exact parents, tree, candidate and CI identities that match
  independently retrieved objects. This establishes recoverable provenance
  fields, not complete execution truth.
- **Phase gates preserve changing permissions.**
  [Phase A](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6413112725),
  [B3A](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6442783265)
  and
  [B3B](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6445014369)
  distinguish profiling, publication and merge. Historical compliance with
  every instruction remains a separate question.
- **Negative evidence was retained.** The
  [B2 timeout](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6424463588)
  and
  [failed PR job](https://github.com/fanilosendrison/ruu/actions/runs/40516774315/job/122232525826)
  remain visible beside later success.
- **Corrective packets expose review friction.** The
  [B1 review](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6420289495)
  and
  [B1.1 response](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6420966693)
  preserve the reported untracked-file omission and corrective publication
  method.
- **Passing tests were not automatically persistent qualification.** The
  [carrier supplement](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6421137605)
  records an additional wiring step after separately passing hostile tests.
- **Tooling constraints required adjudication.** The
  [publication-topology record](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6443599349)
  reconciles an earlier one-commit instruction with the orchestrator’s
  three-commit output. The published topology is verified; the internal tooling
  narrative remains reported.
- **Continuation can be explicit without reopening completed scope.**
  [#67](https://github.com/fanilosendrison/ruu/issues/67) names the exact
  completed state while preserving a separate remaining problem.

### Friction, counterexamples and unexpected arrangements

[A2.1](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6416610349)
and
[A2.3](https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6417126527)
show reported reconstruction work caused by missing aggregate statuses and a
hard-coded evidence destination. No total manual-intervention count was
measured.

The [PR body](https://github.com/fanilosendrison/ruu/pull/66) retains earlier
draft/no-merge language beside later success information. Current merge
metadata and chronological decisions are necessary to interpret that
mixed-stage document.

Native automatic closing links and formal PR reviews were absent, yet explicit
Issue references, timeline events and same-account review records supported
reconstruction. This is a counterexample to treating those particular GitHub
mechanisms as necessary.

Large inline records also caused two investigator display rereads and selective
filtering. The trace establishes this retrieval friction, not the amount of
human effort expended historically.

### Interpretations and non-normative hypotheses

The following are evaluator interpretations of encountered evidence, not
additional recovered facts:

- Exact identity receipts may reduce ambiguity, but repetition across PR, Issue
  and continuation can preserve stale stages as well as useful corroboration.
- Changed-path/diff-set comparisons may expose omitted review material; the
  B1/B1.1 sequence supplies a diagnostic example, not a causal effectiveness
  estimate.
- Public Issue phase records can serve as an alternative to formal PR-review
  records for later reconstruction, while leaving reviewer independence
  unresolved.
- A durable public evidence index might reduce reconstruction friction, but it
  would not itself prove historical instruction receipt.

These remain research hypotheses. No mechanism, architecture or product
requirement is selected.

## GitHub Project observations

At both observation windows, GraphQL resolved public
[Ruu Engineering Project \#3](https://github.com/users/fanilosendrison/projects/3):

- Project ID: `PVT_kwHOAdFdvs4Bi-ti`.
- Issue #63 item: `PVTI_lAHOAdFdvs4Bi-tizhDiiCg`.
- Status: **Done**, field update `2026-10-27T15:01:56Z`.
- Phase: **Implementation**.
- Kind: **Follow-up**.
- Priority: **P1**.

The Issue timeline contains Project-addition/status events, closure and native
sub-Issue addition. PR #66 has zero Project items and zero closing-Issue
references in the examined GraphQL projections.

These observations establish the returned native state. They do not establish
all historical field values, deleted relationships or external tracking
systems.

## Ambiguities and inaccessible sources

Seven unresolved questions are retained:

1. Actual historical instruction receipt and contextual-source availability to
   the executing agent.
2. Historical completeness of recovered work records.
3. Separate reviewer identities and reviewer independence.
4. Independent truth of local profiling/testing assertions and standalone
   packet hashes.
5. Root cause and precise failing unittest of the first PR failure.
6. Underlying ADR-094 content and the correctness of its published
   interpretation.
7. Main-RI timing precision: selected log endpoints yield `481.2547010 s`; the
   final receipt states `481.2546979 s`, a 3.1-microsecond difference.

These are limits on broader claims, not competing identities requiring a
dimension-level `AMBIGUOUS` status.

No identified public source request failed during the investigator run or
evaluator checks. Local-only originals were outside scope, not failed
public-access requests. The reviewer-host access problem is reported historical
content, not an evaluator access failure.

No frozen case existence/access failure requiring campaign STOP was
encountered. Any later such failure would require explicit escalation rather
than substitution or classification as historical absence.

## Reconstruction cost measurements

Measurements concern the investigator run unless otherwise stated.

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
    **Value:** 43 logical invocations: 41 REST GET, 2 GraphQL; transport
    attempts NOT_MEASURED **Measurement provenance:** Complete paired tool
    trace and independent command audit; five log endpoints may involve
    transport redirects.

[^cost-2]:
    **Value:** 43 API steps; eight distinct #63 comment pages; two
    truncation-related rereads; five filtered job-log responses **Measurement
    provenance:** Ordered discovery trace; no automatic pagination.

[^cost-3]:
    **Value:** 669.437 s substantive; 676.002 s whole session; 428 s
    evidence-gathering window **Measurement provenance:** Runtime usage capture
    and two investigator UTC clock reads.

[^cost-4]:
    **Value:** 45 bash calls **Measurement provenance:** Complete trace: 45
    starts, 45 matching ends; 43 API calls and two clock reads.

[^cost-5]:
    **Value:** Capture input 100,942; cache-read 3,074,432; cache-write 0
    **Measurement provenance:** Actual whole-session usage capture; cache
    fields retained separately.

[^cost-6]:
    **Value:** 19,318 **Measurement provenance:** Actual whole-session usage
    capture.

[^cost-7]:
    **Value:** NOT_MEASURED **Measurement provenance:** No verified
    subscription-charge attribution; catalog/SDK estimates are not charges.

[^cost-8]:
    **Value:** NOT_MEASURED **Measurement provenance:** No reliable
    intervention ledger supplied.

The token capture totals 3,194,692 across its reported input/output/cache
fields. It includes initialization overhead; a separate initialization-token
allocation was not exposed.

Whole-session elapsed time exceeds substantive elapsed time by 6.565 seconds
outside the substantive interval, including initialization. The 428-second
interval covers evidence gathering and inter-request processing, not the whole
report-generation session or network-only latency.

Evaluator reads are separate: 25 logical public GitHub API invocations.
Evaluator token usage, monetary cost and whole-session elapsed time were not
measured here. No future evaluator post-review runtime state is claimed.

## Recovery coverage

`RECOVERY_COVERAGE`: All ten dimensions have supported, narrowly scoped
identity/content/association observations within the examined boundary. All ten
original statuses remain `VERIFIED`.

This count is not ten verified claims of substantive correctness. In
particular, instruction receipt, complete source supply, independent reviewer
identity, local execution reproduction and historical completeness were not
recovered.

The frozen report’s structural nonconformance is retained separately from this
evidence coverage. No universal reliability percentage follows.

## Unknown historical completeness

`HISTORICAL_COMPLETENESS=UNKNOWN`.

The public records do not establish that they contain every instruction,
source, execution report, decision or conversation originally available.
Complete reading of an observed comment collection is not complete historical
recovery.

No inference is made that unavailable prompts or missing records never existed.

## Negative findings and counterexamples

- Formal PR reviews, PR discussion comments, inline review comments and
  starting-commit comments were empty on the explicitly examined collections.
- PR closing-Issue references and PR Project membership were empty, despite
  corroborated work association.
- All 37 observed work comments used the same account; review titles did not
  authenticate independent authorship.
- Local-only packet originals and historical runtime prompt receipts were not
  recovered.
- ADR-094’s underlying document and #67’s comments were not examined.
- Timeline references to #68/#70/#73/#74 were observed but not followed.
- Reported local timeouts, missing telemetry and the failed first PR attempt
  remain part of the record.
- The final receipt’s exact main-RI duration was not reproduced from the
  selected public log endpoints.

These findings are scoped to the examined surfaces. They establish neither
global nonexistence nor product incompatibility.

## Evidence provenance

Frozen investigator materials were preserved and hash-checked:

```text
RAW_REPORT_SHA256=e150433382b0d484b79c186d61ecff3491df5bd94489a6cb3bf279bc727d1c4f
TOOL_TRACE_SHA256=c282be5df241c3d1f5c1a843de51838e1ae877454c892646190baa5d989225bd
```

The evaluator read the complete supplied protocol, template, frozen report,
recorded discovery trace, trace audit, pre/post runtime metadata and usage
capture. Raw session transcripts and private reasoning were not read.

The investigator runtime was observed before substantive work at
`2026-11-05T11:31:11.380924+00:00` and after the report at
`2026-11-05T11:42:20.799219+00:00`.

Independent evaluator session `01a1ab84-b95e-7802-a73b-db31764db118` used the
observed provider/model/thinking configuration `openai-codex-1` / `gpt-6.1-sol`
/ `xhigh`. Public checks occurred during the evaluator observation window
stated above.

Public traceability includes exact commit/PR/Issue/comment/run/job identities
and the linked REST/GraphQL surfaces. Frozen content hashes identify preserved
evaluation materials; they are not substitutes for publicly accessible source
objects.

**EVALUATOR_ONLY_DISCOVERY EOD-1 — authority provenance:** Public protocol and
template bytes at the integrated revision match the supplied authority files:

- Protocol Git blob `828e249f9e50a274e91cc5c84c986fa62b884111`.
- Template Git blob `1479cf3b193fc2790663603dc8adcb97d3810711`.

This grouped finding was made by the evaluator and is not credited to the
investigator’s artifact-to-work recovery.

## Independent evaluation

**Disposition: PARTIAL. Structural validation: FAIL. Evidence validation: PASS
for the declared narrow claims.**

Independent public checks confirmed:

- Exact artifact, merge parents/tree and PR association.
- Explicit PR-to-work references, timeline corroboration and final receipt
  identity.
- Published instruction, report and decision records associated with #63.
- Directly cited predecessor receipt and exact provider commit.
- Three-commit history and synthetic/candidate/final tree equality.
- Exact-SHA CI outcomes, both PR attempts and selected log contents.
- Native continuation, Project membership/status and scoped empty
  relationships.

Original-to-final statuses are preserved explicitly:

- **D01:** `VERIFIED` → `VERIFIED`; exact artifact identity.
- **D02:** `VERIFIED` → `VERIFIED`; exact PR association.
- **D03:** `VERIFIED` → `VERIFIED`; explicit work association.
- **D04:** `VERIFIED` → `VERIFIED`; published instruction content and
  association, not receipt.
- **D05:** `VERIFIED` → `VERIFIED`; referenced contextual objects and
  associations, not historical supply or substantive truth.
- **D06:** `VERIFIED` → `VERIFIED`; report existence/association and selected
  CI records, not reproduced local execution.
- **D07:** `VERIFIED` → `VERIFIED`; published decision/review records, not
  authenticated reviewer independence.
- **D08:** `VERIFIED` → `VERIFIED`; published history and tree relationships,
  not earlier local patch custody.
- **D09:** `VERIFIED` → `VERIFIED`; native and textual continuation
  association.
- **D10:** `VERIFIED` → `VERIFIED`; observed Project/native state, not complete
  history.

**Unsupported VERIFIED claims: 0. Classification corrections: 0.** The
investigator explicitly distinguished record existence from underlying truth
and actual historical delivery. Those limitations are not grounds to downgrade
a different, narrower claim opportunistically.

The evaluator disagrees with treating the frozen submission as structurally
complete. It omitted required study/revision/case metadata, did not follow
template order, lacked prescribed per-row evidence fields, and omitted
tool/manual-intervention quantities and measured runtime usage. It contained
useful empirical observations but did not distinctly frame candidate hypotheses
as required. This draft supplements those deficiencies without erasing the
original output.

There is **one evaluator-only authority-provenance discovery**, EOD-1, and
**seven unresolved questions**, enumerated above. Controller-supplied runtime
measurements are separately attributed supplementation, not
investigator-reported measurements.

No request-count or hop-bound breach was found in the actual logical trace.
Underlying HTTP attempts remain unmeasured. Successful retrieval alone was not
treated as qualification.

## Bounded conclusion

The investigator recovered a supported public chain:

**exact artifact → PR #66 → Issue #63 → published instructions, contextual
references, reports and decisions → exact-SHA CI → Project completion → native
continuation #67.**

The frozen submission receives **PARTIAL** disposition because required
reporting structure and provenance fields were missing. Its ten narrowly scoped
classifications remain supported; no claim of historical prompt receipt,
reviewer independence, complete local-execution truth or historical
completeness is established.

**Evaluator-only EOD-1** establishes public authority-document provenance, not
an additional investigator-recovered work link.

Practices worth retaining as Proto-Lithify empirical knowledge include
identity-rich receipts, explicit phase gates, preserved failures, corrective
review packets, persistent-test wiring and separated continuation scope.
Possible evidence-indexing or completeness-check mechanisms remain hypotheses.

No causal inference, representative sampling or general reliability claim
follows from this case. Proto-Lithify owns empirical extraction; Lithify
retains independent derivation and adoption. No accepted requirement, selected
architecture, Product Intent amendment or implemented retrieval capability
follows.
