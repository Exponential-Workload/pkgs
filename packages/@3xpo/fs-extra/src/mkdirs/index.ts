'use strict';
import { fromPromise } from '@3xpo/universalify';
import { makeDir, makeDirSync } from './make-dir';

export const mkdirs = fromPromise(makeDir);
export const mkdirsSync = makeDirSync;
// alias
export const mkdirp = fromPromise(makeDir);
export const mkdirpSync = makeDirSync;
export const ensureDir = fromPromise(makeDir);
export const ensureDirSync = makeDirSync;
