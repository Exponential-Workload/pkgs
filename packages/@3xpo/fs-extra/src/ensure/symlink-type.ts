'use strict';

import * as fs from '../fs';
import { fromPromise } from '@3xpo/universalify';

export const symlinkType = fromPromise(
  async (srcpath: string, type?: 'dir' | 'file') => {
    if (type) return type;

    let stats: fs.Stats;
    try {
      stats = await fs.lstat(srcpath);
    } catch {
      return 'file';
    }

    return stats && stats.isDirectory() ? 'dir' : 'file';
  },
);

export const symlinkTypeSync = (srcpath: string, type?: 'dir' | 'file') => {
  if (type) return type;

  let stats: fs.Stats;
  try {
    stats = fs.lstatSync(srcpath);
  } catch {
    return 'file';
  }
  return stats && stats.isDirectory() ? 'dir' : 'file';
};

export default {
  symlinkType,
  symlinkTypeSync,
};
