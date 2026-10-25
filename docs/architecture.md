---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "architecture"
domain: "proto-lithify"
severity: "strict"
name: "Proto-Lithify architecture"
version: "0.3.3"
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
locking, or command-discriminated receipt envelopes. Version 0.3.3 adds bounded
direct-child cancellation without remote rollback, process-tree termination,
automatic retry, or serialization guarantees. No version claims multi-command
transactions; each command exposes and verifies only its own effect.
