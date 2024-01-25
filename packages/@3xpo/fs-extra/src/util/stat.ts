'use strict';

import * as fs from '../fs';
import path from 'path';
import { fromPromise as fromPromise } from '@3xpo/universalify';

export const getStats = async (
  src: fs.PathLike,
  dest: fs.PathLike,
  opts?: { dereference?: boolean },
) => {
  const statFunc = opts?.dereference
    ? (file: fs.PathLike) => fs.stat(file, { bigint: true })
    : (file: fs.PathLike) => fs.lstat(file, { bigint: true });
  const [srcStat, destStat] = await Promise.all([
    statFunc(src),
    statFunc(dest).catch(err => {
      if (err.code === 'ENOENT') return null;
      throw err;
    }) as Promise<fs.BigIntStats | null>,
  ]);
  return { srcStat, destStat };
};

export const getStatsSync = (
  src: fs.PathLike,
  dest: fs.PathLike,
  opts?: { dereference?: boolean },
) => {
  let destStat: fs.BigIntStats;
  const statFunc = opts.dereference
    ? (file: fs.PathLike) => fs.statSync(file, { bigint: true })
    : (file: fs.PathLike) => fs.lstatSync(file, { bigint: true });
  const srcStat = statFunc(src);
  try {
    destStat = statFunc(dest);
  } catch (err) {
    if (err.code === 'ENOENT') return { srcStat, destStat: null };
    throw err;
  }
  return { srcStat, destStat };
};

export const checkPaths = fromPromise(
  async (
    src: string,
    dest: string,
    funcName: string,
    opts?: {
      dereference?: boolean;
    },
  ) => {
    const { srcStat, destStat } = await getStats(src, dest, opts);
    if (destStat) {
      if (areIdentical(srcStat, destStat)) {
        const srcBaseName = path.basename(src);
        const destBaseName = path.basename(dest);
        if (
          funcName === 'move' &&
          srcBaseName !== destBaseName &&
          srcBaseName.toLowerCase() === destBaseName.toLowerCase()
        ) {
          return { srcStat, destStat, isChangingCase: true };
        }
        throw new Error('Source and destination must not be the same.');
      }
      if (srcStat.isDirectory() && !destStat.isDirectory()) {
        throw new Error(
          `Cannot overwrite non-directory '${dest}' with directory '${src}'.`,
        );
      }
      if (!srcStat.isDirectory() && destStat.isDirectory()) {
        throw new Error(
          `Cannot overwrite directory '${dest}' with non-directory '${src}'.`,
        );
      }
    }

    if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
      throw new Error(errMsg(src, dest, funcName));
    }

    return { srcStat, destStat };
  },
);

export const checkPathsSync = (
  src: string,
  dest: string,
  funcName: string,
  opts?: {
    dereference?: boolean;
  },
) => {
  const { srcStat, destStat } = getStatsSync(src, dest, opts);

  if (destStat) {
    if (areIdentical(srcStat, destStat)) {
      const srcBaseName = path.basename(src);
      const destBaseName = path.basename(dest);
      if (
        funcName === 'move' &&
        srcBaseName !== destBaseName &&
        srcBaseName.toLowerCase() === destBaseName.toLowerCase()
      ) {
        return { srcStat, destStat, isChangingCase: true };
      }
      throw new Error('Source and destination must not be the same.');
    }
    if (srcStat.isDirectory() && !destStat.isDirectory()) {
      throw new Error(
        `Cannot overwrite non-directory '${dest}' with directory '${src}'.`,
      );
    }
    if (!srcStat.isDirectory() && destStat.isDirectory()) {
      throw new Error(
        `Cannot overwrite directory '${dest}' with non-directory '${src}'.`,
      );
    }
  }

  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
    throw new Error(errMsg(src, dest, funcName));
  }
  return { srcStat, destStat };
};

// recursively check if dest parent is a subdirectory of src.
// It works for all file types including symlinks since it
// checks the src and dest inodes. It starts from the deepest
// parent and stops once it reaches the src parent or the root path.
export const checkParentPaths = async (
  src: string,
  srcStat: fs.BigIntStats,
  dest: string,
  funcName: string,
) => {
  const srcParent = path.resolve(path.dirname(src));
  const destParent = path.resolve(path.dirname(dest));
  if (destParent === srcParent || destParent === path.parse(destParent).root)
    return;

  let destStat: fs.BigIntStats;
  try {
    destStat = await fs.stat(destParent, { bigint: true });
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }

  if (areIdentical(srcStat, destStat)) {
    throw new Error(errMsg(src, dest, funcName));
  }

  return checkParentPaths(src, srcStat, destParent, funcName);
};

export const checkParentPathsSync = (
  src: string,
  srcStat: fs.BigIntStats,
  dest: string,
  funcName: Parameters<typeof errMsg>[2],
) => {
  const srcParent = path.resolve(path.dirname(src));
  const destParent = path.resolve(path.dirname(dest));
  if (destParent === srcParent || destParent === path.parse(destParent).root)
    return;
  let destStat;
  try {
    destStat = fs.statSync(destParent, { bigint: true });
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }
  if (areIdentical(srcStat, destStat)) {
    throw new Error(errMsg(src, dest, funcName));
  }
  return checkParentPathsSync(src, srcStat, destParent, funcName);
};

export const areIdentical = (
  srcStat: {
    ino: fs.Stats['ino'] | fs.BigIntStats['ino'];
    dev: fs.Stats['dev'] | fs.BigIntStats['dev'];
  },
  destStat: {
    ino: fs.Stats['ino'] | fs.BigIntStats['ino'];
    dev: fs.Stats['dev'] | fs.BigIntStats['dev'];
  },
) => {
  return (
    destStat.ino &&
    destStat.dev &&
    destStat.ino === srcStat.ino &&
    destStat.dev === srcStat.dev
  );
};

// return true if dest is a subdir of src, otherwise false.
// It only checks the path strings.
export const isSrcSubdir = (src: string, dest: string) => {
  const srcArr = path
    .resolve(src)
    .split(path.sep)
    .filter(i => i);
  const destArr = path
    .resolve(dest)
    .split(path.sep)
    .filter(i => i);
  return srcArr.every((cur, i) => destArr[i] === cur);
};

export const errMsg = (src: string, dest: string, funcName: string) =>
  `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;

export default {
  // checkPaths
  checkPaths,
  checkPathsSync,
  // checkParent
  checkParentPaths: fromPromise(checkParentPaths),
  checkParentPathsSync,
  // Misc
  isSrcSubdir,
  areIdentical,
};
