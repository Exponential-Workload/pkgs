'use strict';

const CWD = process.cwd();

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('mkdirp / relative', () => {
  let TEST_DIR: string;
  let file;

  beforeEach(done => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdirp-relative');
    fse
      .emptyDir(TEST_DIR)
      .catch(err => err)
      .then(err => {
        assert.ifError(err);

        const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
        const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

        // relative path
        file = path.join(x, y, z);

        done();
      });
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('should make the directory with relative path', done => {
    process.chdir(TEST_DIR);

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
            // restore
            process.chdir(CWD);

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