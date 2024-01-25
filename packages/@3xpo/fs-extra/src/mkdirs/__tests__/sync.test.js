'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('mkdirp / sync', () => {
  let TEST_DIR;
  let file;

  beforeEach(done => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdirp-sync');
    fse.emptyDir(TEST_DIR, err => {
      assert.ifError(err);

      const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
      const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
      const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

      file = path.join(TEST_DIR, x, y, z);

      done();
    });
  });

  afterEach(done => fse.remove(TEST_DIR, done));

  it('should', done => {
    try {
      fse.mkdirpSync(file, 0o755);
    } catch (err) {
      assert.fail(err);
    }

    fse.pathExists(file, (err, ex) => {
      assert.ifError(err);
      assert.ok(ex, 'file created');
      fs.stat(file, (err, stat) => {
        assert.ifError(err);
        // http://stackoverflow.com/questions/592448/c-how-to-set-file-permissions-cross-platform
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
