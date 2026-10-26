---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "contract"
domain: "proto-lithify"
severity: "strict"
name: "Proto-Lithify CLI contract"
version: "0.4.0"
---

# CLI contract

## Input

Commands accept explicit textual routing and semantic names. They never accept
persisted opaque GitHub IDs as configuration. Unknown commands, flags, duplicate
flags, malformed repositories, and non-positive Issue or Project numbers fail
before GitHub access.

`item.add` has one canonical Issue identity: the validated `owner/repository`
and positive safe-integer Issue number. The command derives the mutation URL
from that identity and rejects an independent `--issue-url` input before GitHub
access. The `request.issueUrl` value in a successful receipt is this derived URL,
not an accepted command argument.

## Output

Success writes exactly one JSON receipt to stdout only after the complete
candidate passes the strict producer schema. Diagnostics and errors write to
stderr. Source version 0.4.0 emits schema version 2 for both success and error
receipts. Mutation success still requires a fresh read proving the requested
postcondition. Project membership is established only when the Issue projection
and the Project's own item collection contain the same unique item identity.

### Strict version 2 success variants

Exactly nine command/outcome combinations are structurally valid:

| Command | Outcome | Before | After |
| ------- | ------- | ------ | ----- |
| `doctor`                 | `inspected` | `null`             | Doctor snapshot    |
| `project.inspect`        | `inspected` | `null`             | Project snapshot   |
| `item.inspect`           | `inspected` | `null`             | Item snapshot      |
| `item.add`               | `noop`      | Item snapshot      | Item snapshot      |
| `item.add`               | `applied`   | `null`             | Item snapshot      |
| `field.set`              | `noop`      | Item snapshot      | Item snapshot      |
| `field.set`              | `applied`   | Item snapshot      | Item snapshot      |
| `dependency.add-blocker` | `noop`      | Dependency snapshot | Dependency snapshot |
| `dependency.add-blocker` | `applied`   | Dependency snapshot | Dependency snapshot |

Every branch has literal command and outcome tags, a true-only verified
postcondition, and strict command-specific target and request objects. `doctor`
uses empty target/request objects. Project inspection targets an owner and
positive safe Project number. Item commands target an owner, Project number,
canonical repository, and Issue number. Item addition requests the derived
canonical Issue URL; field mutation requests nonempty field and option names.
Dependency addition targets a canonical repository/Issue and requests a positive
safe blocker number.

The Doctor snapshot contains only a nonempty `ghVersion` and literal
`authenticated:true`. Fixed snapshot and identity objects reject unknown
properties. `ItemSnapshot.fields` remains intentionally open. The optional
Project identity URL accepts canonical GitHub.com user or organization Project
URLs. New version 2 item snapshots require `isArchived`; dependency snapshots
require `blockedByIssues`.

### Versioned schema migration

Source 0.3.5 and earlier emitted a weak generic version 1 envelope whose payloads
were not command-specific. The historical reader preserves that exact weak input
contract, including old item snapshots without `isArchived` and dependency
snapshots without `blockedByIssues`. It does not invent fields, relabel data, or
certify legacy payloads as version 2.

The generated schema assets are:

- `command-receipt.schema.json`: strict producer version 2 success;
- `error-receipt.schema.json`: strict producer version 2 error;
- `command-receipt-v1.schema.json`: historical version 1 success input;
- `error-receipt-v1.schema.json`: historical version 1 error input;
- `versioned-command-receipt.schema.json`: explicit v1/v2 success reader;
- `versioned-error-receipt.schema.json`: explicit v1/v2 error reader.

Consumers that require version 1 must use the historical asset. Consumers that
accept persisted mixed data use the versioned reader. The 0.4.0 producer never
emits version 1 merely for an older consumer. Runtime Zod and generated Draft
2020-12 acceptance are independently checked with Ajv.

`dependency.add-blocker` resolves the requested blocker to its exact GitHub Issue
database ID, canonical lower-case repository, and repository-scoped Issue
number before evaluating idempotence. Dependency snapshots contain:

- `blockedByIssues`, the authoritative identity collection;
- `blockedBy`, a deprecated, potentially lossy compatibility projection of
  unique positive Issue numbers sorted ascending.

