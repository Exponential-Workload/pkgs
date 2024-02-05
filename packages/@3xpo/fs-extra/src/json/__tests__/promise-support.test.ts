'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('json promise support', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'json');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));
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
          expect(data).toBe(JSON.stringify(obj1) + '\n');
        });
      });
    });
  });
});
