'use strict';

// file in reference: https://github.com/jprichardson/node-fs-extra/issues/56

import * as fs from 'fs';
import * as os from 'os';
import fse from '../../..';
import { copy as ncp } from '../../';
import path from 'path';

/* global afterEach, beforeEach, describe, it */

// skip test for windows
// eslint-disable globalReturn */
// if (os.platform().indexOf('win') === 0) return
// eslint-enable globalReturn */

describe('ncp / error / dest-permission', () => {
  const TEST_DIR = path.join(
    os.tmpdir(),
    'fs-extra-test-suite',
    'ncp-error-dest-perm',
  );
  const src = path.join(TEST_DIR, 'src');
  const dest = path.join(TEST_DIR, 'dest');

  // when we are root, then we will be able to create the subdirectory even if
  // we don't have the permissions to do so, so no point in running this test
  if (process.platform === 'win32' || os.userInfo().uid === 0)
    return it.skip('skip platform/uid', () => void 0);

  beforeEach(() => {
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('should return an error', done => {
    const someFile = path.join(src, 'some-file');
    fse.outputFileSync(someFile, 'hello');

    fse.mkdirsSync(dest);
    fs.chmodSync(dest, 0o444);

    const subdest = path.join(dest, 'another-dir');

    ncp(src, subdest, err => {
      expect(err).toBeTruthy();
      expect(err.code).toBe('EACCES');
      done();
    });
  });
});
