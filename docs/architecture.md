---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "architecture"
domain: "proto-lithify"
severity: "strict"
name: "Proto-Lithify architecture"
version: "0.4.1"
---

# Architecture

## Authority

GitHub owns durable Project and Issue state. Target-repository profiles own
routing, exact field vocabulary, and local technical-authority order. Dotagents
owns agent workflow decisions. This repository owns only mechanical GitHub
access, mutation, verification, and receipt production.

## Runtime flow

```text
agent policy + repository profile
              |
              v
explicit CLI arguments
              |
              v
GitHub adapter -> official gh -> GitHub APIs
              |
              v
bidirectional fresh postcondition read -> versioned receipt
```

The CLI never selects work or infers a desired status. Opaque Project, item,
field, option, and Issue IDs are discovered from live state for each operation.
For `item.add`, the validated repository and Issue number establish one
canonical identity before inspection. The same identity controls inspection,
mutation URL derivation, and fresh postcondition verification.

For `dependency.add-blocker`, the adapter resolves the requested same-repository
blocker before reading relationships. Every REST dependency entry is validated
as an exact GitHub.com database ID, canonical repository, and Issue number from
consistent API and web URLs. Idempotence and postcondition checks compare that
complete identity. The legacy number-only projection remains output
compatibility data and is never proof of relationship identity.

Dependency inspection is complete only within the current GitHub.com contract:
50 dependencies per relationship type fit in the requested page capacity of
100. Over-limit or contradictory observations fail closed. This boundary does
not claim global concurrency serialization or completeness for a different
provider contract.

## REST API version boundary

`src/github/rest-api.ts` owns the sole production version constant,
`2022-11-28`, and appends one exact `X-GitHub-Api-Version: 2022-11-28` header to
every direct REST argument array. The three construction categories are blocker
Issue identity GET, blocked-by collection GET, and blocked-by POST. Fresh
post-mutation dependency observation reuses the same collection path and is
therefore versioned identically.

This narrow constructor does not wrap the generic executor. GraphQL remains
`gh api graphql`, while Project reads and mutations remain official `gh project`
commands; neither receives the REST header. The version has no environment,
caller, or CLI override and no provider-default, negotiation, fallback, or retry
path.

GitHub currently announces support through March 10, 2028. Migration before
retirement requires a separately reviewed repository change, target-version
breaking-change assessment, and endpoint qualification. Pinning does not prevent
additive or exceptional provider changes and does not freeze state or serialize
callers. A `410 Gone` or another failure propagates normally. If a POST may have
been submitted, any POST or fresh-read failure preserves remote-effect
uncertainty without automatic retry or rollback claim.

## Archive-complete membership observation

Project membership includes active and archived items. The Issue projection
uses explicit archive inclusion and the Project collection uses both archive
states on every page. Both connections are traversed to completion without an
arbitrary page ceiling. Cursor absence or repetition, partial GraphQL errors,
duplicate matches, identity disagreement, or archive-state disagreement fails
closed; only complete absence in both projections means not found.

The selected membership is an exact `{id,isArchived}` observation. Every page
of its field-value connection must repeat both values, and field names remain
unique across the complete traversal. `ItemSnapshotSchema` then validates the
composite. Archivedness comes only from GitHub's boolean Project-item property,
not Status, Issue closure, views, dates, or workflow policy.

Operations preserve lifecycle without owning policy. `item.add` treats archived
membership as present and never adds a duplicate or unarchives it. `field.set`
permits an archived no-op only for an already matching value and otherwise
rejects before resolution or mutation. An initially active edit must still be
observed active afterward. A concurrent archive observed after submission makes
the postcondition unverified, without retry or rollback. Because GitHub exposes
no atomic archivedness precondition for the edit mutation, undetected
intermediate transitions remain possible.

These are sequential, identity-bound observations, not a Project-wide atomic
snapshot. Archive inclusion increases traversal size linearly with the complete
Issue, Project, and selected field-value connections; no cache or partial fast
path weakens absence proof.

## Concurrency and observation boundary

Project-item operations validate every affirmative snapshot against the explicit
request. `field.set` additionally requires exact continuity of opaque Project,
Issue, and item IDs across its initial and post-mutation observations; validated
owner and repository names compare case-insensitively. Mutable titles, views,
and unrelated fields are not identity and may change concurrently.

`ProjectV2Client.inspectItem()` is a composite of multiple GraphQL requests.
Bidirectional membership agreement and schema validation establish consistency
of the identities and values that were fetched; they do not create one globally
simultaneous GitHub snapshot or a transaction-wide linearization point. The
currently documented `updateProjectV2ItemFieldValue` input has no expected-old-
value or revision precondition. `clientMutationId` is not a compare-and-set
token, so another read cannot eliminate the race immediately following it.

The responsibility boundary is:

- Proto-Lithify submits an explicit mutation and produces truthful,
  identity-bound observational evidence;
- the caller or orchestrator owns semantic authorization, participating-agent
  ordering, stale-intent arbitration, conflict decisions, and retry policy;
- GitHub owns durable state and only the atomicity and idempotence its APIs
  actually provide.

No local mutex, distributed lock, retry loop, synthetic revision, scheduler, or
cross-command transaction is introduced. A later mutation can change a state
that an earlier receipt truthfully observed, and concurrent identical writes do
not establish which caller exclusively caused the result.

```text
OBSERVED_POSTCONDITION != GLOBAL_SERIALIZATION

OBSERVED_VALUE != EXCLUSIVE_WRITE_CAUSALITY

FRESH_READS != ATOMIC_GLOBAL_SNAPSHOT

SUCCESSFUL_RECEIPT != PERMANENT_STATE
```

