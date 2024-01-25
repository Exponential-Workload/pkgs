'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('json promise support', () => {
  let TEST_DIR;

  beforeEach(done => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'json');
    fse.emptyDir(TEST_DIR, done);
  });

  afterEach(done => fse.remove(TEST_DIR, done));
  ['writeJson', 'writeJSON'].forEach(method => {
    describe(method, () => {
      it('should support promises', () => {
        const obj1 = {
          firstName: 'JP',
          lastName: 'Richardson',
        };

        const file = path.join(TEST_DIR, 'promise.json');
        return fse[method](file, obj1).then(() => {
          const data = fs.readFileSync(file, 'utf8');
          assert.strictEqual(data, JSON.stringify(obj1) + '\n');
        });
      });
    });
  });
});