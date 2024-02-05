'use strict';

import fs from '../..';
import * as os from 'os';
import path from 'path';
import assert from 'assert';
import stat from '../stat';

/* global beforeEach, afterEach, describe, it */

describe('util/stat', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'util-stat');
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
        expect(err).toBeFalsy();
        expect(typeof stats?.srcStat.ino).toBe('bigint');
      });
    });

    it('stat.checkPathsSync()', () => {
      const src = path.join(TEST_DIR, 'src');
      const dest = path.join(TEST_DIR, 'dest');
      fs.ensureFileSync(src);
      fs.ensureFileSync(dest);
      const { srcStat } = stat.checkPathsSync(src, dest, 'copy', {});
      expect(typeof srcStat.ino).toBe('bigint');
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
        expect(err).toBeFalsy();
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
