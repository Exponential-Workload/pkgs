'use strict';

import fs from 'graceful-fs';
import { fromCallback } from '@3xpo/universalify';

export const remove = (path, callback) => {
  fs.rm(path, { recursive: true, force: true }, callback);
};

export const removeSync = path => {
  fs.rmSync(path, { recursive: true, force: true });
};

export default {
  remove: fromCallback(remove),
  removeSync,
};
