'use strict';

import fs from '../..';
import * as os from 'os';
import path from 'path';
import assert from 'assert';
import stat from '../stat.js';

/* global beforeEach, afterEach, describe, it */

describe('util/stat', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'util-stat');
    return fs.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.remove(TEST_DIR));

  describe('should use stats with bigint type', () => {
    it('stat.checkPaths()', () => {
      const src = path.join(TEST_DIR, 'src');
      const dest = path.join(TEST_DIR, 'dest');
      fs.ensureFileSync(src);
      fs.ensureFileSync(dest);
      stat.checkPaths(src, dest, 'copy', {}, (err, stats) => {
        assert.ifError(err);
        assert.strictEqual(typeof stats?.srcStat.ino, 'bigint');
      });
    });

    it('stat.checkPathsSync()', () => {
      const src = path.join(TEST_DIR, 'src');
      const dest = path.join(TEST_DIR, 'dest');
      fs.ensureFileSync(src);
      fs.ensureFileSync(dest);
      const { srcStat } = stat.checkPathsSync(src, dest, 'copy', {});
      assert.strictEqual(typeof srcStat.ino, 'bigint');
    });
  });

  describe('should stop at src or root path and not throw max call stack size error', () => {
    it('stat.checkParentPaths()', () => {
      const src = path.join(TEST_DIR, 'src');
      let dest = path.join(TEST_DIR, 'dest');
      fs.ensureFileSync(src);
      fs.ensureFileSync(dest);
      dest = path.basename(dest);
      const srcStat = fs.statSync(src, {
        bigint: true,
      });
      stat.checkParentPaths(src, srcStat, dest, 'copy', err => {
        assert.ifError(err);
      });
    });

    it('stat.checkParentPathsSync()', () => {
      const src = path.join(TEST_DIR, 'src');
      let dest = path.join(TEST_DIR, 'dest');
      fs.ensureFileSync(src);
      fs.ensureFileSync(dest);
      dest = path.basename(dest);
      const srcStat = fs.statSync(src, {
        bigint: true,
      });
      stat.checkParentPathsSync(src, srcStat, dest, 'copy');
    });
  });
});
