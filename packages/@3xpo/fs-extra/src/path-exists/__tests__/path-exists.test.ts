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
    return fs
      .pathExists(path.join(TEST_DIR, 'somefile'))
      .then(exists => expect(!exists).toBeTruthy());
  });

  it('should return true if file does exist', () => {
    const file = path.join(TEST_DIR, 'exists');
    fs.ensureFileSync(file);
    return fs.pathExists(file).then(exists => expect(exists).toBeTruthy());
  });

  it('should pass an empty error parameter to the callback', done => {
    const file = path.join(TEST_DIR, 'exists');
    fs.ensureFileSync(file);
    fs.pathExists(file, (err, exists) => {
      expect(err).toBeFalsy();
      expect(exists).toBeTruthy();
      done();
    });
  });
});