Equal Issue numbers from different repositories do not establish the same
relationship. A verified `noop` or `applied` outcome requires the exact canonical
ID, repository, and Issue number in a complete validated observation.
`blockedByIssues` is ordered by repository, Issue number, and database ID.

GitHub.com completeness currently relies on the published limit of 50
dependencies per relationship type and a list request capacity of 100. An
over-limit response fails closed rather than triggering speculative pagination.

Published JSON Schemas are generated under `schemas/` from the runtime Zod
contracts. Generated receipt assets distinguish current producer, historical
version 1, and explicit versioned-reader contracts.

Version 0.3.0 removes the `--issue-url` input accepted by version 0.2.1. This is
an intentional breaking CLI change; receipt schema version 1 remains unchanged.
Version 0.3.1 changes only standalone installation from already immutable
payloads; the CLI input and receipt contracts remain unchanged. Source version
0.3.2 adds the identity-safe dependency snapshot contract without changing
receipt schema version 1 or command arguments. Source version 0.3.3 preserves
those arguments and receipt schema while making local `gh` cancellation
termination-aware. Source version 0.3.4 preserves the same public inputs and
receipt shape while binding Project-item mutation evidence to validated target
identity. Source version 0.3.5 preserves those inputs and the generic version-1
envelope while adding required GitHub-sourced archivedness to every item
snapshot. Source version 0.4.0 preserves CLI syntax and operation behavior while
making both producer envelopes strict version 2 contracts; the historical v1
input contract remains separately available.

## Archive-complete item snapshots

An archived Project item remains membership. Archivedness is neither absence nor
a repository workflow status. Every `ItemSnapshot` contains the required,
noncoerced `isArchived` boolean returned by GitHub; it is never inferred from a
Status field, Issue closure, dates, views, or policy.

Issue-side membership explicitly requests `includeArchived:true`. Project-side
membership explicitly requests `archivedStates:[ARCHIVED,NOT_ARCHIVED]`. Both
connections are traversed completely with the same filters on every page. The
projections must each contain exactly one matching item and agree on its exact
ID and archive flag. Every completely paginated field-value response must repeat
that same ID and archive flag. Missing, duplicated, partial, contradictory, or
nonboolean evidence fails closed. These sequential reads establish internally
consistent observations, not an atomic global snapshot.

`item.inspect` reports active or archived membership. `item.add` treats either as
an existing-membership `noop`, submits no add, and never unarchives. After an
actual add, a fresh valid observation may be archived if another actor archived
the item; membership still satisfies the add predicate without proving exclusive
creation or archiving.

`field.set` on an initially archived item is a one-read `noop` only when the
requested value already matches. A differing value is rejected before option
resolution or mutation, with no unarchive or recreation. For an initially active
item, a verified `applied` receipt requires the fresh observation to remain
active. Observed concurrent archiving rejects success after submission without
rollback or automatic retry. GitHub's current mutation input has no atomic
archivedness precondition, so an intermediate transition can escape observation.

The required nested field was an additive JSON payload evolution and a strict
snapshot-validation change in 0.3.5. Historical `ItemSnapshot` JSON without
`isArchived` does not validate against the current `ItemSnapshotSchema`, but it
remains readable through the preserved weak version 1 receipt input contract.
The strict version 2 producer requires the current nested snapshot.

## Observation-backed mutation semantics

`postcondition.verified=true` means only that observations obtained and
validated during this invocation satisfy the command's specified predicate for
the target identity established by those observations. It does not prove an
atomic GitHub snapshot, semantic authorization, global serialization, exclusive
write causality, absence of another actor, permanence, or future invariance.

`outcome=noop` means no requested mutation was submitted because one validated
initial observation already satisfied the predicate. The same observation is
reported as both `before` and `after`; no second read is implied:

- `field.set` observed the requested option on the exact inspected Project item;
- `item.add` observed the exact Issue already represented by the requested
  Project membership;
- `dependency.add-blocker` observed the exact canonical blocker identity.

