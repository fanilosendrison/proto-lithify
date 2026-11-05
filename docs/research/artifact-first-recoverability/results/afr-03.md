---
okf_version: "1.0"
kind: KnowledgeAsset
asset_type: research-case-assessment
domain: proto-lithify
severity: guideline
name: "AFR-03 empirical case assessment"
version: "0.1.0"
---

# AFR-03 — Artifact-first recoverability assessment

## Case metadata

```text
STUDY_ID=PL-R-AFR-20261104
PROTOCOL_REVISION=91727041cddcedcdd83903617d4061de78473a8c
CASE_ID=AFR-03
REPOSITORY=fanilosendrison/proto-scope
STARTING_ARTIFACT_SHA=f9b53f07a27fb4489314786066951970bff50327
OBSERVATION_TIME=2026-11-05T11:50:19Z/2026-11-05T11:55:18Z
EVALUATOR_PUBLIC_OBSERVATION_TIME=2026-11-05T11:59:09Z/2026-11-05T12:01:58Z
AUTHORIZED_SURFACES=Public Git objects/history; public GitHub PR and Issue
  records and native relationships; public Projects; public versioned
  documentation; directly linked public evidence artifacts
INVESTIGATOR_CONTEXT=Repository and exact merge SHA were the only case-specific
  initial inputs; generic bounded read-only recovery instructions were supplied
INVESTIGATOR_MODE=NON_BLIND_EXPLORATORY
EVALUATION_DISPOSITION=PARTIAL
```

This assessment follows the [accepted protocol][P] and [report template][T]. It
concerns one frozen case, not the complete six-case campaign.

The investigator session was `01a1ab8b-76ba-78b2-9e7e-2dbf2bd0e2ff`. Effective
pre/post runtime observations recorded provider `openai-codex-1`, model
`gpt-6.1-sol`, thinking `xhigh`, and the `bash` tool. Context files, skills,
prompt templates and discovered extensions were disabled; an existing provider
extension remained enabled. No technical sandbox or controller-material
confinement was established.

The controller attests that no case label, PR number or Issue hint was supplied
initially. Initialization carried no subject. The exact generic prompt text and
its hash were not included among the evidence supplied for this evaluation; the
input boundary is therefore reported as attested, while actual retrieval
behavior is checked against the trace.

The evaluator worked independently in session
`01a1ab93-383e-7843-8c4d-ae59b777b1e9`. Its supplied pre-request runtime
observation identified the same provider/model/thinking configuration, with
`read` and `bash`. No evaluator post-review runtime or usage measurement is
claimed.

## Dimension assessment

`VERIFIED` below establishes only the specified record identity, content or
association. It does not establish historical receipt, complete history or
substantive correctness of every source statement.

