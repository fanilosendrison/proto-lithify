---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "architecture"
domain: "proto-lithify"
severity: "strict"
name: "Proto-Lithify architecture"
version: "0.3.2"
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

## Modules

- `src/cli/` validates command syntax.
- `src/github/` owns shell-free process execution and GitHub response handling.
  Its `issue-identity.ts` module is the single implementation of GitHub
  repository decomposition and Issue URL construction.
- `src/project-items/` owns exact item and field mutation orchestration.
- `src/issue-relations/` owns explicit blocked-by relationships, strict REST
  Issue identity parsing, and bounded complete dependency observations.
- `src/receipts/` owns public output schemas, including the authoritative
  dependency identity collection and its compatibility projection.
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
locking, or command-discriminated receipt envelopes. No version claims
multi-command transactions; each command exposes and verifies only its own
effect.
