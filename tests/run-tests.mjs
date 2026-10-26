import { spawnSync } from "node:child_process";
import path from "node:path";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const testFiles = [
	"tests/gh-process.test.ts",
	"tests/gh-process-cancellation.test.ts",
	"tests/gh-process-control.test.ts",
	"tests/issue-dependency-operations.test.ts",
	"tests/dependency-concurrency.test.ts",
	"tests/rest-api-version.test.ts",
	"tests/access-denial.test.ts",
	"tests/project-v2-client.test.ts",
	"tests/project-inspect-pagination.test.ts",
	"tests/project-inspect-incomplete.test.ts",
	"tests/project-archive-membership.test.ts",
	"tests/project-archive-pagination.test.ts",
	"tests/project-archive-operations.test.ts",
	"tests/project-operations.test.ts",
	"tests/project-concurrency.test.ts",
	"tests/item-snapshot-schema.test.ts",
	"tests/receipt-v2-valid.test.ts",
	"tests/receipt-v2-invalid.test.ts",
	"tests/receipt-legacy.test.ts",
	"tests/receipt-json-schema-parity.test.ts",
	"tests/receipt-output.test.ts",
	"tests/cli.test.ts",
	"tests/installation.test.ts",
	"tests/standalone-activation-faults.test.ts",
].map((file) => path.join(repositoryRoot, file));

const result = spawnSync(
	process.execPath,
	[
		"--test",
		"--test-concurrency=1",
		"--test-timeout=30000",
		"--test-reporter=tap",
		...testFiles,
	],
	{ cwd: repositoryRoot, env: process.env, shell: false, stdio: "inherit" },
);

if (result.error) {
	throw result.error;
}
process.exitCode = result.status ?? 1;
