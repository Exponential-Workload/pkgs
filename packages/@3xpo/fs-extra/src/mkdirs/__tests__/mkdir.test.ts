'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('@3xpo/fs-extra -> mkdirs -> mkdir', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdir');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('+ mkdirs()', () => {
    it('should make the directory', async () => {
      const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());

      expect(!fs.existsSync(dir)).toBeTruthy();

      await fse.mkdirs(dir);
      expect(fse.existsSync(dir)).toEqual(true);
    });

    it('should make the entire directory path', async () => {
      const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());
      const newDir = path.join(TEST_DIR, 'dfdf', 'ffff', 'aaa');

      expect(!fs.existsSync(dir)).toBeTruthy();
      await fse.mkdirs(newDir);
      expect(fs.existsSync(newDir)).toBeTruthy();
    });
  });

  describe('+ mkdirsSync()', () => {
    it('should make the directory', done => {
      const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());

      expect(!fs.existsSync(dir)).toBeTruthy();
      fse.mkdirsSync(dir);
      expect(fs.existsSync(dir)).toBeTruthy();

      done();
    });

    it('should make the entire directory path', done => {
      const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());
      const newDir = path.join(dir, 'dfdf', 'ffff', 'aaa');

      expect(!fs.existsSync(newDir)).toBeTruthy();
      fse.mkdirsSync(newDir);
      expect(fs.existsSync(newDir)).toBeTruthy();

      done();
    });
  });
});
