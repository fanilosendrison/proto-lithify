import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
	chmod,
	lstat,
	mkdir,
	mkdtemp,
	readdir,
	readFile,
	readlink,
	realpath,
	rm,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { installStandalone } from "../dist/tsc/installation/install-standalone.js";
import { computeTreeDigest } from "../dist/tsc/installation/tree-digest.js";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const payload = path.join(repo, "dist", "release");
const installer = path.join(repo, "scripts", "install-standalone.mjs");
const version = JSON.parse(
	await readFile(path.join(repo, "package.json"), "utf8"),
).version;
const oldVersion = "0.0.1"; // Synthetic previous release, never a historical production claim.

function run(executable, args, options) {
	const result = spawnSync(executable, args, {
		cwd: options.cwd,
		env: options.env,
		encoding: "utf8",
		shell: false,
		timeout: 120_000,
	});
	if (result.error) throw result.error;
	assert.equal(result.status, 0, `${executable} ${args.join(" ")}\n${result.stderr}`);
	return result.stdout;
}

async function makeWritableForCleanup(target) {
	let stat;
	try {
		stat = await lstat(target);
	} catch (error) {
		if (error?.code === "ENOENT") return;
		throw error;
	}
	if (stat.isSymbolicLink()) return;
	if (stat.isDirectory()) {
		await chmod(target, 0o700);
		for (const entry of await readdir(target)) {
			await makeWritableForCleanup(path.join(target, entry));
		}
	}
}

async function assertImmutable(directory) {
	async function visit(absolute, relative) {
		const stat = await lstat(absolute);
		assert.equal(stat.isSymbolicLink(), false, `symlink: ${relative}`);
		assert.equal(
			stat.isDirectory() || stat.isFile(),
			true,
			`special entry: ${relative}`,
		);
		const executable = relative === path.join("bin", "proto-lithify.mjs");
		assert.equal(
			stat.mode & 0o777,
			stat.isDirectory() || executable ? 0o555 : 0o444,
			relative,
		);
		if (stat.isDirectory()) {
			for (const entry of await readdir(absolute)) {
				await visit(path.join(absolute, entry), path.join(relative, entry));
			}
		}
	}
	await visit(directory, "");
}

async function assertRelease(payloadRoot, releaseDirectory, expectedDigest) {
	assert.equal(await computeTreeDigest(payloadRoot), expectedDigest);
	assert.equal(await computeTreeDigest(releaseDirectory), expectedDigest);
	await assertImmutable(releaseDirectory);
}

async function assertPointers(dataHome, binHome, releaseDirectory) {
	const current = path.join(dataHome, "proto-lithify", "current");
	const launcher = path.join(binHome, "proto-lithify");
	assert.equal(
		await readlink(current),
		path.join("releases", path.basename(releaseDirectory)),
	);
	assert.equal(
		await readlink(launcher),
		path.relative(binHome, path.join(current, "bin", "proto-lithify.mjs")),
	);
	assert.equal(
		await realpath(launcher),
		await realpath(path.join(releaseDirectory, "bin", "proto-lithify.mjs")),
	);
}

async function assertNoStaging(dataHome) {
	const names = await readdir(path.join(dataHome, "proto-lithify", "releases"));
	assert.deepEqual(
		names.filter((name) => name.startsWith(".staging-")),
		[],
	);
}

async function fakeCalls(file) {
	const content = await readFile(file, "utf8");
	return content.trim()
		? content
				.trim()
				.split("\n")
				.map((line) => JSON.parse(line))
		: [];
}

