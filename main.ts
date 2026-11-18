import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const FILE_NAME = "entry.png";
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_SOURCE_BYTES = 1048576;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const source = path.join(scriptDir, FILE_NAME);

  const envDir = process.env.MAKEFUN_OUTPUT_DIR;
  const outputDir = path.resolve(envDir && envDir.trim() !== "" ? envDir : "/output");
  const destination = path.join(outputDir, FILE_NAME);

  let stat: fs.Stats;
  try {
    stat = fs.statSync(source);
  } catch (err) {
    fail(`cannot access source image ${source}: ${(err as Error).message}`);
  }
  if (!stat.isFile()) fail(`source ${source} is not a regular file`);
  if (stat.size === 0) fail(`source ${source} is empty`);
  if (stat.size > MAX_SOURCE_BYTES) {
    fail(`source ${source} is too large (${stat.size} bytes, max ${MAX_SOURCE_BYTES})`);
  }

  const data = fs.readFileSync(source);
  if (data.length < PNG_SIGNATURE.length || !data.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    fail(`source ${source} is not a valid PNG (bad signature)`);
  }

  if (path.resolve(source) === path.resolve(destination)) {
    fail(`source and destination are the same file: ${source}`);
  }

  try {
    fs.mkdirSync(outputDir, { recursive: true });
  } catch (err) {
    fail(`cannot create output directory ${outputDir}: ${(err as Error).message}`);
  }

  try {
    fs.copyFileSync(source, destination);
  } catch (err) {
    fail(`cannot copy ${source} to ${destination}: ${(err as Error).message}`);
  }

  let written: Buffer;
  try {
    written = fs.readFileSync(destination);
  } catch (err) {
    fail(`cannot read back ${destination}: ${(err as Error).message}`);
  }
  if (written.length < PNG_SIGNATURE.length || !written.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    try {
      fs.unlinkSync(destination);
    } catch (err) {
      console.error(`error: cannot delete invalid output ${destination}: ${(err as Error).message}`);
    }
    fail(`verification failed: ${destination} does not start with the PNG signature; output deleted`);
  }
  if (!written.equals(data)) {
    try {
      fs.unlinkSync(destination);
    } catch (err) {
      console.error(`error: cannot delete mismatched output ${destination}: ${(err as Error).message}`);
    }
    fail(`verification failed: ${destination} does not match ${source}; output deleted`);
  }

  console.log(`copied ${source} -> ${destination} (${written.length} bytes)`);
}

main();
