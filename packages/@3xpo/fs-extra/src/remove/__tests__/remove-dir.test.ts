'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global beforeEach, describe, it */

describe('remove / async / dir', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'remove-async-dir');
    return fse.emptyDir(TEST_DIR);
  });

  describe('> when dir does not exist', () => {
    it('should not throw an error', done => {
      const someDir = path.join(TEST_DIR, 'some-dir/');
      expect(fs.existsSync(someDir)).toBe(false);
      fse
        .remove(someDir)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          done();
        });
    });
  });
});
