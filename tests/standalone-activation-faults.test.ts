import assert from "node:assert/strict";
import {
	chmod,
	lstat,
	mkdir,
	mkdtemp,
	readdir,
	readFile,
	readlink,
	rename,
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

const roots: string[] = [];

interface Fixture {
	readonly root: string;
	readonly dataHome: string;
	readonly binHome: string;
	readonly payloadA: string;
	readonly payloadB: string;
}

async function payload(root: string, name: string): Promise<string> {
	const target = path.join(root, name);
	await mkdir(path.join(target, "bin"), { recursive: true });
	await writeFile(path.join(target, "bin", "proto-lithify.mjs"), `${name}\n`);
	await chmod(path.join(target, "bin", "proto-lithify.mjs"), 0o755);
	await writeFile(
		path.join(target, "package.json"),
		`${JSON.stringify({ version: name })}\n`,
	);
	return target;
}

async function fixture(): Promise<Fixture> {
	const root = await mkdtemp(path.join(tmpdir(), "proto-lithify-activation-"));
	roots.push(root);
	return {
		root,
		dataHome: path.join(root, "data"),
		binHome: path.join(root, "bin"),
		payloadA: await payload(root, "release-a"),
		payloadB: await payload(root, "release-b"),
	};
}

async function writable(target: string): Promise<void> {
	try {
		const stat = await lstat(target);
		if (stat.isSymbolicLink()) return;
		if (stat.isDirectory()) {
			await chmod(target, 0o755);
			for (const child of await readdir(target))
				await writable(path.join(target, child));
		} else await chmod(target, 0o644);
	} catch (error) {
		if (!(error instanceof Error && "code" in error && error.code === "ENOENT"))
			throw error;
	}
}

afterEach(async () => {
	for (const root of roots.splice(0)) {
		await writable(root);
		await rm(root, { recursive: true, force: true });
	}
});

async function installA(value: Fixture) {
	return await installStandalone({
		payloadRoot: value.payloadA,
		dataHome: value.dataHome,
		binHome: value.binHome,
		version: "0.4.1",
	});
}

function requestB(value: Fixture) {
	return {
		payloadRoot: value.payloadB,
		dataHome: value.dataHome,
		binHome: value.binHome,
		version: "0.4.2",
	};
}

async function noStaging(value: Fixture): Promise<void> {
	const releases = await readdir(
		path.join(value.dataHome, "proto-lithify", "releases"),
	);
	assert.deepEqual(
		releases.filter((name) => name.startsWith(".staging-")),
		[],
	);
}

function activationFailureOperations(
	error: Error,
	beforeFailure?: (temporarySelector: string) => Promise<void>,
	cleanupAfterIdentityRead?: (quarantine: string) => Promise<void>,
): InstallStandaloneFileOperations {
	return {
		rename: async (source, destination) => await rename(source, destination),
		remove: async (target) => await rm(target, { recursive: true, force: true }),
		activationRename: async (temporarySelector) => {
			await beforeFailure?.(temporarySelector);
			throw error;
		},
		...(cleanupAfterIdentityRead === undefined ? {} : { cleanupAfterIdentityRead }),
	};
}

describe("standalone activation failure preservation", () => {
	it("R3.A preserves active A and unmanaged file/symlink launchers while publishing B", async () => {
		for (const conflict of ["file", "symlink"] as const) {
			const value = await fixture();
			const installedA = await installA(value);
			const selectorBefore = await readlink(installedA.currentLink);
			const digestA = await computeTreeDigest(installedA.releaseDirectory);
			await rm(installedA.executableLink);
			if (conflict === "file")
				await writeFile(installedA.executableLink, "unmanaged\n");
			else await symlink("unmanaged-target", installedA.executableLink);
			const launcherBefore =
				conflict === "file"
					? await readFile(installedA.executableLink, "utf8")
					: await readlink(installedA.executableLink);

			await assert.rejects(
				installStandalone(requestB(value)),
				/unmanaged|not a symlink/,
			);
			assert.equal(await readlink(installedA.currentLink), selectorBefore);
			assert.equal(
				conflict === "file"
					? await readFile(installedA.executableLink, "utf8")
					: await readlink(installedA.executableLink),
				launcherBefore,
			);
			assert.equal(await computeTreeDigest(installedA.releaseDirectory), digestA);
			const digestB = await computeTreeDigest(value.payloadB);
			assert.equal(
				await computeTreeDigest(
					path.join(value.dataHome, "proto-lithify", "releases", `0.4.2-${digestB}`),
				),
				digestB,
			);
			await noStaging(value);
		}
	});

	it("R3.B rejects a fresh conflicting launcher without creating current", async () => {
		for (const conflict of ["file", "symlink"] as const) {
			const value = await fixture();
			await mkdir(value.binHome, { recursive: true });
			const launcher = path.join(value.binHome, "proto-lithify");
			if (conflict === "file") await writeFile(launcher, "unmanaged\n");
			else await symlink("unmanaged-target", launcher);
			const before =
				conflict === "file"
					? await readFile(launcher, "utf8")
					: await readlink(launcher);
			await assert.rejects(
				installStandalone(requestB(value)),
				/unmanaged|not a symlink/,
			);
			await assert.rejects(
				lstat(path.join(value.dataHome, "proto-lithify", "current")),
				/ENOENT/,
			);
			assert.equal(
				conflict === "file"
					? await readFile(launcher, "utf8")
					: await readlink(launcher),
				before,
			);
			await noStaging(value);
		}
	});

	it("R3.C preserves current and quarantines the temporary selector on activation failure", async () => {
		const value = await fixture();
		const installedA = await installA(value);
		const selectorBefore = await readlink(installedA.currentLink);
		const launcherBefore = await readlink(installedA.executableLink);
		const failure = new Error("simulated activation rename failure");
		await assert.rejects(
			installStandalone(requestB(value), activationFailureOperations(failure)),
			(error: unknown) => error === failure,
		);
		assert.equal(await readlink(installedA.currentLink), selectorBefore);
		assert.equal(await readlink(installedA.executableLink), launcherBefore);
		const temporarySelectors = (
			await readdir(path.join(value.dataHome, "proto-lithify"))
		).filter((name) => name.startsWith(".current-"));
		assert.equal(temporarySelectors.length, 1);
		const digestB = await computeTreeDigest(value.payloadB);
		assert.equal(
			await readlink(
				path.join(value.dataHome, "proto-lithify", temporarySelectors[0] ?? ""),
			),
			path.join("releases", `0.4.2-${digestB}`),
		);
		await noStaging(value);
	});

	it("R3.D removes only the invocation-created launcher after activation failure", async () => {
		const value = await fixture();
		const installedA = await installA(value);
		const selectorBefore = await readlink(installedA.currentLink);
		await rm(installedA.executableLink);
		const failure = new Error("simulated activation rename failure");
		await assert.rejects(
			installStandalone(requestB(value), activationFailureOperations(failure)),
			(error: unknown) => error === failure,
		);
		assert.equal(await readlink(installedA.currentLink), selectorBefore);
		await assert.rejects(lstat(installedA.executableLink), /ENOENT/);
		assert.equal(
			(await readdir(value.binHome)).filter((name) =>
				name.startsWith("proto-lithify.cleanup-"),
			).length,
			1,
		);
	});

	it("R3.E preserves a same-target launcher replacement instead of deleting it", async () => {
		const value = await fixture();
		const installedA = await installA(value);
		const selectorBefore = await readlink(installedA.currentLink);
		await rm(installedA.executableLink);
		let replacementIdentity: { readonly dev: number; readonly ino: number } | undefined;
		const replaceLauncher = async (): Promise<void> => {
			const target = await readlink(installedA.executableLink);
			const replacement = path.join(value.binHome, "replacement-launcher");
			await symlink(target, replacement);
			const stats = await lstat(replacement);
			replacementIdentity = { dev: stats.dev, ino: stats.ino };
			await rename(replacement, installedA.executableLink);
		};
		await assert.rejects(
			installStandalone(
				requestB(value),
				activationFailureOperations(
					new Error("simulated activation rename failure"),
					replaceLauncher,
				),
			),
			(error: unknown) =>
				error instanceof AggregateError &&
				error.errors.some(
					(cause: unknown) =>
						cause instanceof Error && /changed identity/.test(cause.message),
				),
		);
		assert.equal(await readlink(installedA.currentLink), selectorBefore);
		assert.equal(
			await readlink(installedA.executableLink),
			path.relative(
				value.binHome,
				path.join(installedA.currentLink, "bin", "proto-lithify.mjs"),
			),
		);
		const quarantines = (await readdir(value.binHome)).filter((name) =>
			name.startsWith("proto-lithify.cleanup-"),
		);
		assert.equal(quarantines.length, 1);
		const preserved = await lstat(path.join(value.binHome, quarantines[0] ?? ""));
		assert.deepEqual({ dev: preserved.dev, ino: preserved.ino }, replacementIdentity);
	});

	it("R3.F never deletes a same-target replacement after identity observation", async () => {
		const value = await fixture();
		const installedA = await installA(value);
		await rm(installedA.executableLink);
		const failure = new Error("simulated activation rename failure");
		let replacementIdentity: { readonly dev: number; readonly ino: number } | undefined;
		const replaceQuarantine = async (quarantine: string): Promise<void> => {
			const target = await readlink(quarantine);
			await rm(quarantine);
			await symlink(target, quarantine);
			const stats = await lstat(quarantine);
			replacementIdentity = { dev: stats.dev, ino: stats.ino };
		};
		await assert.rejects(
			installStandalone(
				requestB(value),
				activationFailureOperations(failure, undefined, replaceQuarantine),
			),
			(error: unknown) => error === failure,
		);
		await assert.rejects(lstat(installedA.executableLink), /ENOENT/);
		const quarantine = (await readdir(value.binHome)).find((name) =>
			name.startsWith("proto-lithify.cleanup-"),
		);
		assert.notEqual(quarantine, undefined);
		const preserved = await lstat(path.join(value.binHome, quarantine ?? ""));
		assert.deepEqual({ dev: preserved.dev, ino: preserved.ino }, replacementIdentity);
	});

	it("R3.G never deletes a replacement temporary selector after activation failure", async () => {
		const value = await fixture();
		const installedA = await installA(value);
		const selectorBefore = await readlink(installedA.currentLink);
		const failure = new Error("simulated activation rename failure");
		let replacementIdentity: { readonly dev: number; readonly ino: number } | undefined;
		const replaceTemporarySelector = async (
			temporarySelector: string,
		): Promise<void> => {
			await rm(temporarySelector);
			await symlink("foreign-selector-target", temporarySelector);
			const stats = await lstat(temporarySelector);
			replacementIdentity = { dev: stats.dev, ino: stats.ino };
		};
		await assert.rejects(
			installStandalone(
				requestB(value),
				activationFailureOperations(failure, replaceTemporarySelector),
			),
			(error: unknown) => error === failure,
		);
		assert.equal(await readlink(installedA.currentLink), selectorBefore);
		const temporarySelector = (
			await readdir(path.join(value.dataHome, "proto-lithify"))
		).find((name) => name.startsWith(".current-"));
		assert.notEqual(temporarySelector, undefined);
		const preservedPath = path.join(
			value.dataHome,
			"proto-lithify",
			temporarySelector ?? "",
		);
		assert.equal(await readlink(preservedPath), "foreign-selector-target");
		const preserved = await lstat(preservedPath);
		assert.deepEqual({ dev: preserved.dev, ino: preserved.ino }, replacementIdentity);
	});
});
