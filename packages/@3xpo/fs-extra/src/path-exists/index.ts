'use strict';
import { fromPromise } from '@3xpo/universalify';
import * as fs from '../fs';

export const pathExists = fromPromise(async (path: string) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
});

export const pathExistsSync = fs.existsSync;
