'use strict';

import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* eslint-env mocha */

describe('fs.copyFile', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'fs-copyfile');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fse.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('supports promises', () => {
    const src = path.join(TEST_DIR, 'init.txt');
    const dest = path.join(TEST_DIR, 'copy.txt');
    fse.writeFileSync(src, 'hello');
    return fse.copyFile(src, dest).then(() => {
      const data = fse.readFileSync(dest, 'utf8');
      assert.strictEqual(data, 'hello');
    });
  });
});
