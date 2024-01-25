'use strict';

import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* eslint-env mocha */

describe('fs.copyFile', () => {
  let TEST_DIR: string;

  beforeEach(done => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'fs-copyfile');
    fse.emptyDir(TEST_DIR, done);
  });

  afterEach(() => fse.remove(TEST_DIR));

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
