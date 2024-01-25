'use strict';

import { fromPromise as u } from '@3xpo/universalify';
export default {
  copy: u(require('./copy')),
  copySync: require('./copy-sync'),
};
