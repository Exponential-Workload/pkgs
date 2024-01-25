'use strict';

import _move from './move';
import { fromPromise } from '@3xpo/universalify';

export const move = fromPromise(_move);
export { default as moveSync } from './move-sync';
