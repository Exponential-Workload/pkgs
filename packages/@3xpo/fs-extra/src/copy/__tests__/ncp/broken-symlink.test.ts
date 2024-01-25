// @ts-nocheck
'use strict';
import * as fs from 'fs';
import * as os from 'os';
import fse from '../../..';
import { copy as ncp } from '../../';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('ncp broken symlink', () => {
  const TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'ncp-broken-symlinks');
  const src = path.join(TEST_DIR, 'src');
  const out = path.join(TEST_DIR, 'out');

  beforeEach(done => {
    fse.emptyDir(TEST_DIR, err => {
      assert.ifError(err);
      createFixtures(src, done);
    });
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('should not error if symlink is broken', done => {
    ncp(src, out, err => {
      assert.strictEqual(err, null);
      done();
    });
  });

  it('should return an error if symlink is broken and dereference=true', done => {
    ncp(src, out, { dereference: true }, err => {
      assert.strictEqual(err.code, 'ENOENT');
      done();
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
    fse.remove(brokenFile, callback);
  });
}
