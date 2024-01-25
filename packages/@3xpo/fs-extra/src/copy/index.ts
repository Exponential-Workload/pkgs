'use strict';

import { fromPromise as fromPromise } from '@3xpo/universalify';
import copy from './copy';
import copySync from './copy-sync';
export { copy, copySync };
export default {
  copy: fromPromise(copy),
  copySync: copySync,
};
