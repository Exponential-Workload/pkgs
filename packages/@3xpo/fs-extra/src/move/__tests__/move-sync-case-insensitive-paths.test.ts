'use strict';

import assert from 'assert';
import * as os from 'os';
import path from 'path';
import fs from '../..';

/* global beforeEach, afterEach, describe, it */

describe('+ moveSync() - case insensitive paths', () => {
  let TEST_DIR = '';
  let src = '';
  let dest = '';

  beforeEach(() => {
    TEST_DIR = path.join(
      os.tmpdir(),
      'fs-extra-test-suite',
      'move-sync-case-insensitive-paths',
    );
    return fs.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.removeSync(TEST_DIR));

  describe('> when src is a directory', () => {
    it('should move successfully', () => {
      src = path.join(TEST_DIR, 'srcdir');
      fs.outputFileSync(path.join(src, 'subdir', 'file.txt'), 'some data');
      dest = path.join(TEST_DIR, 'srcDir');

      fs.moveSync(src, dest);
      expect(fs.existsSync(dest)).toBeTruthy();
      expect(
        fs.readFileSync(path.join(dest, 'subdir', 'file.txt'), 'utf8'),
      ).toBe('some data');
    });
  });

  describe('> when src is a file', () => {
    it('should move successfully', () => {
      src = path.join(TEST_DIR, 'srcfile');
      fs.outputFileSync(src, 'some data');
      dest = path.join(TEST_DIR, 'srcFile');

      fs.moveSync(src, dest);
      expect(fs.existsSync(dest)).toBeTruthy();
      expect(fs.readFileSync(dest, 'utf8')).toBe('some data');
    });
  });

  describe('> when src is a symlink', () => {
    it('should move successfully, symlink dir', () => {
      src = path.join(TEST_DIR, 'srcdir');
      fs.outputFileSync(path.join(src, 'subdir', 'file.txt'), 'some data');
      const srcLink = path.join(TEST_DIR, 'src-symlink');
      fs.symlinkSync(src, srcLink, 'dir');
      dest = path.join(TEST_DIR, 'src-Symlink');

      fs.moveSync(srcLink, dest);
      expect(fs.existsSync(dest)).toBeTruthy();
      expect(
        fs.readFileSync(path.join(dest, 'subdir', 'file.txt'), 'utf8'),
      ).toBe('some data');
      const destLink = fs.readlinkSync(dest);
      expect(destLink).toBe(src);
    });

    it('should move successfully, symlink file', () => {
      src = path.join(TEST_DIR, 'srcfile');
      fs.outputFileSync(src, 'some data');
      const srcLink = path.join(TEST_DIR, 'src-symlink');
      fs.symlinkSync(src, srcLink, 'file');
      dest = path.join(TEST_DIR, 'src-Symlink');

      fs.moveSync(srcLink, dest);
      expect(fs.existsSync(dest)).toBeTruthy();
      expect(fs.readFileSync(dest, 'utf8')).toBe('some data');
      const destLink = fs.readlinkSync(dest);
      expect(destLink).toBe(src);
    });
  });
});
