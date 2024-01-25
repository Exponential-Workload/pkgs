'use strict';

import { RemoveFirst, fromPromise } from '@3xpo/universalify';
import * as fs from '../fs';
import path from 'path';
import * as mkdir from '../mkdirs';
import { pathExists } from '../path-exists';

export const outputFile = async (
  file: string,
  data: string | NodeJS.ArrayBufferView,
  encoding: fs.WriteFileOptions | BufferEncoding = 'utf-8',
) => {
  const dir = path.dirname(file);

  if (!(await pathExists(dir))) {
    await mkdir.mkdirs(dir);
  }

  return fs.writeFile(file, data, encoding);
};

export const outputFileSync = (
  file: string,
  ...args: RemoveFirst<Parameters<typeof fs.writeFileSync>>
) => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir);
  }

  fs.writeFileSync(file, ...args);
};

export default {
  outputFile: outputFile,
  outputFileSync,
};
