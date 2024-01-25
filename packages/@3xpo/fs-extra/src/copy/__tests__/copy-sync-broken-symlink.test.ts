'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';
import copySync from '../copy-sync';
import { URL } from 'url';

/* global afterEach, beforeEach, describe, it */

describe('copy-sync / broken symlink', () => {
  const TEST_DIR = path.join(
    os.tmpdir(),
    'fs-extra',
    'copy-sync-broken-symlink',
  );
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
    it('should not throw error if dereference is false', () => {
      let err = null;
      try {
        copySync(src, dest);
      } catch (e) {
        err = e;
      }
      assert.strictEqual(err, null);
    });

    it('should throw error if dereference is true', () => {
      assert.throws(
        () => copySync(src, dest, { dereference: true }),
        err => (err as any)?.code === 'ENOENT',
      );
    });
  });
});

function createFixtures(srcDir: string, callback: any) {
  fs.mkdir(srcDir, err => {
    let brokenFile: string;
    let brokenFileLink: string;

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
