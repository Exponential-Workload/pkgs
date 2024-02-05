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
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'native-fs');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('should use native fs methods', () => {
    const file = path.join(TEST_DIR, 'write.txt');
    fse.writeFileSync(file, 'hello');
    const data = fse.readFileSync(file, 'utf8');
    expect(data).toBe('hello');
  });

  it('should have native fs constants', () => {
    expect(fse.constants.F_OK).toBe(fs.constants.F_OK);
    expect(fse.F_OK).toBe(fs.constants.F_OK); // soft deprecated usage, but still available
  });
});
