'use strict';

// relevant: https://github.com/jprichardson/node-fs-extra/issues/599

import * as os from 'os';
import fs from '../..';
import path from 'path';
import assert from 'assert';
import klawSync from 'klaw-sync';

/* global afterEach, beforeEach, describe, it */

let TEST_DIR = '';

const FILES = [
  path.join('dir1', 'file1.txt'),
  path.join('dir1', 'dir2', 'file2.txt'),
  path.join('dir1', 'dir2', 'dir3', 'file3.txt'),
];

describe('+ copySync() - copy a readonly directory with content', () => {
  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'copy-readonly-dir');
    return fs.emptyDir(TEST_DIR);
  });

  afterEach(() => {
    klawSync(TEST_DIR).forEach(data => fs.chmodSync(data.path, 0o777));
    return fs.remove(TEST_DIR);
  });

  describe('> when src is readonly directory with content', () => {
    it('should copy successfully', () => {
      FILES.forEach(file => {
        fs.outputFileSync(path.join(TEST_DIR, file), file);
      });
      const sourceDir = path.join(TEST_DIR, 'dir1');
      const sourceHierarchy = klawSync(sourceDir);
      sourceHierarchy.forEach(source =>
        fs.chmodSync(source.path, source.stats.isDirectory() ? 0o555 : 0o444),
      );

      const targetDir = path.join(TEST_DIR, 'target');
      fs.copySync(sourceDir, targetDir);

      // Make sure copy was made and mode was preserved
      expect(fs.existsSync(targetDir)).toBeTruthy();
      const targetHierarchy = klawSync(targetDir);
      expect(targetHierarchy.length === sourceHierarchy.length).toBeTruthy();
      targetHierarchy.forEach(target =>
        expect(
          target.stats.mode === target.stats.isDirectory() ? 0o555 : 0o444,
        ).toBeTruthy(),
      );
    });
  });
});
