import { randomBytes } from "node:crypto";
import {
	chmod,
	cp,
	lstat,
	mkdir,
	readdir,
	readlink,
	rename,
	rm,
	symlink,
} from "node:fs/promises";
import path from "node:path";
import { computeTreeDigest } from "./tree-digest.ts";

const APPLICATION_NAME = "proto-lithify";
const EXECUTABLE_NAME = "proto-lithify";

export interface InstallStandaloneRequest {
	readonly payloadRoot: string;
	readonly dataHome: string;
	readonly binHome: string;
	readonly version: string;
}

export interface InstallStandaloneResult {
	readonly releaseDirectory: string;
	readonly currentLink: string;
	readonly executableLink: string;
	readonly reused: boolean;
}

export interface InstallStandaloneFileOperations {
	readonly rename: (source: string, destination: string) => Promise<void>;
	readonly remove: (target: string) => Promise<void>;
	readonly activationRename?: (source: string, destination: string) => Promise<void>;
	readonly cleanupAfterIdentityRead?: (quarantine: string) => Promise<void>;
}

interface ExecutableIdentity {
	readonly device: number;
	readonly inode: number;
}

const defaultFileOperations: InstallStandaloneFileOperations = {
	rename: async (source, destination) => await rename(source, destination),
	remove: async (target) => await rm(target, { recursive: true, force: true }),
};

export async function installStandalone(
	request: InstallStandaloneRequest,
	fileOperations: InstallStandaloneFileOperations = defaultFileOperations,
): Promise<InstallStandaloneResult> {
	validateRequest(request);
	const digest = await computeTreeDigest(request.payloadRoot);
	const applicationRoot = path.join(request.dataHome, APPLICATION_NAME);
	const releasesRoot = path.join(applicationRoot, "releases");
	const releaseName = `${request.version}-${digest}`;
	const releaseDirectory = path.join(releasesRoot, releaseName);
	await mkdir(releasesRoot, { recursive: true, mode: 0o755 });
	await mkdir(request.binHome, { recursive: true, mode: 0o755 });

	let reused = false;
	try {
		const stats = await lstat(releaseDirectory);
		if (!stats.isDirectory() || stats.isSymbolicLink()) {
			throw new Error(
				`Existing release path is not a physical directory: ${releaseDirectory}`,
			);
		}
		await verifyReleaseDigest(releaseDirectory, digest);
		reused = true;
	} catch (error) {
		if (!isMissing(error)) throw error;
		await createRelease(
			request.payloadRoot,
			releasesRoot,
			releaseDirectory,
			digest,
			fileOperations,
		);
	}
	await verifyReleaseDigest(releaseDirectory, digest);
	await makeTreeReadOnly(releaseDirectory);
	await verifyTreeReadOnly(releaseDirectory);

	const currentLink = path.join(applicationRoot, "current");
	await validateCurrentSelector(currentLink);
	const executableLink = path.join(request.binHome, EXECUTABLE_NAME);
	const managedTarget = path.relative(
		request.binHome,
		path.join(currentLink, "bin", `${EXECUTABLE_NAME}.mjs`),
	);
	const executableIdentity = await ensureStableExecutable(
		executableLink,
		managedTarget,
	);
	try {
		await activateCurrent(
			applicationRoot,
			currentLink,
			releaseName,
			fileOperations.activationRename ?? defaultFileOperations.rename,
		);
	} catch (activationError) {
		if (executableIdentity) {
			try {
				await quarantineCreatedExecutable(
					executableLink,
					managedTarget,
					executableIdentity,
					fileOperations.cleanupAfterIdentityRead,
				);
			} catch (cleanupError) {
				throw new AggregateError(
					[activationError, cleanupError],
					"Activation failed and the invocation-created launcher could not be safely cleaned",
					{ cause: activationError },
				);
			}
		}
		throw activationError;
	}
	return { releaseDirectory, currentLink, executableLink, reused };
}

async function createRelease(
	payloadRoot: string,
	releasesRoot: string,
	releaseDirectory: string,
	expectedDigest: string,
	fileOperations: InstallStandaloneFileOperations,
): Promise<void> {
	const staging = path.join(
		releasesRoot,
		`.staging-${randomBytes(16).toString("hex")}`,
	);
	let operationError: unknown;
	try {
		await cp(payloadRoot, staging, {
			recursive: true,
			errorOnExist: true,
			force: false,
			verbatimSymlinks: true,
		});
		await makeStagingDirectoriesWritable(staging);
		await verifyReleaseDigest(staging, expectedDigest);
		try {
			await fileOperations.rename(staging, releaseDirectory);
		} catch (error) {
			if (!isAlreadyExists(error)) throw error;
			await verifyReleaseDigest(releaseDirectory, expectedDigest);
		}
	} catch (error) {
		operationError = error;
	}

	let cleanupError: unknown;
	try {
		await cleanupStaging(staging, fileOperations.remove);
	} catch (error) {
		cleanupError = error;
	}
	if (operationError !== undefined && cleanupError !== undefined) {
		throw new AggregateError(
			[operationError, cleanupError],
			"Release creation failed and staging cleanup also failed",
			{ cause: operationError },
		);
	}
	if (operationError !== undefined) throw operationError;
	if (cleanupError !== undefined) throw cleanupError;
}

async function makeStagingDirectoriesWritable(directory: string): Promise<void> {
	const stats = await lstat(directory);
	if (stats.isSymbolicLink() || !stats.isDirectory()) {
		throw new Error(`Release staging path is not a physical directory: ${directory}`);
	}
	await chmod(directory, (stats.mode & 0o777) | 0o700);
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const target = path.join(directory, entry.name);
		const entryStats = await lstat(target);
		if (entryStats.isSymbolicLink()) {
			throw new Error(`Release staging must not contain symlinks: ${target}`);
		}
		if (entryStats.isDirectory()) {
			await makeStagingDirectoriesWritable(target);
			continue;
		}
		if (!entryStats.isFile()) {
			throw new Error(`Release staging contains a special file: ${target}`);
		}
	}
}

