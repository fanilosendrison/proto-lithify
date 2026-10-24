import assert from "node:assert/strict";
import {
	chmod,
	cp,
	lstat,
	mkdir,
	mkdtemp,
	readdir,
	readFile,
	readlink,
	rm,
	symlink,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";
import {
	type InstallStandaloneFileOperations,
	installStandalone,
} from "../src/installation/install-standalone.ts";
import { computeTreeDigest } from "../src/installation/tree-digest.ts";

const temporaryDirectories: string[] = [];

interface Fixture {
	readonly root: string;
	readonly payloadRoot: string;
	readonly dataHome: string;
	readonly binHome: string;
}

async function makeFixture(label = "payload"): Promise<Fixture> {
	const root = await mkdtemp(path.join(tmpdir(), "proto-lithify-install-"));
	temporaryDirectories.push(root);
	const payloadRoot = path.join(root, label);
	const dataHome = path.join(root, "data");
	const binHome = path.join(root, "bin-home");
	await mkdir(path.join(payloadRoot, "bin"), { recursive: true });
	await mkdir(path.join(payloadRoot, "dist", "nested"), { recursive: true });
	await mkdir(path.join(payloadRoot, "schemas"), { recursive: true });
	await writeFile(
		path.join(payloadRoot, "bin", "proto-lithify.mjs"),
		`#!/usr/bin/env node\nprocess.stdout.write(${JSON.stringify(`${label}\n`)});\n`,
	);
	await writeFile(path.join(payloadRoot, "dist", "cli.mjs"), `${label}-runtime\n`);
	await writeFile(path.join(payloadRoot, "dist", "nested", "data.txt"), "data\n");
	await writeFile(path.join(payloadRoot, "schemas", "receipt.json"), "{}\n");
	await writeFile(
		path.join(payloadRoot, "package.json"),
		`${JSON.stringify({ version: label === "old-payload" ? "0.2.1" : "0.3.1" })}\n`,
	);
	await chmod(path.join(payloadRoot, "bin", "proto-lithify.mjs"), 0o755);
	return { root, payloadRoot, dataHome, binHome };
}

afterEach(async () => {
	await Promise.all(
		temporaryDirectories.splice(0).map(async (directory) => {
			await makeTreeWritable(directory);
			await rm(directory, { recursive: true, force: true });
		}),
	);
});

async function makeTreeWritable(target: string): Promise<void> {
	try {
		const stats = await lstat(target);
		if (stats.isSymbolicLink()) return;
		if (stats.isDirectory()) {
			await chmod(target, 0o755);
			for (const entry of await readdir(target)) {
				await makeTreeWritable(path.join(target, entry));
			}
		} else if (stats.isFile()) {
			await chmod(target, 0o644);
		}
	} catch (error) {
		if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
			throw error;
		}
	}
}

async function makeTreeImmutable(directory: string): Promise<void> {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const target = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			await makeTreeImmutable(target);
			await chmod(target, 0o555);
		} else if (entry.isFile()) {
			await chmod(
				target,
				target.endsWith(".mjs") && target.includes(`${path.sep}bin${path.sep}`)
					? 0o555
					: 0o444,
			);
		}
	}
	await chmod(directory, 0o555);
}

async function treeModes(root: string, relative = ""): Promise<Record<string, number>> {
	const modes: Record<string, number> = {};
	const target = path.join(root, relative);
	modes[relative || "."] = (await lstat(target)).mode & 0o777;
	for (const entry of await readdir(target, { withFileTypes: true })) {
		const child = path.join(relative, entry.name);
		if (entry.isDirectory()) Object.assign(modes, await treeModes(root, child));
		else modes[child] = (await lstat(path.join(root, child))).mode & 0o777;
	}
	return modes;
}

async function treeContents(
	root: string,
	relative = "",
): Promise<Record<string, string>> {
	const contents: Record<string, string> = {};
	const target = path.join(root, relative);
	for (const entry of await readdir(target, { withFileTypes: true })) {
		const child = path.join(relative, entry.name);
		if (entry.isDirectory()) Object.assign(contents, await treeContents(root, child));
		else if (entry.isFile()) {
			contents[child] = (await readFile(path.join(root, child))).toString("base64");
		}
	}
	return contents;
}