DIMENSION | CLASSIFICATION | OBSERVED_IDENTITY | EVIDENCE_URL | OBSERVATION | LIMITATION
--------- | -------------- | ----------------- | ------------ | ----------- | ----------
D01 EXACT_ARTIFACT_IDENTITY | VERIFIED | `fanilosendrison/proto-scope@f9b53f07a27fb4489314786066951970bff50327` | [Commit][S1] | Exact commit, two parents, tree and two added blob identities agree with independently retrieved public objects. | Provider identity and byte consistency do not establish originating intent or arbitrary execution behavior.
D02 ARTIFACT_TO_PR | VERIFIED | PR #56; head `319aedb5bdd41a506590f9855a4b73d2e0ea39b5` | [Association endpoint][S2]; [PR #56][S3] | Association endpoint returned PR #56; merged PR metadata names the exact starting merge SHA; head, second parent and tree agree. | One candidate was returned within the examined association surface; this is not a universal relationship-completeness claim.
D03 ARTIFACT_TO_WORK | VERIFIED | Issue #55, Phase A | [PR #56][S3]; [issue-side publication receipt][S5a] | PR body identifies #55 Phase A, and the issue receipt names the exact workflow merge. | Association is textual and reciprocally corroborated, not a native closing-issue relationship.
D04 WORK_TO_INSTRUCTION | VERIFIED | Public Issue #55 body and associated comments | [Issue #55][S4]; [comments][S5] | Detailed public instructions are observable and associated with the work identified by PR #56. | Original prompt delivery and historical agent receipt are unproved; the mutable issue body cannot be assumed to reproduce its pre-execution version.
D05 WORK_TO_CONTEXTUAL_SOURCES | VERIFIED | Ruu revision `5d04c58170b2ce3f0e47aa0554a97906d2256492`; exact script/archive blobs | [Issue #55][S4]; [script][S14]; [archive][S15] | Issue references resolve to public immutable objects whose independently calculated Git and SHA-256 identities match. | Present availability and association do not establish historical supply to an executing agent or scientific validity.
D06 WORK_TO_EXECUTION_REPORT | VERIFIED | Run `40234216650`, attempt 1; artifact `12614062299`; Phase A report | [Run][S6]; [artifact ZIP][S7]; [report][S8] | Provider metadata binds the run to the starting SHA; retained archive hashes and report identity agree. | Recorded PASS classifications and byte consistency are not independent witnessing of every filesystem/network effect.
D07 WORK_TO_DECISIONS_AND_REVIEWS | VERIFIED | #55 STOP/GO summaries and published Phase B REJECT | [Comments][S5]; [Phase A report][S8]; [Phase B report][S9] | Published review summaries, findings and decision contents are recoverable and work-associated. | Complete raw review packets, model identity and reviewer independence are not independently authenticated.
D08 WORK_TO_CHANGE_HISTORY | VERIFIED | Starting merge/parents; PR #58 and #59 publications; visible issue events | [Commit][S1]; [PR #58][S10]; [PR #59][S11]; [timeline][S19] | Exact merge relationships and visible closure/reopening records are established. | Investigator timeline output was truncated; earlier corrected candidate trees were referenced rather than reconstructed.
D09 WORK_TO_CONTINUATION_INFORMATION | VERIFIED | Issue #45 receipt; merged PR #60; successor conditions in Phase B report | [Phase B report][S9]; [completion receipt][S12]; [PR #60][S13] | Published rejection conditions and a later `NOT_EXECUTED_NO_ADMISSION` receipt are observable; PR #60 merger is confirmed. | The outcome document’s full bytes and fourth-hop review-broker attestations were not retrieved by the investigator; global non-execution is unproved.
D10 PROJECT_AND_NATIVE_RELATIONSHIPS | INACCESSIBLE | Public reference to Project #13; native parent #37 and blocker #45 relationships | [Issue #55][S4]; [blocking projection][S16]; [parent projection][S17]; [blocker projection][S18] | Public-authorized Project state was unavailable; native parent/blocker associations were independently verified, and PR #56 had zero closing-issue references. | An investigator query acquired non-public Project fields before screening. Those contents are excluded; no Project state is presented as public evidence.

## Exact discovery sequence

The investigator’s permitted procedure was public-source recovery from the
repository/SHA pair, with no acquired-source execution or mutation, at most 100
logical API invocations, one `gh api` request per bash invocation, no automatic
pagination, and three relationship-discovery hops:

- Artifact: hop 0.
- Associated PR: hop 1.
- Associated work: hop 2.
- Directly linked context or continuation: hop 3.

An object’s own comments, reviews, files and native relationship projections
were containment reads, not permission to follow another downstream object.

The complete supplied trace records this actual sequence on 2026-11-05, UTC.
REST collection calls explicitly selected page 1 with `per_page=100`.

1. **11:50:19, hop 0:** exact commit metadata and complete two-file patches.
2. **11:50:24, hop 0→1:** commit-to-PR endpoint returned PR #56.
3. **11:50:31, hop 1:** PR #56 metadata confirmed merger and identified #55
   Phase A.
4. **11:50:35, hop 1:** PR commit projection established its sole head commit
   and matching tree.
5. **11:50:42, hop 2:** Issue #55 body, instructions, references and native
   metadata.
6. **11:50:47, hop 2:** all nine returned #55 comments.
7. **11:51:09, hops 1–3:** pure GraphQL query checked PR comments, reviews,
   threads and closing references. It also requested Project fields before
   establishing public visibility. Non-public Project contents returned and
   were subsequently excluded.
8. **Between 11:51:09 and 11:51:32, hop 2→3:** #55 timeline. Retained output
   included closure/reopening events and a direct PR #60 cross-reference.
   Output was truncated; its initial timestamp was not retained.
9. **11:51:32, hop 3:** exact referenced Actions run `40234216650`.
10. **11:51:38, hop 3 containment:** run jobs and step conclusions.
11. **11:51:43, hop 3 containment:** run artifact metadata.
12. **11:52:01, hop 3 containment:** artifact ZIP read into memory; member
    names, manifest coverage and hashes checked without executing its contents.
13. **11:52:16, hop 3:** PR #58 publication metadata.
14. **11:52:20, hop 3 containment:** PR #58 file projection.
15. **11:52:26, hop 3 containment:** complete Phase A report at its exact merge
    revision; digest calculated.
16. **11:52:38, hop 3:** PR #59 publication metadata.
17. **11:52:42, hop 3 containment:** PR #59 three-file projection.
18. **11:52:49, hop 3 containment:** complete Phase B admission report at its
    exact merge revision; digest calculated.
19. **11:53:01, hop 2→3:** #55 native blocking projection identified #45.
20. **11:53:06, hop 3 containment:** #37 sub-issue projection reciprocally
    confirmed #55.
21. **11:53:10, hop 3:** Issue #45 instructions and administrative state.
22. **11:53:24, hop 3:** referenced Ruu repository visibility checked as
    public.
23. **11:53:29, hop 3 containment:** exact referenced Ruu commit.
24. **11:53:36, hop 3 containment:** Ruu script bytes acquired and hashed
    without execution.
25. **11:53:46, hop 3 containment:** archived-output bytes acquired and hashed.
    The raw report’s sequence table incorrectly gives `11:53:49`.
26. **11:53:49, hop 3 containment:** Issue #45 comments, including rejection
    handoff and completion receipt.
27. **11:54:08, hop 3:** PR #60 metadata, reached through the direct #55
    timeline reference.
28. **11:54:14, artifact-bound query:** current runs filtered to the starting
    SHA; one returned run.
29. **11:54:23, hop 0 containment:** pure GraphQL query acquired both exact
    artifact blobs for independent Git/SHA-256 calculation.
30. **11:54:27, hop 3 containment:** #45 native blocker projection returned
    #44, #51 and #55.
31. **11:55:18:** date-only bash call marked retrieval end; no API request.

The trace contains 30 logical API invocations, no automatic pagination and no
fourth-hop retrieval. Parsing and hashing utilities did not execute acquired
repository code.

Unexamined surfaces included complete raw review materials, fourth-hop broker
evidence, earlier correction trees, prior HOLD issue contents, upstream action
implementations, registry image bytes and linked external
platform-documentation contents.

## Artifact and PR identity verification

The public starting commit is:

`f9b53f07a27fb4489314786066951970bff50327`

Its parents are:

- `a1a9dbdf40c3b1d674d93f4b3eebbc28fa139af6`
- `319aedb5bdd41a506590f9855a4b73d2e0ea39b5`

Its tree is `676ef45a3cc28083c61c08111e8bd367d460c13c`. The commit adds two
files, with 350 additions and no deletions:

- `.github/workflows/dt03e2-inert-containment.yml` Blob
  `c06d0a3bb34a1d73873978c8b45c0f2c20f3cdd7`; SHA-256
  `aaabba79a6c6817a189afcb84396013c97e702a7ad4bfdcbaae2db91a7b6e669`.
- `docs/research/derivtrace/falsification/fixtures/dt-03-e-actions-inert-probes.sh`
  Blob `e6fb73c2058058866730fcef13065f326ab94f32`; SHA-256
  `f4d18c503043bf8729a0b605883ed2bb3c4486960ab60061dd1f60b96423cedf`.

Independent evaluator reads reproduced these identities.

[PR #56][S3], “ci: add reviewed inert containment probes,” is merged at the
exact starting SHA. Its sole head commit equals the merge’s second parent and
has the same tree. The association endpoint, PR metadata and Git identities
agree.

The commit message’s PR reference was not used alone to establish the
association or mission. The controller’s expected PR was evaluation metadata
only; the investigator’s own request 2 recovered #56.

## Work and mission recovery

[Issue #55][S4], “DT-03.E.2 — Qualify RP08 on GitHub Actions hosted VM, then
reconsider admission,” is associated with the starting artifact through two
public records:

- PR #56 explicitly identifies the issue’s Phase A.
- The [issue-side publication receipt][S5a] identifies PR #56 and its exact
  merge SHA.

The issue describes a two-stage mission:

1. Publish and qualify inert containment probes.
2. Separately assess a future RP08 admission.

The starting artifact is Phase A source publication, not completion of both
stages and not RP08 execution.

Native relationships separately establish #55 as a child of #37 and a blocker
of #45. They do not establish execution authority. The PR has zero native
closing-issue references.

## Instructions and sources

The current public #55 body specifies manual workflow execution, immutable
identities, experiment-owned controls, bounded permissions, failure
preservation, separate admission review and no RP08 execution in that issue.

This establishes an associated instruction record and its acquired content. It
does not prove:

- The historical engineering agent received those exact instructions.
- The acquired issue version existed unchanged before execution.
- Every linked source was supplied to that agent.
- The issue body was the original prompt.

The referenced Ruu revision is `5d04c58170b2ce3f0e47aa0554a97906d2256492`.

- [Script][S14]: `qualification/state-space/v045/state-space-audit-v45.py`;
  6,795 bytes; blob `515f1067167d3ae331d4562c4dc8d879f2c74967`; SHA-256
  `84b9016765a5a8713db40df11888b657f63d309335d4e6890410d423057738ea`.
- [Archived output][S15]:
  `qualification/state-space/v045/state-space-audit-v45.txt`; 456 bytes; blob
  `1e8d950b67f1d25707142ff62d003f741481fde7`; SHA-256
  `76bc0a73f54bbcbe167a4bf985d6aff5bf6d60b0a03fe51e78bdaff9ca4765ae`.

Investigator and evaluator independently reproduced these byte identities
without execution. Neither acquisition authenticates historical execution or
scientific correctness.

GitHub runner/workflow documentation, runner-image documentation and Docker
references were encountered in #55. Their contents were not retrieved by the
investigator. Action pins and image digests were observed, but upstream
implementation and image bytes were not independently acquired.

## Execution reports and review evidence

[Run `40234216650`][S6] is a provider record for the exact starting SHA,
`workflow_dispatch`, branch `main`, attempt 1, with completed/success status.
The investigator retrieved one containment job, `121292210119`, and its
successful step conclusions.

The current exact-SHA run query returned one run. Deleted, unavailable or
otherwise unreturned history is not ruled out.

Artifact `12614062299` was available during both observation windows:

- Archive size: 46,180 bytes.
- Archive SHA-256:
  `d4ff14638237601e8d43cbc72283d79f3f9d277ec1a329661ff27ec440e4a54f`.
- Members: 159.
- Manifest entries: 158, covering every non-manifest member.
- Manifest SHA-256:
  `66b9472f84c24fc54ace7590b1b194faf0f477d564660c743030fe9744c4fb6b`.
- All listed member hashes matched.
- Recorded expiry: `2026-11-08T21:10:36Z`.

The artifact records P-A through P-E as PASS with process statuses `0`, `30`,
`42`, `40` and `23`. It also records `RP08_EXECUTED=NO` and `RP08_ADMITTED=NO`.

These are verified retained contents. Their classifications are not
independently witnessed process effects, and a successful provider job is not
scientific validation.

The [Phase A report][S8], published through [PR #58][S10], has:

- Merge `1651c7fe952c1e4e466dec788e14862176fd2924`.
- Blob `0bf3f5842dfab9b21372eb317b5c5ca416010754`.
- SHA-256 `93464c22cd3ec39bc34bd6efadd111ad1b61eca43ffedda4da7aac6b5b5f4fcf`.

It reports qualified inert probes, not RP08 admission.

Public #55 comments preserve two Phase A STOP summaries and a later publication
GO. All nine acquired comments were posted through the same GitHub account.
Their attribution to independent model reviewers is an actor report; complete
reviewer provenance and raw review contents were not authenticated.

PR #56 itself had zero native comments, reviews and review threads at
observation.

## Decisions, corrections and continuation

The published record preserves:

- [First Phase A STOP][R1]: `0/4/1` blocker/major/minor findings.
- [Second Phase A STOP][R2]: `1/2/0`.
- [Source publication GO][R3]: `0/0/0`, bound to the exact published
  tree/blobs.
- Two Phase B STOP summaries followed by publication of an explicit REJECT.

The [Phase B report][S9], published through [PR #59][S11], has:

- Merge `8a8e5ea43b69928f986c6e219757694d88397a84`.
- Blob `ef3cf9ef8e700b8567ca1a9112a89253242b8881`.
- SHA-256 `0c21fa9990340f6b93f1c349715df12596d5723209b3a7131e9e5848659e2b0d`.

It records `ADMISSION_DECISION=REJECT`, `SAFETY_ADMISSION_GATE=FAIL` and
`EVIDENCE_GATE=FAIL`. Its stated defeating condition concerns reusable dispatch
inputs without durable single-use authorization. This assessment verifies the
published decision and rationale, not an independent proof of the entire
technical argument.

PR #59’s file projection contains three documentation/fixture additions, not an
active workflow path.

The [Issue #45 completion receipt][S12] records `NOT_EXECUTED_NO_ADMISSION`.
[PR #60][S13] is independently confirmed merged as
`cf631a6b86501ffd484954572263f07d1feb2cd0`. The receipt identifies outcome blob
`76e9d7272d6fb8ebc8cb69d6bc94ddfbed630a48` and SHA-256
`07a691413cb26efa4448ff9c652548ce72cf7392a428f1b65c7981ae8bffc390`; the
investigator did not retrieve that document’s complete bytes.

Broker links in the continuation receipt were not followed beyond the
authorized hop boundary.

An unresolved wording discrepancy remains: the source GO comment describes
publication-only authority, whereas the qualification report describes
publication plus one manual run. The complete underlying authorization record
was not recovered.

## Empirical extraction from observed engineering practice

### Observations

- **Redundant immutable identities supported cross-checking.** PR #56, #55
  receipts, the run, artifact and versioned report repeat matching
  commit/blob/digest identities. This enabled record association without
  treating the merge message as a mission record. Sources: [PR #56][S3],
  [publication receipt][S5a], [run][S6], [report][S8].
- **Unfavorable review outcomes remained visible.** The two Phase A STOP
  summaries and Phase B STOP/REJECT records preserve correction history instead
  of presenting only favorable outcomes. Full review contents and independence
  remain unverified. Sources: [first STOP][R1], [second STOP][R2],
  [comments][S5], [Phase B report][S9].
- **Substantive review summaries were outside native PR review records.** PR
  #56 had zero native reviews, while #55 contained detailed review summaries.
  This is a counterexample to equating “no native PR review” with “no published
  review evidence.” Sources: [PR #56][S3], [comments][S5].
- **Administrative completion differed from execution success.** #55 was
  closed, reopened and later closed; #45 closed with a non-execution
  disposition. Native closure cannot substitute for the recorded admission
  decision. Sources: [timeline][S19], [completion receipt][S12].
- **Artifact preservation encountered a portability defect.** Five
  uppercase/lowercase status-name pairs collide on case-insensitive extraction.
  Direct ZIP-member hashing preserved their distinct bytes. Sources:
  [artifact][S7], [Phase A report][S8].
- **Evidence retention was finite.** The artifact had a near-term recorded
  expiry, while versioned reports retained summaries and digests. A digest
  alone cannot recover missing bytes. Sources: [artifact metadata][S7m],
  [report][S8].
- **Recovery was fragmented.** Thirty logical API requests traversed commit
  associations, issues, native projections, execution metadata, archive bytes
  and versioned reports. Timeline truncation and the Project visibility
  incident added practical limitations.
- **Multiple correction/re-review rounds were published.** Whether this effort
  was necessary, avoidable or duplicative cannot be determined from the records
  alone. No human-intervention count is inferred.

### Interpretations and non-normative hypotheses

- Repeated immutable identity references may support later reconstruction
  despite fragmented record locations. This case does not establish an optimal
  representation or show that redundancy caused successful recovery.
- Hash-bound review summaries can preserve decisions while failing to recover
  complete reviewer evidence. Native reviews, issue summaries and versioned
  reports are alternative observed arrangements, not interchangeable evidence.
- Portable artifact naming and durable public evidence publication may reduce
  later access friction. No post-expiry retrieval test or storage architecture
  was evaluated.

These are Proto-Lithify empirical observations and candidate hypotheses. They
are not accepted capabilities, Lithify requirements or selected mechanisms.

## GitHub Project observations

The public #55 instructions reference Project #13 and request a particular
relationship/status. That is a public instruction record, not proof of current
Project state.

At `11:51:09Z`, investigator request 7 requested Project fields before
screening visibility. The response indicated non-public visibility and returned
additional fields. Those contents were excluded from the investigation’s
conclusions and are not reproduced here. The evaluator did not query that known
non-public Project.

This is an authorization-boundary limitation, not an HTTP access-denial
observation. Successful credentialed retrieval does not make a surface publicly
admissible.

Independently checked public native relationships were:

- #55 is a child of #37.
- #55 blocks #45.
- #45 retains blockers #44, #51 and #55.
- PR #56 has zero native closing-issue references.

The relevant public projections are [#55 blocking][S16], [#37 sub-issues][S17]
and [#45 blockers][S18].

## Ambiguities and inaccessible sources

Six uncertainty groups remain:

1. **Historical receipt and temporal instructions:** original prompt delivery,
   contextual-source supply and contemporaneous mutable issue versions.
2. **Review provenance:** complete raw review packets, reviewer identity,
   independence and execution.
3. **Historical coverage:** all attempts, unavailable/deleted records and
   universal absence of RP08 execution.
4. **Authorization wording:** publication-only versus publication-plus-one-run
   statements.
5. **Incomplete reconstruction:** truncated timeline and unacquired earlier
   correction trees.
6. **Substantive truth:** reported probe effects and decision reasoning beyond
   established record contents, provider associations and hashes.

Project state remains outside public authorization. No Project access-denial
code is asserted; visibility, rather than failed tool execution, caused
exclusion.

The starting commit and associated public case objects were accessible. No
frozen-case existence/access failure requiring campaign STOP was detected. The
Project acquisition deviation remains a separate methodological incident and is
not disguised as historical absence.

## Reconstruction cost measurements

Measurements below concern the investigator, not the evaluator’s independent
checks.

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
    **Value:** 30 logical `gh api` invocations; underlying HTTP transport
    attempts NOT_MEASURED **Measurement provenance:** Complete frozen trace and
    matching controller audit; 28 REST GETs and two pure GraphQL queries

[^cost-2]:
    **Value:** 30 numbered API steps; one final clock-only step **Measurement
    provenance:** Exact sequence above; explicit first pages, no automatic
    pagination

[^cost-3]:
    **Value:** 478.329 seconds substantive; 485.229 seconds whole session; 299
    seconds retrieval interval **Measurement provenance:** Runtime usage
    capture; trace clocks delimit retrieval only

[^cost-4]:
    **Value:** 31 bash calls **Measurement provenance:** 31 paired start/end
    events; 30 API-bearing calls and one date-only call

[^cost-5]:
    **Value:** Capture input field 93,033; cache-read 1,534,464; cache-write 0
    **Measurement provenance:** Actual whole-session usage capture; input plus
    cache-read fields total 1,627,497

[^cost-6]:
    **Value:** 18,022 **Measurement provenance:** Actual whole-session usage
    capture; all token fields total 1,645,519

[^cost-7]:
    **Value:** NOT_MEASURED **Measurement provenance:** No verified
    subscription-charge attribution; catalog estimates are not charges

[^cost-8]:
    **Value:** NOT_MEASURED **Measurement provenance:** No reliable
    intervention counter supplied

Whole-session usage includes initialization. The elapsed-time difference
between whole-session and substantive scopes is 6.900 seconds. A
substantive-only token split was not supplied.

Independent evaluation used 21 additional logical public GitHub API
invocations. These are not investigator requests, investigator discoveries or
additions to investigator recovery coverage. Evaluator monetary/token costs
were not supplied.

No inference-efficiency comparison is made.

## Recovery coverage

`RECOVERY_COVERAGE` comprises:

- D01–D09: nine narrowly verified record-level identity, content or association
  claims.
- D10: public Project state inaccessible; native relationship components
  verified.

This count is not a percentage of universal reliability. Prompt receipt,
reviewer independence and substantive scientific truth are not silently
included in those nine verified claims.

The publication-ready structure and measured usage integration were supplied by
evaluation, not recovered by the investigator.

**EVALUATOR_ONLY_DISCOVERY: zero.** No evaluator-only subject finding increases
the investigator’s coverage.

## Unknown historical completeness

`HISTORICAL_COMPLETENESS=UNKNOWN`.

The acquired public records do not establish everything originally available to
participants. Mutable Issue bodies, missing raw review contents, truncated
timeline output, finite artifact retention and unobserved historical attempts
prevent a completeness claim.

A current one-run result is not proof that no other run ever existed. A
non-execution receipt is not proof of universal absence. Missing prompt or
review content does not establish that it was never created.

## Negative findings and counterexamples

Within the declared boundary:

- No original engineering-agent prompt or delivery receipt was located.
- Complete raw source-review packets were not located through the examined
  records; hashes alone did not recover their contents.
- PR #56 had zero native comments, reviews, review threads and closing-issue
  references.
- One exact-SHA workflow run was currently returned.
- No separately labeled PARTIAL report was located among examined issue, PR,
  report and artifact records.
- Earlier correction trees and fourth-hop broker evidence were not
  reconstructed.
- Project state was not admissible as public evidence.
- Artifact filenames provided a concrete case-insensitive-extraction
  counterexample.
- Successful inert probes and closed issues did not correspond to an RP08
  admission or successful replay.

These are scoped findings, not global nonexistence claims.

## Evidence provenance

The public protocol and template at the exact integrated revision matched the
supplied authority files:

- Protocol blob: `828e249f9e50a274e91cc5c84c986fa62b884111`.
- Template blob: `1479cf3b193fc2790663603dc8adcb97d3810711`.

Frozen investigator provenance:

- Raw-report SHA-256:
  `bb9fe6e5f412c15f00bfd5f6a6c6fe51215364a4908deb167718547f4cd4459d`.
- Tool-trace SHA-256:
  `6287aacc84d10f1175a99379aa4e013c15fc2b95cc1f2ade0b7434a25d93762b`.
- Runtime before: `2026-11-05T11:50:11.074817+00:00`.
- Runtime after: `2026-11-05T11:58:09.389794+00:00`.
- Investigator public acquisition: `11:50:19–11:55:18Z`.
- Evaluator public acquisition: `11:59:09–12:01:58Z`.

The report and trace hashes identify preserved evaluation inputs; they do not
imply that the underlying transcripts are publicly published. Public GitHub
objects provide subject-claim traceability. No private transcript, machine
path, authentication material or non-public Project content is offered as
public proof.

### Public source references

- [Protocol at integrated revision][P]
- [Template at integrated revision][T]
- [Starting commit][S1]
- [Commit-to-PR association endpoint][S2]
- [PR #56][S3]
- [Issue #55][S4]
- [Issue #55 comments][S5]
- [Phase A publication receipt][S5a]
- [Actions run][S6]
- [Artifact ZIP][S7]
- [Artifact metadata][S7m]
- [Phase A report][S8]
- [Phase B report][S9]
- [PR #58][S10]
- [PR #59][S11]
- [Issue #45 completion receipt][S12]
- [PR #60][S13]
- [Exact Ruu script][S14]
- [Exact Ruu archive][S15]
- [Issue #55 blocking projection][S16]
- [Issue #37 sub-issue projection][S17]
- [Issue #45 blocker projection][S18]
- [Issue #55 timeline][S19]

## Independent evaluation

**Disposition: PARTIAL.**

The evaluator read the complete supplied protocol, template, raw report, tool
trace, audit, effective pre/post runtime metadata and usage capture. Raw
session JSONL and private reasoning were not inspected.

Independent public checks reproduced:

- Exact starting artifact, parents, tree and source-byte hashes.
- Commit-to-PR #56 association and merged identity.
- PR-to-#55 and issue-side exact-merge association.
- Public instruction and review-summary contents.
- Exact Ruu contextual-source identities and hashes.
- Run/artifact association and archive/member consistency.
- Phase A and Phase B report identities and publication merges.
- Continuation receipt and PR #60 merger.
- Native parent/blocker relationships and zero PR closing references.

Project contents were not independently retrieved because the trace already
identified that surface as non-public.

### Preserved original statuses and evaluator treatment

- D01 EXACT_ARTIFACT_IDENTITY: original VERIFIED; final VERIFIED.
- D02 ARTIFACT_TO_PR: original VERIFIED; final VERIFIED.
- D03 ARTIFACT_TO_WORK: original VERIFIED; final VERIFIED.
- D04 WORK_TO_INSTRUCTION: original VERIFIED; final VERIFIED.
- D05 WORK_TO_CONTEXTUAL_SOURCES: original VERIFIED; final VERIFIED.
- D06 WORK_TO_EXECUTION_REPORT: original VERIFIED; final VERIFIED.
- D07 WORK_TO_DECISIONS_AND_REVIEWS: original VERIFIED; final VERIFIED.
- D08 WORK_TO_CHANGE_HISTORY: original VERIFIED; final VERIFIED.
- D09 WORK_TO_CONTINUATION_INFORMATION: original VERIFIED; final VERIFIED.
- D10 PROJECT_AND_NATIVE_RELATIONSHIPS: original INACCESSIBLE; final
  INACCESSIBLE.

There are **zero classification corrections** and **zero unsupported VERIFIED
dimension claims**, when read with their original explicit limitations. In
particular, D04 and D05 were already record/association claims, not claims of
historical receipt.

### Corrections and disagreements

The raw report is not structurally compliant with the accepted template. It
omits exact study/revision/case metadata, does not use the required six-column
assessment presentation, and does not fully present all cost quantities or
separate candidate hypotheses. This draft repairs publication structure without
retroactively crediting those elements to the investigator.

Measured usage supersedes the raw report’s token `NOT_MEASURED` entry. The raw
299-second interval is retained as retrieval time, not total substantive
elapsed time. Request 25’s timestamp is corrected to `11:53:46Z`.

The Project query was a public-surface boundary deviation. Excluding returned
contents was appropriate but did not reverse acquisition. No private Project
status is used to support a conclusion.

Evidence validation is PARTIAL because the assessment’s public-only acquisition
provenance is not fully compliant and Project state cannot be independently
checked within authorization. Critical public identity and association claims
nevertheless validate.

**EVALUATOR_ONLY_DISCOVERY=0.** Corroborating checks and evaluator-supplied
accounting are separate from investigator recovery.

The six uncertainty groups listed above remain unresolved. This evaluation does
not claim its own future publication, integration or post-review runtime state.

## Bounded conclusion

This case supports a bounded public-record reconstruction from an exact merge
artifact to PR #56, #55 Phase A, associated instruction/context records, an
exact-SHA inert-probe execution record, retained artifact bytes, published
review summaries and later rejection/non-execution records.

The assessment remains **PARTIAL**, not fully qualified: the frozen report
lacks accepted publication structure, and its Project query breached the
public-surface boundary. Neither successful tool execution nor nine narrow
VERIFIED rows removes those limitations.

Useful empirical observations remain the redundancy of immutable identities,
preservation of negative review outcomes, review evidence outside native PR
reviews, administrative closure without execution success, and artifact
retention/portability friction. Candidate improvements remain hypotheses.

Historical prompt receipt, reviewer independence, all process effects, complete
attempt history and historical completeness are unproved.
**EVALUATOR_ONLY_DISCOVERY: zero.**

Proto-Lithify owns empirical extraction; Lithify owns independent derivation
and adoption. No architecture, requirement, Product Intent amendment, new CLI
capability, causal inference, representative-sampling claim or universal
reliability conclusion follows. The observations remain useful empirical
knowledge even without Lithify adoption.

[P]:
  https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/protocol-v1.md
[T]:
  https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/report-template-v1.md
[S1]:
  https://github.com/fanilosendrison/proto-scope/commit/f9b53f07a27fb4489314786066951970bff50327
[S2]:
  https://api.github.com/repos/fanilosendrison/proto-scope/commits/f9b53f07a27fb4489314786066951970bff50327/pulls?per_page=100&page=1
[S3]: https://github.com/fanilosendrison/proto-scope/pull/56
[S4]: https://github.com/fanilosendrison/proto-scope/issues/55
[S5]:
  https://api.github.com/repos/fanilosendrison/proto-scope/issues/55/comments?per_page=100&page=1
[S5a]:
  https://github.com/fanilosendrison/proto-scope/issues/55#issuecomment-6403461009
[S6]: https://github.com/fanilosendrison/proto-scope/actions/runs/40234216650
[S7]:
  https://api.github.com/repos/fanilosendrison/proto-scope/actions/artifacts/12614062299/zip
[S7m]:
  https://api.github.com/repos/fanilosendrison/proto-scope/actions/runs/40234216650/artifacts?per_page=100&page=1
[S8]:
  https://github.com/fanilosendrison/proto-scope/blob/1651c7fe952c1e4e466dec788e14862176fd2924/docs/research/derivtrace/falsification/dt-03-e-actions-probe-qualification.md
[S9]:
  https://github.com/fanilosendrison/proto-scope/blob/8a8e5ea43b69928f986c6e219757694d88397a84/docs/research/derivtrace/falsification/dt-03-e-rp08-actions-admission.md
[S10]: https://github.com/fanilosendrison/proto-scope/pull/58
[S11]: https://github.com/fanilosendrison/proto-scope/pull/59
[S12]:
  https://github.com/fanilosendrison/proto-scope/issues/45#issuecomment-6590579882
[S13]: https://github.com/fanilosendrison/proto-scope/pull/60
[S14]:
  https://github.com/fanilosendrison/ruu/blob/5d04c58170b2ce3f0e47aa0554a97906d2256492/qualification/state-space/v045/state-space-audit-v45.py
[S15]:
  https://github.com/fanilosendrison/ruu/blob/5d04c58170b2ce3f0e47aa0554a97906d2256492/qualification/state-space/v045/state-space-audit-v45.txt
[S16]:
  https://api.github.com/repos/fanilosendrison/proto-scope/issues/55/dependencies/blocking?per_page=100&page=1
[S17]:
  https://api.github.com/repos/fanilosendrison/proto-scope/issues/37/sub_issues?per_page=100&page=1
[S18]:
  https://api.github.com/repos/fanilosendrison/proto-scope/issues/45/dependencies/blocked_by?per_page=100&page=1
[S19]:
  https://api.github.com/repos/fanilosendrison/proto-scope/issues/55/timeline?per_page=100&page=1
[R1]:
  https://github.com/fanilosendrison/proto-scope/issues/55#issuecomment-6403123508
[R2]:
  https://github.com/fanilosendrison/proto-scope/issues/55#issuecomment-6403218007
[R3]:
  https://github.com/fanilosendrison/proto-scope/issues/55#issuecomment-6403288147
