---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "contract"
domain: "proto-lithify"
severity: "strict"
name: "Proto-Lithify CLI contract"
version: "0.3.0"
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

Published JSON Schemas are generated under `schemas/` from the runtime Zod
contracts.

Version 0.3.0 removes the `--issue-url` input accepted by version 0.2.1. This is
an intentional breaking CLI change; receipt schema version 1 remains unchanged.

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