`outcome=applied` means the explicit mutation was submitted, its provider
invocation returned without execution error, and a subsequent validated
observation satisfied the requested predicate for the intended identity. It
does not attribute the result exclusively to this invocation. Independent
callers may each receive `applied` after writing or adding the same value or
relationship.

For `field.set`, the initial and subsequent snapshots must match the request's
Project owner/number and Issue repository/number. The opaque Project, Issue, and
Project-item IDs must remain byte-for-byte identical across the two snapshots;
owner and repository names use validated case-insensitive GitHub identity.
Unrelated mutable field values may change. `item.add` applies the same request
binding to an existing membership or fresh post-add membership.
`dependency.add-blocker` continues to use the exact canonical
`{id,repository,number}` identity in `blockedByIssues`.

If a mutation may have been submitted but fresh inspection fails, changes target
identity, or does not satisfy the requested predicate, no affirmative receipt is
emitted. The remote effect can still have occurred or remain in flight, and no
automatic retry or rollback claim is made.

```text
OBSERVED_POSTCONDITION != GLOBAL_SERIALIZATION

OBSERVED_VALUE != EXCLUSIVE_WRITE_CAUSALITY

FRESH_READS != ATOMIC_GLOBAL_SNAPSHOT

SUCCESSFUL_RECEIPT != PERMANENT_STATE
```

## Failure

Failures use a nonzero exit code and a versioned error receipt. Access denial,
missing or ambiguous identities, malformed GitHub responses, mutation failure,
and postcondition mismatch fail closed. Diagnostics redact authorization
headers, GitHub token forms, bearer values, and credential-bearing URLs.

New error receipts use strict schema version 2 while retaining the existing
`error.code` and `error.message` meanings. `RECEIPT_VALIDATION_FAILED` identifies
only a malformed candidate at the final success-output boundary. It emits no
success line, exposes no raw candidate or unbounded validator diagnostics, and
does not authorize retry or claim rollback. Existing process codes remain
compatible:

- `GH_START_FAILED` means launch failed before the child emitted `spawn`;
- `GH_COMMAND_FAILED` means a normally closed invocation terminated
  unsuccessfully;
- `GH_TIMEOUT` means timeout cancellation ended with confirmed direct-child
  termination and normal stream closure;
- `GH_OUTPUT_LIMIT` means output-limit cancellation ended with the same local
  confirmations.

Two codes represent outcomes that cannot safely use the confirmed codes:

- `GH_TERMINATION_UNCONFIRMED` means the bounded termination deadline expired
  without a direct-child `exit` or normal `close` confirmation. The local child
  may still be running;
- `GH_STREAM_CLOSURE_UNCONFIRMED` means direct-child exit was observed, but
  normal stdout/stderr closure was not confirmed within the bounded interval.

Cancellation requests `SIGTERM`, waits up to 1,000 milliseconds for direct-child
exit, requests `SIGKILL` once if needed, and waits another 1,000 milliseconds
for confirmation. After direct-child exit, normal stream closure receives a
separate 1,000 millisecond bound. These are Node event-loop deadlines, not hard
real-time guarantees. Supervision applies only to the directly spawned `gh`
process, not every possible descendant.

## Remote mutation uncertainty

```text
LOCAL_PROCESS_TERMINATION != REMOTE_MUTATION_CANCELLATION

MUTATION_ERROR_AFTER_SPAWN => REMOTE_EFFECT_UNDETERMINED
```

Any error after successful launch of a potentially mutating invocation can leave
the remote effect applied, absent, or still in flight. This includes
`GH_COMMAND_FAILED`, both confirmed cancellation codes, both unconfirmed codes,
successful signal delivery, direct-child exit, and stream closure. None proves
remote rollback or absence of a GitHub mutation. Proto-Lithify does not
automatically retry an ambiguous mutation failure. A caller must obtain fresh
authoritative observations and make a separately qualified retry or idempotence
decision. A verified pre-spawn failure is the only case in which that invocation
could not have transmitted a request through the child.

## Mechanical boundary

The CLI may inspect Projects and items, add an explicitly identified Issue to a
Project, set an explicitly named single-select option, and add an explicitly
identified same-repository blocker. It does not create findings, choose fields,
select options, infer dependencies, or close Issues.