## Versioned receipt boundary

The source 0.4.1 output boundary accepts only the nine strict version 2 success
branches defined by command and outcome. Each candidate is validated as a whole
before any stdout byte is written. A validation failure emits one bounded,
sanitized version 2 error with `RECEIPT_VALIDATION_FAILED`; it does not emit a
partial success, repeat a mutation, or claim rollback. If a mutation was already
submitted, its remote effect remains undetermined.

Fixed receipt, target, request, postcondition, snapshot, and nested identity
objects reject unknown properties. The item field map is intentionally open.
The optional Project URL is constrained to canonical GitHub.com user or
organization Project URLs by one runtime/schema pattern. Runtime Zod contracts
generate the Draft 2020-12 assets directly, and an
independent Ajv corpus checks acceptance parity. Dynamic relations such as a
derived Issue URL matching its target and a field value matching its request
remain operation-level invariants rather than unsupported JSON Schema claims.

The producer emits only schema version 2 for success and error receipts. The
preserved version 1 schemas model the historical weak input envelope and do not
reuse current snapshot requirements. Versioned readers accept an explicitly
versioned v1 or v2 receipt without upgrading historical data. Canonical schema
filenames represent the current producer; `*-v1` and `versioned-*` assets expose
the two reader boundaries.

Structural receipt validation does not prove GitHub accepted a mutation, unique
causality, absence of concurrent interference, an atomic global snapshot,
permanent postconditions, remote non-application, or rollback. Existing
operation-level fresh-read and identity checks remain the evidence owners.

## Local process cancellation

The GitHub process runner supervises only the direct `gh` child created with
literal arguments, `shell: false`, and piped stdout/stderr. Its single-settlement
state machine distinguishes startup, running, cancellation, escalation,
direct-child exit, stream closure, and explicit unconfirmed outcomes.

A timeout or aggregate output-limit breach latches the first cause, stops output
retention while continuing to drain stream events, and requests `SIGTERM`. If no
`exit` is observed within the 1,000 millisecond grace interval, it requests
`SIGKILL` once and allows a further 1,000 milliseconds for termination
confirmation. `ChildProcess.kill()` success, `child.killed`, or elapsed time is
never termination evidence. `exit` confirms only direct-child termination; the
runner then allows 1,000 milliseconds for `close`, which additionally confirms
normal stdio closure. Missing termination and missing stream closure are exposed
as `GH_TERMINATION_UNCONFIRMED` and `GH_STREAM_CLOSURE_UNCONFIRMED`, respectively.
All owned cancellation timers are cleared through one settlement path.

The deadlines are bounded Node event-loop policy, not hard real-time guarantees.
The runner does not claim process-tree supervision: descendants can inherit pipe
descriptors or continue independently.

Local process state and remote mutation state are independent:

```text
LOCAL_PROCESS_TERMINATION != REMOTE_MUTATION_CANCELLATION

MUTATION_ERROR_AFTER_SPAWN => REMOTE_EFFECT_UNDETERMINED
```

After a potentially mutating invocation has spawned, no local error, signal
request, direct-child exit, or stream closure proves that GitHub did not apply or
will not apply the request. The adapter performs no automatic mutation retry
after such an ambiguous failure. Fresh postcondition observation can establish
state at the time of its read, but it does not prove historical non-execution or
serialize against in-flight remote work.

## Modules

- `src/cli/` validates command syntax.
- `src/github/` owns shell-free process execution and GitHub response handling.
  Its `issue-identity.ts` module is the single implementation of GitHub
  repository decomposition and Issue URL construction.
- `src/project-items/` owns exact item and field mutation orchestration.
- `src/issue-relations/` owns explicit blocked-by relationships, strict REST
  Issue identity parsing, and bounded complete dependency observations.
- `src/receipts/` owns strict producer, historical reader, versioned reader,
  snapshot, and final output-validation contracts. Snapshot schemas remain the
  single authorities reused by command-specific receipts.
- `src/installation/` owns immutable standalone installation. It keeps
  task-owned staging directories writable through atomic publication, then
  verifies content and immutable permissions before activation. This supports
  immutable payload sources without changing their permissions.

## Exclusions

Version 0.3.0, as originally released, had no LLM, daemon, SQLite database,
Turnlock workflow, profile parser, work selector, or GitHub command enforcer.
Version 0.3.1 retains these exclusions and changes only standalone installation
behavior. Version 0.3.2 adds identity-safe dependency observations without
adding cross-repository mutation syntax, provider-generic pagination, global
locking, or command-discriminated receipt envelopes. Version 0.3.3 adds bounded
direct-child cancellation without remote rollback, process-tree termination,
automatic retry, or serialization guarantees. Version 0.3.4 binds Project-item receipts to validated request and before/after
identity without adding atomic snapshots, exclusive causality, or locking.
Version 0.3.5 adds archive-complete membership and lifecycle-safe observations
without implicit unarchive, atomic archivedness preconditions, or caching.
Version 0.4.0 adds strict command-discriminated version 2 success and error
contracts without changing GitHub operations, adding retries, or rewriting
historical version 1 evidence. Version 0.4.1 pins the three direct REST request
categories to GitHub API version `2022-11-28` without changing GraphQL,
`gh project`, process execution, retries, mutation semantics, or receipt version
2. No version claims multi-command transactions; each command exposes and
verifies only its own observed postcondition.
