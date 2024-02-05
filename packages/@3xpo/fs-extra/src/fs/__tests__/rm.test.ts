'use strict';

import fse from '../..';
import * as os from 'os';
import path from 'path';
import assert from 'assert';

/* eslint-env mocha */

describe('fs.rm', () => {
  let TEST_FILE;

  beforeEach(async () => {
    TEST_FILE = path.join(os.tmpdir(), 'fs-extra', 'fs-rm');
    return fse.remove(TEST_FILE);
  });

  afterEach(() => fse.remove(TEST_FILE));

  it('supports promises', () => {
    fse.writeFileSync(TEST_FILE, 'hello');
    return fse.rm(TEST_FILE).then(() => {
      expect(!fse.pathExistsSync(TEST_FILE)).toBeTruthy();
    });
  });
});
