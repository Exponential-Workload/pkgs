'use strict';

import * as fs from '../fs';
import path from 'path';
import { copy } from '../copy';
import { remove } from '../remove';
import { mkdirp } from '../mkdirs';
import { pathExists } from '../path-exists';
import stat from '../util/stat';

export const move = async (
  src: string,
  dest: string,
  opts: {
    overwrite?: boolean;
    clobber?: boolean;
  } = {},
) => {
  const overwrite = opts.overwrite || opts.clobber || false;

  const { srcStat, isChangingCase = false } = await stat.checkPaths(
    src,
    dest,
    'move',
    opts,
  );

  await stat.checkParentPaths(src, srcStat, dest, 'move');

  // If the parent of dest is not root, make sure it exists before proceeding
  const destParent = path.dirname(dest);
  const parsedParentPath = path.parse(destParent);
  if (parsedParentPath.root !== destParent) {
    await mkdirp(destParent);
  }

  return doRename(src, dest, overwrite, isChangingCase);
};

export const doRename = async (
  src: string,
  dest: string,
  overwrite?: boolean,
  isChangingCase?: boolean,
) => {
  if (!isChangingCase) {
    if (overwrite) {
      await remove(dest);
    } else if (await pathExists(dest)) {
      throw new Error('dest already exists.');
    }
  }

  try {
    // Try w/ rename first, and try copy + remove if EXDEV
    await fs.rename(src, dest);
  } catch (err) {
    if (err.code !== 'EXDEV') {
      throw err;
    }
    await moveAcrossDevice(src, dest, overwrite);
  }
};

export const moveAcrossDevice = async (
  src: string,
  dest: string,
  overwrite?: boolean,
) => {
  const opts = {
    overwrite,
    errorOnExist: true,
    preserveTimestamps: true,
  };

  await copy(src, dest, opts);
  return remove(src);
};

export default move;
