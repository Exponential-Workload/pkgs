'use strict';

import fs from 'graceful-fs';
import path from 'path';
import { copySync } from '../copy';
import { removeSync } from '../remove';
import { mkdirpSync } from '../mkdirs';
import stat from '../util/stat';

function moveSync(src, dest, opts) {
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
}

function isParentRoot(dest) {
  const parent = path.dirname(dest);
  const parsedPath = path.parse(parent);
  return parsedPath.root === parent;
}

function doRename(src, dest, overwrite, isChangingCase) {
  if (isChangingCase) return rename(src, dest, overwrite);
  if (overwrite) {
    removeSync(dest);
    return rename(src, dest, overwrite);
  }
  if (fs.existsSync(dest)) throw new Error('dest already exists.');
  return rename(src, dest, overwrite);
}

function rename(src, dest, overwrite) {
  try {
    fs.renameSync(src, dest);
  } catch (err) {
    if (err.code !== 'EXDEV') throw err;
    return moveAcrossDevice(src, dest, overwrite);
  }
}

function moveAcrossDevice(src, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true,
    preserveTimestamps: true,
  };
  copySync(src, dest, opts);
  return removeSync(src);
}

export default moveSync;
