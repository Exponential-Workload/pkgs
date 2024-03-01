'use strict';

const CWD = process.cwd();

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('mkdirp / relative', () => {
  const CWD = process.cwd();
  let TEST_DIR: string;
  let file: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'mkdirp-relative');
    if (!fs.existsSync(TEST_DIR)) await fse.mkdirp(TEST_DIR);
    await fse.emptyDir(TEST_DIR);
    const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
    const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
    const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
    // relative path
    file = path.join(x, y, z);
  });

  afterEach(async () => {
    process.chdir(CWD);
    await fse.rm(TEST_DIR, { recursive: true, force: true });
  });
  afterAll(() => process.chdir(CWD));

  it('should make the directory with relative path', async () => {
    process.chdir(TEST_DIR);

    await fse.mkdirp(file);

    const stats = await fs.promises.stat(path.join(TEST_DIR, file));

    assert.ok(stats.isDirectory());

    fs.rmdirSync(path.join(TEST_DIR, file));
  });
});
