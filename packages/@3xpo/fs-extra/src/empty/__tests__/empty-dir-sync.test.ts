'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('+ emptyDir()', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'test-fs-extra', 'empty-dir');
    if (fs.existsSync(TEST_DIR)) {
      fse.removeSync(TEST_DIR);
    }
    fse.ensureDirSync(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('> when directory exists and contains items', () => {
    it('should delete all of the items', () => {
      // verify nothing
      assert.strictEqual(fs.readdirSync(TEST_DIR).length, 0);
      fse.ensureFileSync(path.join(TEST_DIR, 'some-file'));
      fse.ensureFileSync(path.join(TEST_DIR, 'some-file-2'));
      fse.ensureDirSync(path.join(TEST_DIR, 'some-dir'));
      assert.strictEqual(fs.readdirSync(TEST_DIR).length, 3);

      fse.emptyDirSync(TEST_DIR);
      assert.strictEqual(fs.readdirSync(TEST_DIR).length, 0);
    });
  });

  describe('> when directory exists and contains no items', () => {
    it('should do nothing', () => {
      assert.strictEqual(fs.readdirSync(TEST_DIR).length, 0);
      fse.emptyDirSync(TEST_DIR);
      assert.strictEqual(fs.readdirSync(TEST_DIR).length, 0);
    });
  });

  describe('> when directory does not exist', () => {
    it('should create it', () => {
      fse.removeSync(TEST_DIR);
      assert(!fs.existsSync(TEST_DIR));
      fse.emptyDirSync(TEST_DIR);
      assert.strictEqual(fs.readdirSync(TEST_DIR).length, 0);
    });
  });
});
