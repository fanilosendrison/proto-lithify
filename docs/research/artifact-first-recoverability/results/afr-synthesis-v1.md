---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "empirical-research-synthesis"
domain: "proto-lithify"
severity: "guideline"
name: "AFR six-case empirical recoverability synthesis"
version: "0.1.0"
---

# Artifact-first empirical recoverability synthesis v1

## A. Research scope and actual execution

Study `PL-R-AFR-20261104` examined the six frozen artifacts under the [accepted
protocol][protocol] at revision `91727041cddcedcdd83903617d4061de78473a8c`. The
protocol, register and template were not amended. Their respective Git blobs
remain:

- `828e249f9e50a274e91cc5c84c986fa62b884111`.
- `7a009b29710925f875cfb8f84af33d1a34d43d7f`.
- `1479cf3b193fc2790663603dc8adcb97d3810711`.

The purpose is empirical extraction from actual, publicly recorded
agent-assisted engineering practice. Artifact-first recovery is the fixed
observational lens, not an assumption that the observed organization is optimal
or that Lithify requirements have been satisfied.

The controller executed six fresh investigator sessions, in frozen order, each
followed by one separate evaluator session. No case was replaced or rerun. All
six exact artifacts and expected PR associations were independently checked.
All twelve sessions used effective `openai-codex-1 / gpt-6.1-sol / xhigh`,
observed through live Pi RPC state before substantive work and again afterward.
Initialization contained no research subject. Context files, skills, templates
and extension discovery were disabled; the existing multi-login provider was
loaded explicitly. Investigators had `bash`; evaluators had `read` and `bash`.

### Frozen corpus and actual dispositions

Case | Repository | Exact starting SHA | PR ID | Investigator mode | Evaluation
---- | ---------- | ------------------ | ----- | ----------------- | ----------
[AFR-01](afr-01.md) | fanilosendrison/proto-lithify | `09214e07e7095dd3cd9b8fc31e68a3878ac07e76` | [26][pr01] | NON_BLIND_EXPLORATORY | PARTIAL
[AFR-02](afr-02.md) | fanilosendrison/ruu | `621281abaa37259be6b9e2fa48bb80e40e36cd33` | [66][pr02] | NON_BLIND_EXPLORATORY | PARTIAL
[AFR-03](afr-03.md) | fanilosendrison/proto-scope | `f9b53f07a27fb4489314786066951970bff50327` | [56][pr03] | NON_BLIND_EXPLORATORY | PARTIAL
[AFR-04](afr-04.md) | fanilosendrison/proto-scope | `9e5bf1cb7718317a95d725156f0eed69d9a9b9cb` | [31][pr04] | NON_BLIND_EXPLORATORY | PARTIAL
[AFR-05](afr-05.md) | fanilosendrison/proto-ring | `a1b27ca1e21423973a5557415488e4fcd535d01a` | [139][pr05] | NON_BLIND_EXPLORATORY | PARTIAL
[AFR-06](afr-06.md) | fanilosendrison/proto-lithify | `025bc880281d42f67aaf4b5ae0b410e0e8056e6e` | [37][pr06] | NON_BLIND_EXPLORATORY | PARTIAL

There are six executed investigations and six completed independent
evaluations; there are zero case-level `QUALIFIED` or `REJECTED` dispositions.
`PARTIAL` is not silently converted into successful protocol compliance. The
final documentary publication/review disposition is separate from these frozen
case dispositions.

All evaluators found structural omissions in the frozen investigator outputs:
missing study/revision/controller-case metadata, incomplete template sections,
row-level evidence presentation or cost quantities. They produced separately
attributed case assessments in the reporting template. Raw outputs remain
frozen; the evaluator-authored presentation does not retrospectively repair
them.

This reporting limitation also reflects the input separation: the generic
investigator mandate requests ten output categories, while controller case IDs
are deliberately withheld. The distinction between a raw investigator narrative
and a controller/evaluator case assessment matters. The evaluator dispositions
are preserved rather than adjudicated away. Their structural findings concern
this campaign's reporting process, not defects in the historical source
workflows.

Evidence validation was `PASS` for AFR-01, AFR-02, AFR-05 and AFR-06, and
`PARTIAL` for AFR-03 and AFR-04. All six evaluators retained the original
dimension classifications, with zero unsupported dimension-level `VERIFIED`
claims at their expressly narrow scopes. This does not authenticate every
historical assertion.

