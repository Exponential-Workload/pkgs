'use strict';

import fs from 'graceful-fs';
import path from 'path';
import { copySync } from '../copy';
import { removeSync } from '../remove';
import { mkdirpSync } from '../mkdirs';
import stat from '../util/stat';

export const moveSync = (src: string, dest: string, opts) => {
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;

  const { srcStat, isChangingCase = false } = stat.checkPathsSync(
    src,
    dest,
    'move',
    opts,
  );
  stat.checkParentPathsSync(src, srcStat, dest, 'move');
  if (!isParentRoot(dest)) mkdirpSync(path.dirname(dest));
  return doRename(src, dest, overwrite, isChangingCase);
};

export const isParentRoot = (dest: string) => {
  const parent = path.dirname(dest);
  const parsedPath = path.parse(parent);
  return parsedPath.root === parent;
};

export const doRename = (
  src: string,
  dest: string,
  overwrite?: boolean,
  isChangingCase?: boolean,
) => {
  if (isChangingCase) return rename(src, dest, overwrite);
  if (overwrite) {
    removeSync(dest);
    return rename(src, dest, overwrite);
  }
  if (fs.existsSync(dest)) throw new Error('dest already exists.');
  return rename(src, dest, overwrite);
};

export const rename = (src: string, dest: string, overwrite?: boolean) => {
  try {
    fs.renameSync(src, dest);
  } catch (err) {
    if (err.code !== 'EXDEV') throw err;
    return moveAcrossDevice(src, dest, overwrite);
  }
};

export const moveAcrossDevice = (
  src: string,
  dest: string,
  overwrite?: boolean,
) => {
  const opts = {
    overwrite,
    errorOnExist: true,
    preserveTimestamps: true,
  };
  copySync(src, dest, opts);
  return removeSync(src);
};

export default moveSync;
