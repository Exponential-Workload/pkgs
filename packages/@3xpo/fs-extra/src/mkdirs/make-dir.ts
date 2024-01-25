'use strict';
import * as fs from '../fs';
import { checkPath } from './utils';

const getMode = (options?: number | { mode?: number }) => {
  const defaults = { mode: 0o777 };
  if (typeof options === 'number') return options;
  return { ...defaults, ...options }.mode;
};

export const makeDir = async (
  dir: string,
  options: Parameters<typeof getMode>[0],
) => {
  checkPath(dir);

  return fs.mkdir(dir, {
    mode: getMode(options),
    recursive: true,
  });
};

export const makeDirSync = (dir, options) => {
  checkPath(dir);

  return fs.mkdirSync(dir, {
    mode: getMode(options),
    recursive: true,
  });
};
