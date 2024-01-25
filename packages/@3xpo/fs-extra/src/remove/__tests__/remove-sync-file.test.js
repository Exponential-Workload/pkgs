'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global beforeEach, describe, it */

describe('remove/sync', () => {
  let TEST_DIR;

  beforeEach(done => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'remove-sync');
    fse.emptyDir(TEST_DIR, done);
  });

  describe('+ removeSync()', () => {
    it('should delete a file synchronously', () => {
      const file = path.join(TEST_DIR, 'file');
      fs.writeFileSync(file, 'hello');
      assert(fs.existsSync(file));
      fse.removeSync(file);
      assert(!fs.existsSync(file));
    });
  });
});