### Actual isolation and access limitations

Only the repository and exact SHA were supplied as initial case-specific
knowledge, together with uniform generic rules. No initial PR/Issue number,
controller label, register, previous findings or historical report was
supplied. Initial prompts, runtime observations and discovery traces were
retained privately.

The initial preflight stopped because a technically confined retrieval
interface was not established. The owner then explicitly authorized `bash`/`gh`
reads, relaxing that operational confinement condition without changing the
accepted protocol or corpus. Technical exclusion of controller material was not
claimed. Consequently **all six cases are exploratory, and none is BLIND**.
This cohort must not be described as blind artifact-first recovery.

Two access-boundary incidents remain material:

- AFR-03 requested Project fields before visibility screening and received
  non-public contents. Those contents were excluded; subsequent stopping did
  not undo their acquisition.
- AFR-04 incidentally received non-public Project-reference metadata and did
  not follow that Project. Its identifying details and state are excluded.

The operational waiver did not authorize private-source investigation. These
incidents are methodological deviations, not public evidence and not excused by
an exploratory label. Their raw traces remain private; no private Project
content is used for the empirical conclusions. No source-repository mutation or
source code execution was observed in the investigation traces.

AFR-06 encountered later study references in public work comments, but did not
open the controller Issue/PR or register. This is another reason not to infer
blindness from fresh-session initialization alone.

### Observation boundaries and measurements

All investigator observations occurred on 2026-11-05. Each case report records
its actual observation interval, sequence, URLs, runtime provenance and limits.
Retrieval stayed within the fixed three-hop boundary and below 100 logical
`gh api` invocations per investigation. There were 183 investigator API
invocations and 196 investigator tool calls in the retained traces.

These counts describe logical CLI API invocations, not separately instrumented
HTTP transport attempts, redirects or provider-internal operations. No
automatic pagination or hidden network loop was observed. The bound is a
resource limit, not a search-completeness guarantee. Auxiliary 404s, truncation
and a response parsing failure remain in the case reports rather than being
erased.

Case | Inv API | Inv tools | Inv seconds | Eval API | Eval tools | Eval seconds
---- | ------- | --------- | ----------- | -------- | ---------- | ------------
AFR-01 | 33 | 35 | 526.593 | 31 | 47 | 616.970
AFR-02 | 43 | 45 | 669.437 | 26 | 45 | 409.202
AFR-03 | 30 | 31 | 478.329 | 21 | 42 | 479.237
AFR-04 | 22 | 24 | 434.331 | 14 | 33 | 465.236
AFR-05 | 34 | 38 | 545.948 | 18 | 51 | 542.960
AFR-06 | 21 | 23 | 483.195 | 13 | 30 | 418.414

Substantive durations are controller-measured elapsed intervals from the
substantive request through report capture; they are not network latency. They
exclude initialization and, for the first investigator, the controller's
release wait. Whole-session timings and narrower retrieval intervals are
separately identified in the case reports. Evaluator tool totals include local
reads of the explicitly supplied campaign evidence and authority files.

Case/stage | Input tokens | Cache-read tokens | Output tokens
---------- | ------------ | ----------------- | -------------
AFR-01 investigator | 56,497 | 1,336,064 | 15,147
AFR-01 evaluator | 100,185 | 2,982,016 | 19,438
AFR-02 investigator | 100,942 | 3,074,432 | 19,318
AFR-02 evaluator | 135,491 | 810,368 | 18,998
AFR-03 investigator | 93,033 | 1,534,464 | 18,022
AFR-03 evaluator | 139,903 | 646,912 | 20,384
AFR-04 investigator | 77,238 | 993,408 | 13,606
AFR-04 evaluator | 115,772 | 999,808 | 19,618
AFR-05 investigator | 98,812 | 2,456,064 | 15,920
AFR-05 evaluator | 174,811 | 1,324,928 | 19,326
AFR-06 investigator | 92,326 | 531,072 | 14,205
AFR-06 evaluator | 94,541 | 450,304 | 17,408

