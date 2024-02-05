'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('mkdirp / mkdirp', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdirp');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('should make the dir', async () => {
    const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
    const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
    const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

    const file = path.join(TEST_DIR, x, y, z);

    await fse.mkdirp(file, 0o755);
    const ex = await fse.pathExists(file);
    expect(ex).toBeTruthy();
    const stat = fs.statSync(file);

    if (os.platform().indexOf('win') === 0) {
      expect(stat.mode & 0o777).toEqual(0o666);
    } else {
      expect(stat.mode & 0o777).toEqual(0o755);
    }

    expect(stat.isDirectory()).toBeTruthy();
  });
});
