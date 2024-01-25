'use strict';

import fs from 'graceful-fs';
import { fromCallback } from '@3xpo/universalify';

export const remove = fromCallback(
  (path: string, callback?: fs.NoParamCallback) => {
    fs.rm(path, { recursive: true, force: true }, callback);
  },
);

export const removeSync = (path: string) => {
  fs.rmSync(path, { recursive: true, force: true });
};

export default {
  remove,
  removeSync,
};
