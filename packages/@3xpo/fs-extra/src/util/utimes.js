'use strict';

import * as fs from '../fs';
import { fromPromise as u } from '@3xpo/universalify';

async function utimesMillis(path, atime, mtime) {
  // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
  const fd = await fs.open(path, 'r+');

  let closeErr = null;

  try {
    await fs.futimes(fd, atime, mtime);
  } finally {
    try {
      await fs.close(fd);
    } catch (e) {
      closeErr = e;
    }
  }

  if (closeErr) {
    throw closeErr;
  }
}

function utimesMillisSync(path, atime, mtime) {
  const fd = fs.openSync(path, 'r+');
  fs.futimesSync(fd, atime, mtime);
  return fs.closeSync(fd);
}

export default {
  utimesMillis: u(utimesMillis),
  utimesMillisSync,
};