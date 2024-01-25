'use strict';

import * as os from 'os';
import * as fs from 'fs';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('native fs', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'native-fs');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('should use native fs methods', () => {
    const file = path.join(TEST_DIR, 'write.txt');
    fse.writeFileSync(file, 'hello');
    const data = fse.readFileSync(file, 'utf8');
    assert.strictEqual(data, 'hello');
  });

  it('should have native fs constants', () => {
    assert.strictEqual(fse.constants.F_OK, fs.constants.F_OK);
    assert.strictEqual(fse.F_OK, fs.constants.F_OK); // soft deprecated usage, but still available
  });
});
