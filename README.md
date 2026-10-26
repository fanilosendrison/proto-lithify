---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "documentation"
domain: "proto-lithify"
severity: "guideline"
name: "Proto-Lithify CLI"
version: "0.4.0"
---

# Proto-Lithify

`proto-lithify` is a mechanical GitHub Project V2 adapter for
coding-agent workflows. It discovers live GitHub identities, performs explicit
Project mutations, verifies postconditions from both Issue and Project
membership projections, and emits versioned JSON receipts.

It does not decide workflow status, priority, readiness, Issue scope, or product
semantics. Those decisions remain with the invoking agent policy and the target
repository's Engineering Project profile.

## Requirements

- Node.js 22.19.0 or newer
- pnpm 11.24.0 for development and installation
- the official authenticated GitHub CLI

## Development

```bash
pnpm install
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run build
```

Tests use fake `gh` executables and never mutate live GitHub state.

## Installation

```bash
pnpm run install:standalone
```

The installer deploys an immutable content-addressed release below
`$XDG_DATA_HOME/proto-lithify`, falling back to
`~/.local/share/proto-lithify`, and exposes:

```text
~/.local/bin/proto-lithify
```

The installed command does not depend on this checkout or invoke pnpm.
Version 0.3.1 supports installation from an already immutable payload on
filesystems that prohibit renaming write-disabled directories. Version 0.3.2
adds canonical blocker identities to dependency receipts while retaining the
legacy numeric projection. Version 0.3.3 adds bounded, termination-aware
cancellation of the direct `gh` child and explicit errors when termination or
stream closure cannot be confirmed. Version 0.3.4 binds Project-item mutation
receipts to the requested target and preserves opaque identity across
`field.set` observations. Version 0.3.5 makes Project membership archive-complete
and exposes GitHub's required boolean `isArchived` on every item snapshot.
Version 0.4.0 is a breaking serialized-protocol release: new success and error
receipts use strict schema version 2 contracts. Historical version 1 receipts
remain readable through explicitly named legacy and versioned reader schemas;
they are never relabelled or treated as version 2 evidence.

Archived Project items remain members: archivedness is not absence and does not
imply repository workflow completion. `item inspect` reports it, `item add`
treats active or archived membership as an existing-member no-op, and
`field set` never implicitly unarchives. An archived item can produce a field
no-op only when the requested value is already observed; otherwise mutation is
rejected before option resolution.

A verified receipt reports a validated observation, not global serialization,
exclusive causality, an atomic GitHub snapshot, or permanent state. Archive-
complete membership and field connections are fully paginated, and every
projection must agree on the exact item ID and GitHub-sourced archive flag. The
caller owns semantic authorization, participating-agent ordering, conflict
decisions, and retry policy; GitHub remains the durable state owner.

Local child termination never proves remote mutation rollback. Proto-Lithify
does not automatically retry a potentially mutating invocation after an
ambiguous post-spawn failure. Direct-child supervision also makes no guarantee
about descendants. See the CLI contract for the complete cancellation and
remote-effect boundary.

## Commands

```text
proto-lithify doctor
proto-lithify project inspect --project-owner <owner> --project-number <number>
proto-lithify item inspect --project-owner <owner> --project-number <number> --repo <owner/repository> --issue <number>
proto-lithify item add --project-owner <owner> --project-number <number> --repo <owner/repository> --issue <number>
proto-lithify field set --project-owner <owner> --project-number <number> --repo <owner/repository> --issue <number> --field-name <field> --option-name <option>
proto-lithify dependency add-blocker --repo <owner/repository> --issue <number> --blocker <number>
```

`item add` derives the GitHub Issue URL exclusively from `--repo` and `--issue`.
The former independent `--issue-url` flag is rejected.

Dependency receipts expose canonical identities through `blockedByIssues`. The
public contracts are generated from the runtime Zod authorities. The canonical
`command-receipt.schema.json` and `error-receipt.schema.json` assets validate
only strict producer version 2. Historical consumers use the explicit
`command-receipt-v1.schema.json` and `error-receipt-v1.schema.json` assets;
mixed readers use `versioned-command-receipt.schema.json` and
`versioned-error-receipt.schema.json`. Snapshot assets remain separately
available for Projects, items, and dependencies.

Version 2 has exactly nine authorized success variants across the six commands.
Targets, requests, snapshots, and true-only postconditions are command-specific
and reject unknown fixed-object properties. New item snapshots require
`isArchived`, and new dependency snapshots require `blockedByIssues`. Historical
version 1 payloads lacking those fields remain legacy-readable because the old
weak envelope is preserved without reinterpretation.

Consumers that hardcode `schemaVersion=1` must migrate to version 2 or select an
explicit versioned reader. The source implementation does not update the global
installed CLI; rollout remains separately authorized. Receipt validation proves
structural compliance only, not unique remote causality, atomic observation,
permanence, or rollback.

See [the CLI contract](docs/cli-contract.md) and
[the architecture](docs/architecture.md) for authority and output guarantees.
