import ensureRaw from './ensure-raw';
import { execSync } from 'node:child_process';
import os from 'node:os';
import { resolve } from 'node:path';
import fs from '@3xpo/fs-extra';

/** Ensures the binaries exist; runs synchronously */
export const run = () => {
  const filepath = resolve(os.tmpdir() ?? process.cwd(), '.ensure-prisma.js');
  fs.outputFileSync(filepath, ensureRaw);
  execSync(`${JSON.stringify(process.argv[0])} ${JSON.stringify(filepath)}`, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PROC_IS_ENSURE_BINS_EXIST_PROC: 'YES',
    },
  });
  fs.rmSync(filepath);
};

export default run;
