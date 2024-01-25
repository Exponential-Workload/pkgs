'use strict';

import * as fs from '../fs';
import { fromPromise as u } from '@3xpo/universalify';

async function symlinkType(srcpath, type) {
  if (type) return type;

  let stats;
  try {
    stats = await fs.lstat(srcpath);
  } catch {
    return 'file';
  }

  return stats && stats.isDirectory() ? 'dir' : 'file';
}

function symlinkTypeSync(srcpath, type) {
  if (type) return type;

  let stats;
  try {
    stats = fs.lstatSync(srcpath);
  } catch {
    return 'file';
  }
  return stats && stats.isDirectory() ? 'dir' : 'file';
}

export default {
  symlinkType: u(symlinkType),
  symlinkTypeSync,
};
