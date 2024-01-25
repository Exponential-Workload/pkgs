'use strict';

import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';
import util from 'util';

/* global before, describe, it */

describe('mkdirp: issue-93, win32, when drive does not exist, it should return a cleaner error', () => {
  let TEST_DIR: string;

  // only seems to be an issue on Windows.
  if (process.platform !== 'win32') return;

  beforeAll(done => {
    TEST_DIR = path.join(os.tmpdir(), 'tests', 'fs-extra', 'mkdirp-issue-93');
    fse
      .emptyDir(TEST_DIR)
      .catch(err => err)
      .then(err => {
        assert.ifError(err);
        done();
      });
  });

  it('should return a cleaner error than inifinite loop, stack crash', done => {
    const file = 'R:\\afasd\\afaff\\fdfd'; // hopefully drive 'r' does not exist on appveyor
    // Different error codes on different Node versions (matches native mkdir behavior)
    const assertErr = err =>
      assert(
        ['EPERM', 'ENOENT'].includes(err.code),
        `expected 'EPERM' or 'ENOENT', got ${util.inspect(err.code)}`,
      );

    fse
      .mkdirp(file)
      .catch(err => err)
      .then(err => {
        assertErr(err);

        try {
          fse.mkdirsSync(file);
        } catch (err) {
          assertErr(err);
        }

        done();
      });
  });
});
