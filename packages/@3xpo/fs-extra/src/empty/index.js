'use strict';

import { fromPromise as u } from '@3xpo/universalify';
import * as fs from '../fs';
import path from 'path';
const mkdir = require('../mkdirs');
const remove = require('../remove');

const emptyDir = u(async function emptyDir(dir) {
  let items;
  try {
    items = await fs.readdir(dir);
  } catch {
    return mkdir.mkdirs(dir);
  }

  return Promise.all(items.map(item => remove.remove(path.join(dir, item))));
});

function emptyDirSync(dir) {
  let items;
  try {
    items = fs.readdirSync(dir);
  } catch {
    return mkdir.mkdirsSync(dir);
  }

  items.forEach(item => {
    item = path.join(dir, item);
    remove.removeSync(item);
  });
}

export default {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir,
};