test("CI: isolated standalone install, doctor, reuse, and synthetic rollback", async () => {
	const root = await realpath(await mkdtemp(path.join(tmpdir(), "proto-lithify-ci-")));
	try {
		const home = path.join(root, "home");
		const dataHome = path.join(root, "data");
		const binHome = path.join(home, ".local", "bin");
		const commandHome = path.join(root, "commands");
		const log = path.join(root, "fake-gh.jsonl");
		const oldPayload = path.join(root, "synthetic-old-payload");

		await mkdir(binHome, { recursive: true });
		await mkdir(dataHome, { recursive: true });
		await mkdir(commandHome);
		await mkdir(path.join(oldPayload, "bin"), { recursive: true });
		await writeFile(log, "");
		const fixtureNode = `#!/bin/sh
export DYLD_FORCE_FLAT_NAMESPACE="\${PROTO_LITHIFY_DYLD_FORCE_FLAT_NAMESPACE:-}"
export DYLD_INSERT_LIBRARIES="\${PROTO_LITHIFY_DYLD_INSERT_LIBRARIES:-}"
export DYLD_LIBRARY_PATH="\${PROTO_LITHIFY_DYLD_LIBRARY_PATH:-}"
exec "$PROTO_LITHIFY_NODE" "$@"
`;
		await writeFile(path.join(commandHome, "node"), fixtureNode, { mode: 0o755 });

		const fakeGh = `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.appendFileSync(process.env.PROTO_LITHIFY_FAKE_GH_LOG, JSON.stringify(args) + '\\n');
if (args.length === 1 && args[0] === '--version') process.stdout.write('gh version 0.0.0-fixture\\n');
else if (args.length === 2 && args[0] === 'auth' && args[1] === 'status') process.exitCode = 0;
else { process.stderr.write('UNEXPECTED FAKE GH INVOCATION\\n'); process.exitCode = 91; }
`;
		await writeFile(path.join(commandHome, "gh"), fakeGh, { mode: 0o755 });
		await chmod(path.join(commandHome, "gh"), 0o755);

		const env = {
			HOME: home,
			XDG_DATA_HOME: dataHome,
			PATH: commandHome,
			LANG: "C",
			PROTO_LITHIFY_FAKE_GH_LOG: log,
			PROTO_LITHIFY_NODE: process.execPath,
		};

		if (process.platform === "darwin") {
			for (const key of [
				"DYLD_FORCE_FLAT_NAMESPACE",
				"DYLD_INSERT_LIBRARIES",
				"DYLD_LIBRARY_PATH",
			]) {
				if (process.env[key]) {
					env[key] = process.env[key];
					env[`PROTO_LITHIFY_${key}`] = process.env[key];
				}
			}
		}

		const homedir = run(
			process.execPath,
			["-e", 'process.stdout.write(require("node:os").homedir())'],
			{ env, cwd: root },
		);
		assert.equal(
			homedir,
			home,
			"isolated HOME must be effective for the Node installer",
		);

		for (const target of [home, dataHome, binHome, commandHome]) {
			const relative = path.relative(root, await realpath(target));
			assert.equal(
				path.isAbsolute(relative) ||
					relative === ".." ||
					relative.startsWith(`..${path.sep}`),
				false,
			);
		}

		assert.equal(
			spawnSync("pnpm", ["--version"], { env, cwd: root, encoding: "utf8" }).error
				?.code,
			"ENOENT",
		);

		// Deliberately synthetic predecessor. Installed through the same compiled installer.
		await writeFile(
			path.join(oldPayload, "package.json"),
			`${JSON.stringify({ version: oldVersion, type: "module" })}\n`,
		);
		await writeFile(
			path.join(oldPayload, "bin", "proto-lithify.mjs"),
			'#!/usr/bin/env node\nprocess.stdout.write("synthetic-previous-release\\n");\n',
		);
		await chmod(path.join(oldPayload, "bin", "proto-lithify.mjs"), 0o755);

		const oldDigest = await computeTreeDigest(oldPayload);
		const old = await installStandalone({
			payloadRoot: oldPayload,
			dataHome,
			binHome,
			version: oldVersion,
		});

		assert.equal(old.reused, false);
		await assertRelease(oldPayload, old.releaseDirectory, oldDigest);
		await assertPointers(dataHome, binHome, old.releaseDirectory);
		await assertNoStaging(dataHome);

		const expectedDigest = await computeTreeDigest(payload);
		const expectedName = `${version}-${expectedDigest}`;
		const newReleaseDirectory = path.join(
			dataHome,
			"proto-lithify",
			"releases",
			expectedName,
		);

		await assert.rejects(lstat(newReleaseDirectory), { code: "ENOENT" });

		const first = JSON.parse(
			run(process.execPath, [installer], { env, cwd: repo }).trim(),
		);
		assert.equal(first.reused, false);
		assert.equal(first.releaseDirectory, newReleaseDirectory);

		await assertRelease(payload, first.releaseDirectory, expectedDigest);
		assert.equal(
			JSON.parse(
				await readFile(path.join(first.releaseDirectory, "package.json"), "utf8"),
			).version,
			version,
		);
		await assertPointers(dataHome, binHome, first.releaseDirectory);
		await assertNoStaging(dataHome);

		console.log(
			`FRESH_RELEASE=${expectedName}; REUSED=false; DIGEST=${expectedDigest}`,
		);

		const publicLauncher = path.join(binHome, "proto-lithify");
		const doctor = JSON.parse(
			run(publicLauncher, ["doctor"], { env, cwd: root }).trim(),
		);

		assert.equal(doctor.schemaVersion, 2);
		assert.equal(doctor.command, "doctor");
		assert.equal(doctor.outcome, "inspected");
		assert.equal(doctor.postcondition.verified, true);
		assert.equal(doctor.after.authenticated, true);
		assert.match(doctor.after.ghVersion, /^gh version 0\.0\.0-fixture/);

		assert.deepEqual(await fakeCalls(log), [["--version"], ["auth", "status"]]);

		const invalidCases = [
			[
				[
					"item",
					"add",
					"--project-owner",
					"example",
					"--project-number",
					"3",
					"--repo",
					"example/repo",
					"--issue",
					"42",
					"--issue-url",
					"https://github.com/example/repo/issues/42",
				],
				"UNKNOWN_FLAG",
			],
			[
				[
					"item",
					"add",
					"--project-owner",
					"example",
					"--project-number",
					"3",
					"--repo",
					"not-a-repository",
					"--issue",
					"42",
				],
				"INVALID_REPOSITORY",
			],
			[
				[
					"item",
					"add",
					"--project-owner",
					"example",
					"--project-number",
					"3",
					"--repo",
					"example/repo",
					"--issue",
					"9007199254740992",
				],
				"INVALID_INTEGER",
			],
		];

		for (const [args, code] of invalidCases) {
			const result = spawnSync(publicLauncher, args, {
				env,
				cwd: root,
				encoding: "utf8",
				shell: false,
				timeout: 30_000,
			});
			if (result.error) throw result.error;
			assert.equal(result.status, 2, result.stderr);
			assert.equal(result.stdout, "");
			assert.equal(JSON.parse(result.stderr).error.code, code);
		}

		assert.deepEqual(await fakeCalls(log), [["--version"], ["auth", "status"]]);

		const repeated = JSON.parse(
			run(process.execPath, [installer], { env, cwd: repo }).trim(),
		);

		assert.equal(repeated.reused, true);
		assert.equal(repeated.releaseDirectory, newReleaseDirectory);

		await assertRelease(payload, repeated.releaseDirectory, expectedDigest);
		await assertRelease(oldPayload, old.releaseDirectory, oldDigest);
		await assertPointers(dataHome, binHome, repeated.releaseDirectory);
		await assertNoStaging(dataHome);

		console.log("REINSTALL_REUSED=true; RELEASES_PRESERVED=2");

		const rollback = await installStandalone({
			payloadRoot: old.releaseDirectory,
			dataHome,
			binHome,
			version: oldVersion,
		});

		assert.equal(rollback.reused, true);
		assert.equal(rollback.releaseDirectory, old.releaseDirectory);

		await assertRelease(oldPayload, old.releaseDirectory, oldDigest);
		await assertRelease(payload, newReleaseDirectory, expectedDigest);
		await assertPointers(dataHome, binHome, old.releaseDirectory);
		await assertNoStaging(dataHome);

		assert.equal(
			run(publicLauncher, [], { env, cwd: root }),
			"synthetic-previous-release\n",
		);

		const releases = (
			await readdir(path.join(dataHome, "proto-lithify", "releases"))
		).sort();

		assert.deepEqual(
			releases,
			[path.basename(old.releaseDirectory), expectedName].sort(),
		);

		console.log(
			`ROLLBACK_REUSED=true; ACTIVE=${path.basename(old.releaseDirectory)}; NEW_RELEASE_PRESERVED=true`,
		);
	} finally {
		await makeWritableForCleanup(root);
		await rm(root, { recursive: true, force: true });
	}
});
