'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';
import { copy } from '../';

/* global afterEach, beforeEach, describe, it */

describe('copy / broken symlink', () => {
  const TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'copy-broken-symlink');
  const src = path.join(TEST_DIR, 'src');
  const dest = path.join(TEST_DIR, 'dest');

  beforeEach(done => {
    fse.emptyDir(TEST_DIR, err => {
      assert.ifError(err);
      createFixtures(src, done);
    });
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('when symlink is broken', () => {
    it('should not throw error if dereference is false', done => {
      copy(src, dest)
        .catch(err => err)
        .then(err => {
          assert.strictEqual(err, null);
          done();
        });
    });

    it('should throw error if dereference is true', done => {
      copy(src, dest, { dereference: true })
        .catch(err => err)
        .then(err => {
          assert.strictEqual(err.code, 'ENOENT');
          done();
        });
    });
  });
});

function createFixtures(srcDir, callback) {
  fs.mkdir(srcDir, err => {
    let brokenFile;
    let brokenFileLink;

    if (err) return callback(err);

    try {
      brokenFile = path.join(srcDir, 'does-not-exist');
      brokenFileLink = path.join(srcDir, 'broken-symlink');
      fs.writeFileSync(brokenFile, 'does not matter');
      fs.symlinkSync(brokenFile, brokenFileLink, 'file');
    } catch (err) {
      callback(err);
    }

    // break the symlink now
    fse
      .remove(brokenFile)
      .catch(err => err)
      .then(callback);
  });
}