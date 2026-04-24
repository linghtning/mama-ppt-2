import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(scriptDir, '..');
const dryRun = process.argv.includes('--dry-run');

const packageJsonPath = join(rootDir, 'package.json');
const packageLockPath = join(rootDir, 'package-lock.json');

function bumpPatchVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);

  if (!match) {
    throw new Error(`Unsupported package version "${version}". Expected x.y.z.`);
  }

  const [, major, minor, patch] = match;
  return `${major}.${minor}.${Number(patch) + 1}`;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

const packageJson = await readJson(packageJsonPath);
const currentVersion = packageJson.version;
const nextVersion = bumpPatchVersion(currentVersion);

packageJson.version = nextVersion;

if (existsSync(packageLockPath)) {
  const packageLock = await readJson(packageLockPath);
  packageLock.version = nextVersion;

  if (packageLock.packages?.['']) {
    packageLock.packages[''].version = nextVersion;
  }

  if (!dryRun) {
    await writeJson(packageLockPath, packageLock);
  }
}

if (!dryRun) {
  await writeJson(packageJsonPath, packageJson);
}

console.log(
  dryRun
    ? `Next package version would be ${nextVersion}.`
    : `Package version bumped: ${currentVersion} -> ${nextVersion}`,
);