async function assertImmutable(root: string): Promise<void> {
	const modes = await treeModes(root);
	for (const [relative, mode] of Object.entries(modes)) {
		const isExecutable = relative.endsWith("bin/proto-lithify.mjs");
		const isDirectory = (
			await lstat(path.join(root, relative === "." ? "" : relative))
		).isDirectory();
		assert.strictEqual(mode, isDirectory || isExecutable ? 0o555 : 0o444, relative);
	}
}

async function assertNoStaging(dataHome: string): Promise<void> {
	const releases = await readdir(path.join(dataHome, "proto-lithify", "releases"));
	assert.deepStrictEqual(
		releases.filter((name) => name.startsWith(".staging-")),
		[],
	);
}

function realRemove(target: string): Promise<void> {
	return rm(target, { recursive: true, force: true });
}

function failingOperations(
	renameError: Error,
	remove: (target: string) => Promise<void> = realRemove,
): InstallStandaloneFileOperations {
	return { rename: async () => await Promise.reject(renameError), remove };
}

describe("standalone installation", () => {
	it("installs an immutable payload without changing source bytes or modes", async () => {
		const fixture = await makeFixture();
		await makeTreeImmutable(fixture.payloadRoot);
		const sourceDigest = await computeTreeDigest(fixture.payloadRoot);
		const sourceModes = await treeModes(fixture.payloadRoot);
		const sourceContents = await treeContents(fixture.payloadRoot);

		const result = await installStandalone({ ...fixture, version: "0.3.1" });

		assert.strictEqual(path.basename(result.releaseDirectory), `0.3.1-${sourceDigest}`);
		assert.strictEqual(await computeTreeDigest(result.releaseDirectory), sourceDigest);
		assert.deepStrictEqual(await treeContents(result.releaseDirectory), sourceContents);
		assert.deepStrictEqual(await treeModes(fixture.payloadRoot), sourceModes);
		assert.strictEqual(await computeTreeDigest(fixture.payloadRoot), sourceDigest);
		await assertImmutable(result.releaseDirectory);
		assert.strictEqual(
			await readlink(result.currentLink),
			path.join("releases", path.basename(result.releaseDirectory)),
		);
		assert.strictEqual(
			await readlink(result.executableLink),
			path.join("..", "data", "proto-lithify", "current", "bin", "proto-lithify.mjs"),
		);
		await assertNoStaging(fixture.dataHome);
	});

	it("reuses the same verified release without changing its bytes", async () => {
		const fixture = await makeFixture();
		await makeTreeImmutable(fixture.payloadRoot);
		const first = await installStandalone({ ...fixture, version: "0.3.1" });
		const before = await treeContents(first.releaseDirectory);
		const second = await installStandalone({ ...fixture, version: "0.3.1" });

		assert.strictEqual(first.reused, false);
		assert.strictEqual(second.reused, true);
		assert.strictEqual(second.releaseDirectory, first.releaseDirectory);
		assert.deepStrictEqual(await treeContents(first.releaseDirectory), before);
		assert.strictEqual(
			(await readdir(path.dirname(first.releaseDirectory))).filter(
				(name) => !name.startsWith(".staging-"),
			).length,
			1,
		);
		await assertNoStaging(fixture.dataHome);
	});

	it("reselects an existing immutable old release after an upgrade", async () => {
		const fixture = await makeFixture("old-payload");
		const newPayload = path.join(fixture.root, "new-payload");
		const secondFixture = await makeFixture("new-payload");
		await mkdir(newPayload, { recursive: true });
		await rm(newPayload, { recursive: true });
		await cp(secondFixture.payloadRoot, newPayload, { recursive: true });
		await makeTreeImmutable(fixture.payloadRoot);
		await makeTreeImmutable(newPayload);

		const oldRelease = await installStandalone({ ...fixture, version: "0.2.1" });
		const newRelease = await installStandalone({
			...fixture,
			payloadRoot: newPayload,
			version: "0.3.1",
		});
		const rollback = await installStandalone({
			...fixture,
			payloadRoot: oldRelease.releaseDirectory,
			version: "0.2.1",
		});

		assert.strictEqual(rollback.reused, true);
		assert.strictEqual(rollback.releaseDirectory, oldRelease.releaseDirectory);
		assert.strictEqual(
			await readlink(rollback.currentLink),
			path.join("releases", path.basename(oldRelease.releaseDirectory)),
		);
		assert.strictEqual(
			(await readdir(path.dirname(oldRelease.releaseDirectory))).length,
			2,
		);
		await assertImmutable(oldRelease.releaseDirectory);
		await assertImmutable(newRelease.releaseDirectory);
		await assertNoStaging(fixture.dataHome);
	});

	it("preserves rename failure, cleans staging, and leaves existing releases unchanged", async () => {
		const fixture = await makeFixture();
		await makeTreeImmutable(fixture.payloadRoot);
		const existing = path.join(
			fixture.dataHome,
			"proto-lithify",
			"releases",
			"0.1.0-existing",
		);
		await mkdir(existing, { recursive: true });
		await writeFile(path.join(existing, "sentinel.txt"), "preserve\n");
		const existingBefore = await treeContents(existing);
		const renameError = Object.assign(new Error("simulated rename failure"), {
			code: "EACCES",
		});
		await assert.rejects(
			installStandalone(
				{ ...fixture, version: "0.3.1" },
				failingOperations(renameError),
			),
			(error: unknown) => error === renameError,
		);
		assert.deepStrictEqual(await treeContents(existing), existingBefore);
		await assertNoStaging(fixture.dataHome);
		await assert.rejects(
			lstat(path.join(fixture.dataHome, "proto-lithify", "current")),
			/ENOENT/,
		);
	});

	it("preserves verified concurrent publication race handling", async () => {
		const fixture = await makeFixture();
		await makeTreeImmutable(fixture.payloadRoot);
		const operations: InstallStandaloneFileOperations = {
			rename: async (source, destination) => {
				await cp(source, destination, { recursive: true });
				throw Object.assign(new Error("simulated concurrent publication"), {
					code: "EEXIST",
				});
			},
			remove: realRemove,
		};
		const result = await installStandalone(
			{ ...fixture, version: "0.3.1" },
			operations,
		);
		assert.strictEqual(
			await computeTreeDigest(result.releaseDirectory),
			await computeTreeDigest(fixture.payloadRoot),
		);
		await assertImmutable(result.releaseDirectory);
		await assertNoStaging(fixture.dataHome);
	});

	it("reports a cleanup-only failure independently", async () => {
		const fixture = await makeFixture();
		await makeTreeImmutable(fixture.payloadRoot);
		const cleanupError = new Error("cleanup-only failure");
		const operations: InstallStandaloneFileOperations = {
			rename: async (source, destination) => {
				await cp(source, destination, { recursive: true });
				throw Object.assign(new Error("simulated concurrent publication"), {
					code: "EEXIST",
				});
			},
			remove: async () => await Promise.reject(cleanupError),
		};
		await assert.rejects(
			installStandalone({ ...fixture, version: "0.3.1" }, operations),
			(error: unknown) => error === cleanupError,
		);
		await assert.rejects(
			lstat(path.join(fixture.dataHome, "proto-lithify", "current")),
			/ENOENT/,
		);
	});

	it("reports primary and cleanup failures without accepting a release", async () => {
		const fixture = await makeFixture();
		await makeTreeImmutable(fixture.payloadRoot);
		const renameError = new Error("primary rename failure");
		const cleanupError = new Error("secondary cleanup failure");
		await assert.rejects(
			installStandalone(
				{ ...fixture, version: "0.3.1" },
				failingOperations(renameError, async () => await Promise.reject(cleanupError)),
			),
			(error: unknown) =>
				error instanceof AggregateError &&
				error.cause === renameError &&
				error.errors[0] === renameError &&
				error.errors[1] === cleanupError,
		);
		await assert.rejects(
			lstat(path.join(fixture.dataHome, "proto-lithify", "current")),
			/ENOENT/,
		);
	});

	it("rejects symlink payloads and mismatched existing releases", async () => {
		const fixture = await makeFixture();
		await symlink("outside", path.join(fixture.payloadRoot, "invalid-link"));
		await assert.rejects(
			installStandalone({ ...fixture, version: "0.3.1" }),
			/must not contain symlinks/,
		);
		await rm(path.join(fixture.payloadRoot, "invalid-link"));
		const digest = await computeTreeDigest(fixture.payloadRoot);
		const release = path.join(
			fixture.dataHome,
			"proto-lithify",
			"releases",
			`0.3.1-${digest}`,
		);
		await mkdir(release, { recursive: true });
		await writeFile(path.join(release, "wrong.txt"), "wrong\n");
		await assert.rejects(
			installStandalone({ ...fixture, version: "0.3.1" }),
			/does not match its digest/,
		);
		assert.strictEqual(
			await readFile(path.join(release, "wrong.txt"), "utf8"),
			"wrong\n",
		);
	});
});
