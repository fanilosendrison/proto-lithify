---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "contract"
domain: "proto-lithify"
severity: "strict"
name: "Proto-Lithify CLI contract"
version: "0.3.2"
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

Success writes exactly one JSON receipt to stdout. Diagnostics and errors write
to stderr. Receipt schema version 1 distinguishes `inspected`, `applied`, and
`noop`. Mutation success requires a fresh read proving the requested
postcondition. Project membership is established only when the Issue projection
and the Project's own item collection contain the same unique item identity.

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

Snapshot observations prove only the command's fresh observed postcondition;
they do not establish global serialization against concurrent actors.
GitHub.com completeness currently relies on the published limit of 50
dependencies per relationship type and a list request capacity of 100. An
over-limit response fails closed rather than triggering speculative pagination.

Published JSON Schemas are generated under `schemas/` from the runtime Zod
contracts, including `dependency-snapshot.schema.json`.

Version 0.3.0 removes the `--issue-url` input accepted by version 0.2.1. This is
an intentional breaking CLI change; receipt schema version 1 remains unchanged.
Version 0.3.1 changes only standalone installation from already immutable
payloads; the CLI input and receipt contracts remain unchanged. Source version
0.3.2 adds the identity-safe dependency snapshot contract without changing
receipt schema version 1 or command arguments.

## Failure

Failures use a nonzero exit code and a versioned error receipt. Access denial,
missing or ambiguous identities, malformed GitHub responses, mutation failure,
and postcondition mismatch fail closed. Diagnostics redact authorization
headers, GitHub token forms, bearer values, and credential-bearing URLs.

## Mechanical boundary

The CLI may inspect Projects and items, add an explicitly identified Issue to a
Project, set an explicitly named single-select option, and add an explicitly
identified same-repository blocker. It does not create findings, choose fields,
select options, infer dependencies, or close Issues.
