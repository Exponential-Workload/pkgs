'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('mkdirp / perm', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'mkdirp-perm');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('async perm', async () => {
    const file = path.join(TEST_DIR, (Math.random() * (1 << 30)).toString(16));

    await fse.mkdirp(file, 0o755);
    const exists = await fse.pathExists(file);
    expect(exists).toEqual(true);

    const stat = fs.statSync(file);

    if (os.platform().indexOf('win') === 0) {
      expect(stat.mode & 0o777).toStrictEqual(0o666);
    } else {
      expect(stat.mode & 0o777).toStrictEqual(0o755);
    }

    expect(stat.isDirectory()).toBeTruthy();
  });

  it('async root perm', () =>
    fse.mkdirp(path.join(os.tmpdir(), 'fs-extra-test-suite', '_tmp'), 0o755));
});
