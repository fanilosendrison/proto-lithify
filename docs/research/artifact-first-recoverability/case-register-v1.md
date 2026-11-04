---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "research-case-register"
domain: "proto-lithify"
severity: "strict"
name: "Artifact-first recoverability frozen controller case register"
version: "0.1.0"
---

# Artifact-first recoverability frozen case register v1

<!-- study-id: PL-R-AFR-20261104 -->

## Scope and controller boundary

This is controller-held evaluation metadata for
[protocol v1](protocol-v1.md), not an investigator discovery packet. Initial
case-specific input consists exclusively of repository full name and exact Git
merge commit SHA. PR numbers and descriptive labels must not be supplied as
initial discovery hints. A later run unable to establish that isolation must
use `NON_BLIND_EXPLORATORY`, not claim blind artifact-first recovery.

These six cases were preselected from publicly visible, merged GitHub PRs.
The corpus deliberately contains implementation work, workflow changes,
research consolidation, contract publication, and methodological documentation.
This is a diagnostic diversity choice, not a claim of representative sampling.
No investigation results belong in this register. Setup identity verification
is not an artifact-first recovery result.

## Frozen corpus

| Case ID | Repository | PR URL | Exact merge commit SHA
| ------- | ---------- | ------ | ----------------------
| AFR-01 | fanilosendrison/proto-lithify | [#26](https://github.com/fanilosendrison/proto-lithify/pull/26) | `09214e07e7095dd3cd9b8fc31e68a3878ac07e76`
| AFR-02 | fanilosendrison/ruu | [#66](https://github.com/fanilosendrison/ruu/pull/66) | `621281abaa37259be6b9e2fa48bb80e40e36cd33`
| AFR-03 | fanilosendrison/proto-scope | [#56](https://github.com/fanilosendrison/proto-scope/pull/56) | `f9b53f07a27fb4489314786066951970bff50327`
| AFR-04 | fanilosendrison/proto-scope | [#31](https://github.com/fanilosendrison/proto-scope/pull/31) | `9e5bf1cb7718317a95d725156f0eed69d9a9b9cb`
| AFR-05 | fanilosendrison/proto-ring | [#139](https://github.com/fanilosendrison/proto-ring/pull/139) | `a1b27ca1e21423973a5557415488e4fcd535d01a`
| AFR-06 | fanilosendrison/proto-lithify | [#37](https://github.com/fanilosendrison/proto-lithify/pull/37) | `025bc880281d42f67aaf4b5ae0b410e0e8056e6e`

## Setup verification evidence

Read-only official GitHub API observations on 2026-11-04, completed before
`2026-11-04T21:32:31Z`, independently checked repository `full_name` and
`private=false`, PR existence, `merged=true`, and `merge_commit_sha` equality
against every frozen value. The repository and PR API URLs below identify the
exact objects observed. These observations establish identity and public access
at setup time, not future availability, record truth, or historical completeness.

| Case ID | Repository | Repo API | PR API | SHA | Public | Merged | Verification
| ------- | ---------- | -------- | ------ | --- | ------ | ------ | ------------
| AFR-01 | fanilosendrison/proto-lithify | <https://api.github.com/repos/fanilosendrison/proto-lithify> | <https://api.github.com/repos/fanilosendrison/proto-lithify/pulls/26> | `09214e07e7095dd3cd9b8fc31e68a3878ac07e76` | true | true | VERIFIED
| AFR-02 | fanilosendrison/ruu | <https://api.github.com/repos/fanilosendrison/ruu> | <https://api.github.com/repos/fanilosendrison/ruu/pulls/66> | `621281abaa37259be6b9e2fa48bb80e40e36cd33` | true | true | VERIFIED
| AFR-03 | fanilosendrison/proto-scope | <https://api.github.com/repos/fanilosendrison/proto-scope> | <https://api.github.com/repos/fanilosendrison/proto-scope/pulls/56> | `f9b53f07a27fb4489314786066951970bff50327` | true | true | VERIFIED
| AFR-04 | fanilosendrison/proto-scope | <https://api.github.com/repos/fanilosendrison/proto-scope> | <https://api.github.com/repos/fanilosendrison/proto-scope/pulls/31> | `9e5bf1cb7718317a95d725156f0eed69d9a9b9cb` | true | true | VERIFIED
| AFR-05 | fanilosendrison/proto-ring | <https://api.github.com/repos/fanilosendrison/proto-ring> | <https://api.github.com/repos/fanilosendrison/proto-ring/pulls/139> | `a1b27ca1e21423973a5557415488e4fcd535d01a` | true | true | VERIFIED
| AFR-06 | fanilosendrison/proto-lithify | <https://api.github.com/repos/fanilosendrison/proto-lithify> | <https://api.github.com/repos/fanilosendrison/proto-lithify/pulls/37> | `025bc880281d42f67aaf4b5ae0b410e0e8056e6e` | true | true | VERIFIED

Reproduction uses `gh api repos/<repository>` followed by
`gh api repos/<repository>/pulls/<number>` for each entry. No source repository
was mutated. No prompt, work-history reconstruction, or campaign assessment was
performed during these identity checks.

If any verification fails or an expected public resource is inaccessible, stop
and preserve the exact failure. Do not replace a case, change a SHA, select
another commit, or alter the sample silently. Preserve this six-case set before
evidence interpretation. Use the [empty report template](report-template-v1.md)
only in a separately authorized campaign after protocol acceptance.