These are the actual categories exposed by whole-session runtime statistics;
cache-write tokens were zero in all twelve captures. Initialization overhead
was not separately apportioned. Monetary inference cost, manual intervention
count, HTTP transport-attempt count and controller/synthesis inference usage
are `NOT_MEASURED`. Catalog cost estimates are not verified subscription
charges. No monetary estimate or cross-agent inference-efficiency ranking is
made.

## B. Artifact-first recovery results

Every cell below reproduces the evaluator-retained case assessment. The
complete claim, identity, URL and limitation remain in its case report. No
`BLIND` cohort exists for comparison.

Case | D01 | D02 | D03 | D04 | D05 | D06 | D07 | D08 | D09 | D10
---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
AFR-01 | [V] | [V] | [V] | [V] | [R] | [V] | [V] | [V] | [V] | [V]
AFR-02 | [V] | [V] | [V] | [V] | [V] | [V] | [V] | [V] | [V] | [V]
AFR-03 | [V] | [V] | [V] | [V] | [V] | [V] | [V] | [V] | [V] | [I]
AFR-04 | [V] | [V] | [V] | [V] | [V] | [V] | [V] | [V] | [V] | [V]
AFR-05 | [V] | [V] | [V] | [V] | [R] | [V] | [V] | [V] | [V] | [V]
AFR-06 | [V] | [V] | [V] | [R] | [V] | [V] | [V] | [V] | [V] | [V]

Display legend: V = `VERIFIED`; R = `REFERENCED_NOT_VERIFIED`; I =
`INACCESSIBLE`. These are compact display references, not additional
classification statuses. Full enum values and precise claims appear in each
case report.

[V]: ../protocol-v1.md#classification-vocabulary "VERIFIED"
[R]: ../protocol-v1.md#classification-vocabulary "REFERENCED_NOT_VERIFIED"
[I]: ../protocol-v1.md#classification-vocabulary "INACCESSIBLE"

Dimension names and the complete seven-status vocabulary remain those of the
protocol; unused statuses were not merged into favorable ones.

**Claim scope prevents a reliability score.** For example, D04 `VERIFIED` in
the first five cases concerns published instruction records or associated
content, not proof of historical agent receipt. AFR-06's D04 instead preserves
the unrecovered exact supplied mandate. No case established complete prompt
delivery.

Similarly, AFR-03's D10 focuses on unavailable public-authorized Project state,
while AFR-04's `VERIFIED` D10 concerns native relationships and expressly
excludes Project-state recovery. These are not interchangeable completeness
measures. No general reliability percentage or pooled success score is
justified.

The six recovered work associations were:

- AFR-01: PR #26 to [Issue #7][work01], including STOP and resumed publication.
- AFR-02: PR #66 to [Issue #63][work02], including phased work and child #67.
- AFR-03: PR #56 to [Issue #55][work03] Phase A, not its entire later program.
- AFR-04: PR #31 to [Issue #25][work04], parent #15 and successor #16.
- AFR-05: PR #139 to [Issue #134][work05], explicitly accepted contract-only.
- AFR-06: PR #37 to the cross-repository task marker, companion [Lithify PR
  #2][companion] and [integration handoff][handoff06], without a dedicated
  originating Issue being established.

## C. Observed engineering-work practices

### Information occupies several existing surfaces

The case evidence contains Git identity/history, PR descriptions, Issue bodies,
Issue comments, native relationships, versioned reports, provider CI records
and occasionally retained artifacts. No single surface supplied the whole
history.

AFR-01 required reconciling an earlier review identity in the [PR][pr01] with
the [final Issue report][final01]. AFR-02 retained 37 work comments, including
phased instructions and corrections. AFR-06 recovered its canonical review
reports in [a companion PR comment][reviews06], not the starting PR's native
review objects. These are observed placements and retrieval steps, not causal
proof that a new record system would reduce effort.

### Exact identities support bounded cross-checks

Commit-to-PR associations were checked against exact merge/head/base
identities, not title resemblance. In AFR-01, recovery remained possible after
branch deletion because the commit, PR and work records remained linked.
AFR-02's [final receipt][final02] and provider records distinguished the
candidate head, synthetic PR merge and actual merged artifact. AFR-03 recovered
exact source and retained artifact bytes, not just a plausible execution
narrative.

The contrary case is important: AFR-05's starting artifact has one Git parent,
while GitHub associates it with merged PR #139 and records the same head/merge
SHA. The frozen identity was retained. A universal two-parent merge assumption
would misdescribe it; provider merge recognition and Git topology are distinct.

