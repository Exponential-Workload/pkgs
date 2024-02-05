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
  if (process.platform !== 'win32')
    return it('skip on windows', () => expect(true).toEqual(true));

  beforeAll(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'mkdirp-issue-93');
    fse.rmSync(TEST_DIR, {
      recursive: true,
      force: true,
    });
  });

  it('should return a cleaner error than inifinite loop, stack crash', done => {
    const file = 'R:\\afasd\\afaff\\fdfd'; // hopefully drive 'r' does not exist on appveyor
    // Different error codes on different Node versions (matches native mkdir behavior)
    const assertErr = err =>
      expect(['EPERM', 'ENOENT'].includes(err.code)).toBeTruthy();

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
