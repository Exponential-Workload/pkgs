'use strict';
/* eslint-env mocha */

import fs from '../..';
import path from 'path';
import * as os from 'os';
import assert from 'assert';

describe('pathExists()', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'path-exists');
    return fs.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.remove(TEST_DIR));

  it('should return false if file does not exist', () => {
    expect(!fs.pathExistsSync(path.join(TEST_DIR, 'somefile'))).toBeTruthy();
  });

  it('should return true if file does exist', () => {
    const file = path.join(TEST_DIR, 'exists');
    fs.ensureFileSync(file);
    expect(fs.pathExistsSync(file)).toBeTruthy();
  });
});
