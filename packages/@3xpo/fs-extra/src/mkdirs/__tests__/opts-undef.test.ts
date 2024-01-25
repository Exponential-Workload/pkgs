'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';

/* global beforeEach, describe, it */

describe('mkdirs / opts-undef', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdirs');
    return fse.emptyDir(TEST_DIR);
  });

  // https://github.com/substack/node-mkdirp/issues/45
  it('should not hang', async () => {
    const newDir = path.join(TEST_DIR, 'doest', 'not', 'exist');
    expect(fs.existsSync(newDir)).toBeFalsy();
    await fse.mkdirs(newDir);
    expect(fs.existsSync(newDir)).toBeTruthy();
  });
});