async function cleanupStaging(
	staging: string,
	remove: (target: string) => Promise<void>,
): Promise<void> {
	try {
		await makeStagingDirectoriesWritable(staging);
	} catch (error) {
		if (isMissing(error)) return;
		throw error;
	}
	await remove(staging);
}

async function verifyReleaseDigest(
	releaseDirectory: string,
	expectedDigest: string,
): Promise<void> {
	const observedDigest = await computeTreeDigest(releaseDirectory);
	if (observedDigest !== expectedDigest) {
		throw new Error(
			`Existing release content does not match its digest: ${releaseDirectory}`,
		);
	}
}

async function makeTreeReadOnly(directory: string): Promise<void> {
	const entries = await readdir(directory, { withFileTypes: true });
	for (const entry of entries) {
		const target = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			await makeTreeReadOnly(target);
			await chmod(target, 0o555);
		} else if (entry.isFile()) {
			await chmod(target, immutableFileMode(target));
		}
	}
	await chmod(directory, 0o555);
}

async function verifyTreeReadOnly(directory: string): Promise<void> {
	const directoryStats = await lstat(directory);
	if (!directoryStats.isDirectory() || directoryStats.isSymbolicLink()) {
		throw new Error(`Published release path is not a physical directory: ${directory}`);
	}
	if ((directoryStats.mode & 0o777) !== 0o555) {
		throw new Error(`Published release directory is not immutable: ${directory}`);
	}
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const target = path.join(directory, entry.name);
		const stats = await lstat(target);
		if (stats.isSymbolicLink()) {
			throw new Error(`Published release must not contain symlinks: ${target}`);
		}
		if (stats.isDirectory()) {
			await verifyTreeReadOnly(target);
			continue;
		}
		if (!stats.isFile()) {
			throw new Error(`Published release contains a special file: ${target}`);
		}
		if ((stats.mode & 0o777) !== immutableFileMode(target)) {
			throw new Error(`Published release file is not immutable: ${target}`);
		}
	}
}

function immutableFileMode(target: string): number {
	return target.endsWith(".mjs") && target.includes(`${path.sep}bin${path.sep}`)
		? 0o555
		: 0o444;
}

async function activateCurrent(
	applicationRoot: string,
	currentLink: string,
	releaseName: string,
	activationRename: (source: string, destination: string) => Promise<void>,
): Promise<void> {
	const temporaryLink = path.join(
		applicationRoot,
		`.current-${randomBytes(16).toString("hex")}`,
	);
	await symlink(path.join("releases", releaseName), temporaryLink);
	await activationRename(temporaryLink, currentLink);
}

async function ensureStableExecutable(
	executableLink: string,
	managedTarget: string,
): Promise<ExecutableIdentity | null> {
	try {
		const stats = await lstat(executableLink);
		if (!stats.isSymbolicLink()) {
			throw new Error(
				`Executable path already exists and is not a symlink: ${executableLink}`,
			);
		}
		const currentTarget = await readlink(executableLink);
		if (currentTarget !== managedTarget) {
			throw new Error(`Executable symlink has an unmanaged target: ${executableLink}`);
		}
		return null;
	} catch (error) {
		if (!isMissing(error)) throw error;
		await symlink(managedTarget, executableLink);
		const stats = await lstat(executableLink);
		return { device: stats.dev, inode: stats.ino };
	}
}

async function validateCurrentSelector(currentLink: string): Promise<void> {
	try {
		const stats = await lstat(currentLink);
		if (!stats.isSymbolicLink()) {
			throw new Error(
				`Current selector already exists and is not a symlink: ${currentLink}`,
			);
		}
		const target = await readlink(currentLink);
		const segments = target.split(path.sep);
		if (segments.length !== 2 || segments[0] !== "releases" || !segments[1]) {
			throw new Error(`Current selector has an unmanaged target: ${currentLink}`);
		}
	} catch (error) {
		if (!isMissing(error)) throw error;
	}
}

async function quarantineCreatedExecutable(
	executableLink: string,
	managedTarget: string,
	identity: ExecutableIdentity,
	afterIdentityRead?: (quarantine: string) => Promise<void>,
): Promise<void> {
	const quarantine = `${executableLink}.cleanup-${randomBytes(16).toString("hex")}`;
	await rename(executableLink, quarantine);
	const stats = await lstat(quarantine);
	await afterIdentityRead?.(quarantine);
	const observedTarget = stats.isSymbolicLink() ? await readlink(quarantine) : null;
	const owned =
		stats.dev === identity.device &&
		stats.ino === identity.inode &&
		observedTarget === managedTarget;
	if (owned) return;
	if (observedTarget !== null) await symlink(observedTarget, executableLink);
	throw new Error(
		`Invocation-created executable changed identity during activation failure; preserved at ${quarantine}`,
	);
}

function validateRequest(request: InstallStandaloneRequest): void {
	for (const [name, value] of Object.entries({
		payloadRoot: request.payloadRoot,
		dataHome: request.dataHome,
		binHome: request.binHome,
	})) {
		if (!path.isAbsolute(value) || value.length === 0) {
			throw new Error(`${name} must be a non-empty absolute path`);
		}
	}
	if (!/^\d+\.\d+\.\d+$/.test(request.version)) {
		throw new Error("version must be a three-segment semantic version");
	}
}

function isMissing(error: unknown): boolean {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function isAlreadyExists(error: unknown): boolean {
	return error instanceof Error && "code" in error && error.code === "EEXIST";
}