### Useful handoffs preserve stopping and resumption conditions

AFR-01's [STOP report][stop01] states a separate prerequisite and resumption
condition. AFR-02 preserves rejected and timed-out phases alongside its [final
receipt][final02], then uses native child [#67][continuation02] for further
work. AFR-03's [non-execution receipt][nonexecution03] preserves the outcome
`NOT_EXECUTED_NO_ADMISSION` rather than equating Issue closure with execution.

These records helped recover published continuation conditions. They do not
prove that every claimed local execution or authorization actually occurred.

### Native relationships help but are not universally necessary

Native closing references corroborate AFR-01 and AFR-04. AFR-02, AFR-03 and
AFR-05 use explicit work links despite empty closing-Issue projections. AFR-06
recovers a task identity through reciprocal task markers and a handoff without
locating a dedicated originating Issue. This contradicts an assumption that
every recovered work association requires one particular GitHub object
relationship.

### Reviews may be recorded outside formal PR reviews

The examined native PR-review surfaces were empty across these six cases, while
public review summaries or reproduced reports existed elsewhere. Examples
include [AFR-04's STOP review][stop04], [AFR-05's acceptance record][accept05]
and [AFR-06's reproduced reports][reviews06]. This is an observed alternative
arrangement, not proof that independent reviews occurred or were effective.

Same-account publication, model names, GO labels and packet hashes do not
independently authenticate reviewer identity, input receipt or substantive
truth. AFR-05 expressly retains its underlying review privately; that limit is
not a reason to access private custody or to require its publication.

## D. Information-loss and recovery-friction analysis

### Unavailable historical information

No case established the complete original executing-agent prompt or receipt of
all instructions and contextual sources. This is a limit of these observations,
not proof that prompts or source bundles never existed. AFR-06's supplied
mandate is referenced; AFR-05's original archive is named and hashed but not
recovered.

### Referenced but unverified materials

AFR-01's transfer/review packet hashes and AFR-05's original ZIP/review receipt
are references, not recovered bytes. Public derivative documents cannot
silently substitute for the original supplied archive. A hash may identify
retained material without making its content accessible.

### Manual reconstruction and fragmentation

The traces show multiple object reads, explicit page handling and repeated
narrower projections after display truncation. AFR-02 required eight comment
pages; AFR-01 required reconciling candidate-specific review summaries. These
are measured retrieval steps, not measurements of universal wasted effort.

Historical work records also report reconstruction effort: AFR-02's [A2.1/A2.2
adjudication][reconstruction02] reconstructs concrete outcomes missing from
aggregates, and [B1.1][correction02] records an omitted untracked test file in
a review packet. These are actor-reported historical practices, not rerun
tests.

### Ambiguity differs from absence

AFR-01 retains different earlier/final review identities and an unrecovered
cleanup-to-quarantine authorization trail. AFR-05 distinguishes immutable
candidate wording from later acceptance and editorial reconciliation. These
questions do not make the exact artifact-to-PR identities ambiguous.

### Access and retention limits

AFR-03's public-authorized Project state was inaccessible; AFR-04 did not
establish public Project state. Native public relationships could still be
verified. Their incidental non-public returns are excluded, not converted into
public recovery.

AFR-03's [retained artifact][artifact03] was unexpired at observation, with a
provider expiry on 2026-11-08. Its ZIP/member hashes were checked. This
establishes availability then, not permanent retention or a measured
before/after expiry failure. Hash-only reports would not by themselves supply
those bytes.

### Retrieved records are not automatically truthful

Provider CI identities/conclusions were independently checked where cited.
Reported local repetitions, performance explanations, reviewer independence,
publication request mechanics and historical authorization generally remain
actor assertions unless a narrower source check is described. AFR-02's selected
log endpoints also produced a small timing discrepancy from the final receipt;
the disagreement was preserved rather than silently normalized.

## E. Unexpected findings and counterexamples

- **An Issue is not always necessary for bounded work identification.** AFR-06
  recovers a cross-repository task marker and handoff without an originating
  Issue. This is not a universal replacement recommendation.
- **Native PR reviews are not the whole review record.** Public reviews exist
  in comments elsewhere despite empty native review projections. Their
  historical execution remains a separate question.
- **Merged does not imply a two-parent commit.** AFR-05 preserves the exact
  single-parent artifact and GitHub's merged association.
- **Commit text can conflict with actual changes.** In AFR-05, [commit
  `93622fa`][bytecode05] adds a bytecode file despite cleanup wording; [its
  corrective parent][cleanup05] removes that file. The diff, not the message,
  establishes the observed change.
- **Successful publication can preserve an unfavorable research result.**
  AFR-04 retains `BOUNDED_ADEQUACY_REFUTED` alongside publication GO.
  Publication qualification is not a requirement that the research hypothesis
  be favorable.
- **Closure need not mean experiment execution.** AFR-03's later closed work
  records non-admission and non-execution, not RP08 success.
- **A public derivative does not recover an original supplied source.**
  AFR-05's readable API documents do not recover the original candidate ZIP.
- **Rich records still leave historical receipt unknown.** AFR-02 contains many
  instructions and reports, but no independently established agent-delivery
  record was recovered.
- **Public-only execution was not flawless.** AFR-03/AFR-04's access incidents
  and all six raw-report structural failures remain findings about this
  campaign, not evidence against the historical repositories.

## F. Candidate empirical mechanisms

These are bounded hypotheses, not selected architecture, accepted requirements
or implementation work. Existing Git/GitHub arrangements remain alternatives.

### AFR-C01 — Exact-identity navigation across existing records

```text
CANDIDATE_ID=AFR-C01
STATUS=NON_NORMATIVE_RESEARCH_HYPOTHESIS
```

- **Observed problem:** title/message plausibility and stale prose are weaker
  than exact artifact/work bindings; see AFR-01, AFR-05 and AFR-06.
- **Supporting cases:** all six recover exact PR associations; AFR-01 and
  [AFR-02's receipt][final02] provide multiple cross-checks.
- **Counterexamples:** AFR-06 needs no dedicated originating Issue; AFR-05 has
  single-parent topology. Existing native APIs and explicit text already
  worked.
- **Proposed mechanical property:** an encountered work/artifact reference
  could resolve to a precisely identified revision and declare the association
  claimed, without prescribing a particular storage object or merge strategy.
- **Uncertainty:** no causal comparison or new mechanism was tested. This would
  not authenticate instruction receipt or an unavailable review packet.

### AFR-C02 — Separate record recovery from delivery and truth claims

```text
CANDIDATE_ID=AFR-C02
STATUS=NON_NORMATIVE_RESEARCH_HYPOTHESIS
```

- **Observed problem:** published instructions, GO summaries and local
  execution reports are recoverable without proving historical receipt or
  substantive correctness; all six cases demonstrate that distinction.
- **Supporting cases:** AFR-01's [final report][final01], AFR-05's
  [private-review acceptance][accept05], AFR-06's [review record][reviews06].
- **Counterexamples:** existing prose already states many limits. Mandatory raw
  prompt/review publication would conflict with intentional private custody.
- **Proposed mechanical property:** a record could state which identity,
  association, delivery or truth claim its evidence actually supports, while
  allowing an explicit unknown or private boundary.
- **Uncertainty:** no universal schema or delivery-attestation mechanism is
  selected. More fields alone would not establish truthful assertions.

### AFR-C03 — Evidence locators with explicit availability limits

```text
CANDIDATE_ID=AFR-C03
STATUS=NON_NORMATIVE_RESEARCH_HYPOTHESIS
```

- **Observed problem:** a digest without accessible content does not enable
  independent reconstruction; a retained artifact may have finite availability.
- **Supporting cases:** AFR-01's packet references, AFR-03's
  [artifact][artifact03] and [qualification report][qualification03], AFR-05's
  original ZIP and privately held receipt.
- **Counterexamples:** AFR-03's ordinary provider artifact was sufficient
  during observation. Intentional privacy may properly prevent public byte
  access.
- **Proposed mechanical property:** an evidence reference could distinguish a
  content identity, actual retrieval location, access boundary and observed
  expiry/availability rather than treating a hash as an attachment.
- **Uncertainty:** no retention service or public-disclosure requirement is
  justified. Failure after actual expiry was not observed.

### AFR-C04 — Stage-specific disposition pointers

```text
CANDIDATE_ID=AFR-C04
STATUS=NON_NORMATIVE_RESEARCH_HYPOTHESIS
```

- **Observed problem:** old draft/review/publication wording can coexist with
  later acceptance, merge or non-execution dispositions.
- **Supporting cases:** AFR-01's two candidate review summaries; AFR-03's
  separate inert qualification and later rejection; AFR-05's contract-only
  acceptance; AFR-06's merged metadata and integration handoff.
- **Counterexamples:** native provider state and existing final comments
  resolved many questions without a new record type. Immutable stage reports
  preserve useful history and should not be rewritten merely to mirror current
  status.
- **Proposed mechanical property:** a bounded final disposition could identify
  its exact subject and link to prior stages, without equating publication,
  semantic acceptance, execution and integration.
- **Uncertainty:** reduced reconstruction effort is a hypothesis, not a
  measured effect. No new lifecycle protocol or architecture is adopted.

## G. Empirical extraction conclusions

1. **What these workflows revealed:** substantial artifact/work/record chains
   can be recovered through existing public GitHub surfaces, but complete
   historical instructions and receipt cannot be inferred from those chains.
2. **Apparently useful practices in scope:** exact identities, explicit work
   links, preserved STOP/correction records, bounded handoffs and separate
   provider-versus-actor claims supported the observed reconstructions.
3. **Recurring difficulties:** fragmented surfaces, mutable stage descriptions,
   unavailable raw packets, source references without bytes and uncertain
   historical execution provenance required qualification.
4. **Potentially unnecessary mechanisms:** these cases do not demonstrate a
   need for a dedicated originating Issue, native PR review, two-parent merge
   or new universal work-record schema in every reconstruction. Some repeated
   identity text helped cross-checking; its net redundancy cost was not
   measured.
5. **Further investigation:** delivery evidence, retention effects,
   reconstruction effort and claim comparability merit questions for separately
   authorized work. No additional campaign, implementation Issue or controlled
   experiment begins.
6. **Challenged expectations:** empty native reviews need not mean no public
   review reports; closed work need not mean an experiment ran; a merged
   artifact need not have two parents; rich public records need not establish
   prompt receipt; favorable publication need not mean favorable research
   findings.
7. **Unsupported claims:** historical completeness, universal recovery
   reliability, representative sampling, causal benefits, inference efficiency,
   authenticated historical agent identity, product conformance and
   architecture necessity.

The findings retain value as Proto-Lithify empirical knowledge even without any
future Lithify use. They are not a justification for implementing a
predetermined mechanism.

## H. Methodological limitations

### Sample and dependence

The six cases are purposively selected from four repositories under the same
GitHub owner. Two repositories contribute two cases each. Shared governance,
operator and publication practices limit independence and generalization. This
is not a representative sample or a reliability benchmark.

### Exploratory isolation

Fresh sessions and withheld initial case hints are documented, but technical
confinement was not established. There are no blind runs. Later linked records
can reveal retrospective information; current records need not equal their
historical versions. No isolated holdout or controlled agent comparison exists.

### Reporting and evaluation layers

Every raw investigator report received `STRUCTURAL_VALIDATION=FAIL` and a
`PARTIAL` disposition. Evaluator-authored case reports supply the accepted
presentation without replacing the raw records. These partial results cannot be
reported as six fully qualified raw investigations.

Evaluators counted unresolved questions differently; AFR-06's zero ambiguity
count does not mean it established historical receipt. AFR-02 reports one
`EVALUATOR_ONLY_DISCOVERY` for checking public protocol/template provenance;
other evaluators treat equivalent authority/runtime checks as supplementation,
not case discoveries. That authority check is not credited as investigator
recovery or as a newly discovered historical work relationship. No case had a
dimension-status correction. The labels and differences are preserved, not
pooled into a score.

The controller assembles the evaluator drafts and this synthesis, performing
presentation/sanitization and mechanical checks, not an additional hidden case
investigation or a second evaluation attempt. Final independent
research-document review remains a distinct publication gate recorded with the
candidate.

### Public access and confidentiality

The two non-public Project returns are explicit scope deviations. Excluding
their contents limits evidential use but does not make acquisition compliant.
Private raw traces are not public evidence. No claim of perfect public-only
execution is made. The case reports contain only the admissible public-source
findings and disclosed limits.

### Completeness and epistemic limits

Recovery coverage concerns declared dimensions within the examined boundary.
Historical completeness is unknown. Exact source hashes establish byte
identity, not source truth, reviewer independence or historical agent receipt.
Missing records may have existed elsewhere; private or unexamined records were
not reconstructed from final changes.

### Measurement and causal limits

Request accounting measures logical CLI invocations, not all HTTP transport
attempts. Per-request latency, manual interventions, monetary charges and
controller inference use are unmeasured. Token counters include initialization
and cache categories. Elapsed times include model processing and report
capture. Different histories, claim scopes, output sizes and access conditions
prevent an inference-efficiency comparison. No general reliability percentage,
causal inference or preservation guarantee follows.

### Source volatility

Issue bodies, PR descriptions and Project state are mutable. Observations are
bound to their recorded dates and preserved traces, not assumed permanent.
Public artifacts may expire. Reviewer histories, packet supply and local test
claims remain limited to the evidence actually recovered.

## I. Relationship to Lithify

Proto-Lithify's empirical findings are available as potential evidence for a
separate, future Lithify confrontation.

They do not amend Lithify Product Intent, constitute independent derivation,
select Lithify's architecture, or require adoption of observed GitHub
mechanisms.

## Evidence references

The six linked case reports preserve complete dimension rows, discovery
sequences, source identities, original classifications, evaluator findings,
measurements and raw-to-public provenance hashes. The raw reports, tool traces,
initial-context records and actual runtime captures remain task-owned private
evidence, not published private session histories.

[protocol]:
  https://github.com/fanilosendrison/proto-lithify/blob/91727041cddcedcdd83903617d4061de78473a8c/docs/research/artifact-first-recoverability/protocol-v1.md
[pr01]: https://github.com/fanilosendrison/proto-lithify/pull/26
[pr02]: https://github.com/fanilosendrison/ruu/pull/66
[pr03]: https://github.com/fanilosendrison/proto-scope/pull/56
[pr04]: https://github.com/fanilosendrison/proto-scope/pull/31
[pr05]: https://github.com/fanilosendrison/proto-ring/pull/139
[pr06]: https://github.com/fanilosendrison/proto-lithify/pull/37
[work01]: https://github.com/fanilosendrison/proto-lithify/issues/7
[work02]: https://github.com/fanilosendrison/ruu/issues/63
[work03]: https://github.com/fanilosendrison/proto-scope/issues/55
[work04]: https://github.com/fanilosendrison/proto-scope/issues/25
[work05]: https://github.com/fanilosendrison/proto-ring/issues/134
[companion]: https://github.com/fanilosendrison/lithify/pull/2
[handoff06]:
  https://github.com/fanilosendrison/lithify/issues/1#issuecomment-6640684840
[stop01]:
  https://github.com/fanilosendrison/proto-lithify/issues/7#issuecomment-6422386893
[final01]:
  https://github.com/fanilosendrison/proto-lithify/issues/7#issuecomment-6425340115
[final02]:
  https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6445422947
[continuation02]: https://github.com/fanilosendrison/ruu/issues/67
[reconstruction02]:
  https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6416610349
[correction02]:
  https://github.com/fanilosendrison/ruu/issues/63#issuecomment-6420966693
[artifact03]:
  https://github.com/fanilosendrison/proto-scope/actions/runs/40234216650
[qualification03]:
  https://github.com/fanilosendrison/proto-scope/blob/1651c7fe952c1e4e466dec788e14862176fd2924/docs/research/derivtrace/falsification/dt-03-e-actions-probe-qualification.md
[nonexecution03]:
  https://github.com/fanilosendrison/proto-scope/issues/45#issuecomment-6590579882
[stop04]:
  https://github.com/fanilosendrison/proto-scope/issues/25#issuecomment-6389793105
[accept05]:
  https://github.com/fanilosendrison/proto-ring/issues/134#issuecomment-6637682924
[bytecode05]:
  https://github.com/fanilosendrison/proto-ring/commit/93622fa4d4b8725f58f04bdce733f4e842653211
[cleanup05]:
  https://github.com/fanilosendrison/proto-ring/commit/3e9a6bf5f1eb217ae42401f5b34b64810a07d127
[reviews06]:
  https://github.com/fanilosendrison/lithify/pull/2#issuecomment-6640557544
