'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('mkdirp / chmod', () => {
  let TEST_DIR: string;
  let TEST_SUBDIR: string;

  beforeEach(() => {
    const ps = [] as any[];
    for (let i = 0; i < 15; i++) {
      const dir = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
      ps.push(dir);
    }

    TEST_SUBDIR = ps.join(path.sep);

    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdirp-chmod');
    TEST_SUBDIR = path.join(TEST_DIR, TEST_SUBDIR);

    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('chmod-pre', async () => {
    const mode = 0o744;
    await fse.mkdirp(TEST_SUBDIR, mode);
    expect(fs.existsSync(TEST_SUBDIR)).toBeTruthy();
    const stat = fs.statSync(TEST_SUBDIR);
    expect(stat).toBeTruthy();
    expect(stat.isDirectory()).toBeTruthy();

    if (os.platform().indexOf('win') === 0) {
      expect(stat && stat.mode & 0o777).toEqual(0o666);
    } else {
      expect(stat && stat.mode & 0o777).toEqual(mode);
    }
  });

  it('chmod', async () => {
    const mode = 0o755;
    await fse.mkdirp(TEST_SUBDIR, mode);
    const stat = fs.statSync(TEST_SUBDIR);
    expect(stat && stat.isDirectory()).toBeTruthy();
  });
});
