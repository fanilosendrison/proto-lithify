---
okf_version: "1.0"
kind: "KnowledgeAsset"
asset_type: "documentation"
domain: "proto-lithify"
severity: "guideline"
name: "Proto-Lithify standalone installation"
version: "0.4.2"
---

# Standalone installation

Run `pnpm run install:standalone` from a validated source checkout. The installer
builds a self-contained payload, computes its SHA-256 tree digest, installs it in
an immutable version-and-digest directory, and atomically selects it through the
relative `current` symlink.

The public executable is the stable symlink
`~/.local/bin/proto-lithify`. An existing unmanaged file or symlink at that
path causes installation to fail closed before `current` changes. The installer
never overwrites that object. With an existing installation, the prior selector
therefore remains active; without one, no selector is created. Publishing and
verifying the new immutable release may already have completed, so that release
can remain available without being selected.

Activation creates a task-owned temporary selector and atomically renames that
single symlink to `current`. Successful rename consumes the temporary name. If
rename fails, the prior `current` target is preserved and the random temporary
name remains as an inactive quarantine; recovery never deletes it because its
object may have been replaced concurrently. If this invocation created
the stable launcher, failure cleanup moves the observed object to a random
task-owned quarantine path and does not delete that quarantined object during
recovery. An intervening replacement therefore remains preserved; an equivalent
public symlink is recreated only if that path remains absent, and the
installation still fails. These guarantees do not form an
atomic transaction over two symlinks, provide
crash-proof multi-object publication, or serialize uncoordinated writers.

Old releases are preserved. Rollback consists of atomically selecting a
previous verified release; no release or target GitHub state is deleted during
rollback. The installed runtime requires Node.js and `gh`, but not pnpm or the
source checkout.

Version 0.3.1 keeps copied staging directories temporarily writable until their
atomic publication. This permits an already immutable release to serve as an
installation payload on filesystems that prohibit renaming write-disabled
directories. Source payload permissions remain unchanged, and every published
release is verified and returned to immutable permissions before activation.
Version 0.4.2 adds the bounded launcher-validation and activation-failure
preservation described above without changing release immutability.
