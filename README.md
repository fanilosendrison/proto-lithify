---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "documentation"
domain: "proto-lithify"
severity: "guideline"
name: "Proto-Lithify CLI"
version: "0.3.5"
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
public contracts are generated as
[`dependency-snapshot.schema.json`](schemas/dependency-snapshot.schema.json) and
[`item-snapshot.schema.json`](schemas/item-snapshot.schema.json). New item
snapshots require `isArchived`; historical item snapshots lacking it do not
validate against the strict 0.3.5 snapshot schema, while generic receipt
envelopes remain at `schemaVersion=1`.

See [the CLI contract](docs/cli-contract.md) and
[the architecture](docs/architecture.md) for authority and output guarantees.
