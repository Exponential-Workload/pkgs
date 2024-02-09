import ensureRaw from './ensure-raw';
import { execSync } from 'node:child_process';
import os from 'node:os';
import { resolve } from 'node:path';
import fs from '@3xpo/fs-extra';

/** Ensures the binaries exist; runs synchronously */
export const run = (
  outputLocation = process.platform === 'win32' ? 'C:/' : '/tmp/prisma-engines',
) => {
  const enginesDir = resolve(
    os.tmpdir() ?? process.cwd(),
    '.get-prisma-engines',
  );
  const filepath = resolve(enginesDir, '.fetcher', '.ensure-prisma.cjs');
  fs.outputFileSync(filepath, ensureRaw);
  execSync(`${JSON.stringify(process.argv[0])} ${JSON.stringify(filepath)}`, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PROC_IS_ENSURE_BINS_EXIST_PROC: 'YES',
    },
    stdio: 'inherit',
  });
  fs.rmSync(resolve(filepath, '..'), {
    recursive: true,
    force: true,
  });
  fs.ensureDirSync(outputLocation);
  fs.readdirSync(enginesDir).forEach(v =>
    fs.moveSync(resolve(enginesDir, v), resolve(outputLocation, v), {
      overwrite: true,
    }),
  );
  fs.rmSync(enginesDir, {
    recursive: true,
    force: true,
  });
};

export default run;
