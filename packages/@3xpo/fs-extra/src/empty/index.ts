'use strict';

import { fromPromise } from '@3xpo/universalify';
import * as fs from '../fs';
import path from 'path';
import * as mkdir from '../mkdirs';
import remove from '../remove';

export const emptyDir = fromPromise(async dir => {
  let items: any[];
  try {
    items = await fs.readdir(dir);
  } catch {
    return mkdir.mkdirs(dir);
  }

  return Promise.all(
    items.map((item: string) => remove.remove(path.join(dir, item))),
  );
});
export const emptydir = emptyDir;

export const emptyDirSync = (dir: string) => {
  let items: string[];
  try {
    items = fs.readdirSync(dir);
  } catch {
    return mkdir.mkdirsSync(dir);
  }

  items.forEach((item: string) => {
    item = path.join(dir, item);
    remove.removeSync(item);
  });
};
export const emptydirSync = emptyDirSync;

export default {
  emptyDirSync,
  emptydirSync,
  emptyDir,
  emptydir,
};
