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

  it('should make the dir', done => {
    const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
    const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
    const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

    const file = path.join(TEST_DIR, x, y, z);

    fse
      .mkdirp(file, 0o755)
      .catch(err => err)
      .then(err => {
        assert.ifError(err);
        fse.pathExists(file, (err, ex) => {
          assert.ifError(err);
          assert.ok(ex, 'file created');
          fs.stat(file, (err, stat) => {
            assert.ifError(err);

            if (os.platform().indexOf('win') === 0) {
              assert.strictEqual(stat.mode & 0o777, 0o666);
            } else {
              assert.strictEqual(stat.mode & 0o777, 0o755);
            }

            assert.ok(stat.isDirectory(), 'target not a directory');
            done();
          });
        });
      });
  });
});
