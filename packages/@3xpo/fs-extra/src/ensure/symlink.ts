'use strict';

import { fromPromise as u } from '@3xpo/universalify';
import path from 'path';
import * as fs from '../fs';

import { mkdirs, mkdirsSync } from '../mkdirs';

import { symlinkPaths, symlinkPathsSync } from './symlink-paths';
import { symlinkType, symlinkTypeSync } from './symlink-type';

import { pathExists } from '../path-exists';

import { areIdentical } from '../util/stat';

async function createSymlink(srcpath, dstpath, type) {
  let stats;
  try {
    stats = await fs.lstat(dstpath);
  } catch {}

  if (stats && stats.isSymbolicLink()) {
    const [srcStat, dstStat] = await Promise.all([
      fs.stat(srcpath),
      fs.stat(dstpath),
    ]);

    if (areIdentical(srcStat, dstStat)) return;
  }

  const relative = await symlinkPaths(srcpath, dstpath);
  srcpath = relative.toDst;
  const toType = await symlinkType(relative.toCwd, type);
  const dir = path.dirname(dstpath);

  if (!(await pathExists(dir))) {
    await mkdirs(dir);
  }

  return fs.symlink(srcpath, dstpath, toType);
}

function createSymlinkSync(srcpath, dstpath, type) {
  let stats;
  try {
    stats = fs.lstatSync(dstpath);
  } catch {}
  if (stats && stats.isSymbolicLink()) {
    const srcStat = fs.statSync(srcpath);
    const dstStat = fs.statSync(dstpath);
    if (areIdentical(srcStat, dstStat)) return;
  }

  const relative = symlinkPathsSync(srcpath, dstpath);
  srcpath = relative.toDst;
  type = symlinkTypeSync(relative.toCwd, type);
  const dir = path.dirname(dstpath);
  const exists = fs.existsSync(dir);
  if (exists) return fs.symlinkSync(srcpath, dstpath, type);
  mkdirsSync(dir);
  return fs.symlinkSync(srcpath, dstpath, type);
}

export default {
  createSymlink: u(createSymlink),
  createSymlinkSync,
};
