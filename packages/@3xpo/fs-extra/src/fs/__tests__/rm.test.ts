'use strict';

import fse from '../..';
import * as os from 'os';
import path from 'path';
import assert from 'assert';

/* eslint-env mocha */

describe('fs.rm', () => {
  let TEST_FILE;

  beforeEach(done => {
    TEST_FILE = path.join(os.tmpdir(), 'fs-extra', 'fs-rm');
    fse.remove(TEST_FILE).then(done);
  });

  afterEach(done => fse.remove(TEST_FILE).then(done));

  it('supports promises', () => {
    fse.writeFileSync(TEST_FILE, 'hello');
    return fse.rm(TEST_FILE).then(() => {
      assert(!fse.pathExistsSync(TEST_FILE));
    });
  });
});