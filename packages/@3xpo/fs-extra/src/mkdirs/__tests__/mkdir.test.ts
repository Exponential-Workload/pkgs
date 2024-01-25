'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('fs-extra', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdir');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('+ mkdirs()', () => {
    it('should make the directory', done => {
      const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());

      assert(!fs.existsSync(dir));

      fse
        .mkdirs(dir)
        .catch(err => err)
        .then(err => {
          assert.ifError(err);
          assert(fs.existsSync(dir));
          done();
        });
    });

    it('should make the entire directory path', async () => {
      const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());
      const newDir = path.join(TEST_DIR, 'dfdf', 'ffff', 'aaa');

      assert(!fs.existsSync(dir));
      await fse.mkdirs(newDir);
      assert(fs.existsSync(newDir));
    });
  });

  describe('+ mkdirsSync()', () => {
    it('should make the directory', done => {
      const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());

      assert(!fs.existsSync(dir));
      fse.mkdirsSync(dir);
      assert(fs.existsSync(dir));

      done();
    });

    it('should make the entire directory path', done => {
      const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());
      const newDir = path.join(dir, 'dfdf', 'ffff', 'aaa');

      assert(!fs.existsSync(newDir));
      fse.mkdirsSync(newDir);
      assert(fs.existsSync(newDir));

      done();
    });
  });
});
