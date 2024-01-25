'use strict';

import { fromPromise as u } from '@3xpo/universalify';
import path from 'path';
import * as fs from '../fs';
import * as mkdir from '../mkdirs';
import { pathExists } from '../path-exists';
import { areIdentical } from '../util/stat';

export const createLink = async (srcpath: string, dstpath: string) => {
  let dstStat: fs.Stats;
  try {
    dstStat = await fs.lstat(dstpath);
  } catch {
    // ignore error
  }

  let srcStat: fs.Stats;
  try {
    srcStat = await fs.lstat(srcpath);
  } catch (err) {
    err.message = err.message.replace('lstat', 'ensureLink');
    throw err;
  }

  if (dstStat && areIdentical(srcStat, dstStat)) return;

  const dir = path.dirname(dstpath);

  const dirExists = await pathExists(dir);

  if (!dirExists) {
    await mkdir.mkdirs(dir);
  }

  await fs.link(srcpath, dstpath);
};

export const createLinkSync = (srcpath: string, dstpath: string) => {
  let dstStat: fs.Stats;
  try {
    dstStat = fs.lstatSync(dstpath);
  } catch {}

  try {
    const srcStat = fs.lstatSync(srcpath);
    if (dstStat && areIdentical(srcStat, dstStat)) return;
  } catch (err) {
    err.message = err.message.replace('lstat', 'ensureLink');
    throw err;
  }

  const dir = path.dirname(dstpath);
  const dirExists = fs.existsSync(dir);
  if (dirExists) return fs.linkSync(srcpath, dstpath);
  mkdir.mkdirsSync(dir);

  return fs.linkSync(srcpath, dstpath);
};

export default {
  createLink: u(createLink),
  createLinkSync,
};
