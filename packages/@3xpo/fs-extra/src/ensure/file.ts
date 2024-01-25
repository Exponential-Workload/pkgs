'use strict';

import { fromPromise } from '@3xpo/universalify';
import path from 'path';
import * as fs from '../fs';
import * as mkdir from '../mkdirs';

export const createFile = async (file: string) => {
  let stats: fs.Stats | undefined;
  try {
    stats = await fs.stat(file);
  } catch {}
  if (stats && stats.isFile()) return;

  const dir = path.dirname(file);

  let dirStats = null;
  try {
    dirStats = await fs.stat(dir);
  } catch (err) {
    // if the directory doesn't exist, make it
    if (err.code === 'ENOENT') {
      await mkdir.mkdirs(dir);
      await fs.writeFile(file, '');
      return;
    } else {
      throw err;
    }
  }

  if (dirStats.isDirectory()) {
    await fs.writeFile(file, '');
  } else {
    // parent is not a directory
    // This is just to cause an internal ENOTDIR error to be thrown
    await fs.readdir(dir);
  }
};

export const createFileSync = (file: string) => {
  let stats: fs.Stats;
  try {
    stats = fs.statSync(file);
  } catch {}
  if (stats && stats.isFile()) return;

  const dir = path.dirname(file);
  try {
    if (!fs.statSync(dir).isDirectory()) {
      // parent is not a directory
      // This is just to cause an internal ENOTDIR error to be thrown
      fs.readdirSync(dir);
    }
  } catch (err) {
    // If the stat call above failed because the directory doesn't exist, create it
    if (err && err.code === 'ENOENT') mkdir.mkdirsSync(dir);
    else throw err;
  }

  fs.writeFileSync(file, '');
};

export default {
  createFile: fromPromise(createFile),
  createFileSync,
};
