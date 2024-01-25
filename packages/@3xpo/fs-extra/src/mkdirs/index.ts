'use strict';
import { makeDir, makeDirSync } from './make-dir';

export const mkdirs = makeDir;
export const mkdirsSync = makeDirSync;
// alias
export const mkdirp = makeDir;
export const mkdirpSync = makeDirSync;
export const ensureDir = makeDir;
export const ensureDirSync = makeDirSync;
