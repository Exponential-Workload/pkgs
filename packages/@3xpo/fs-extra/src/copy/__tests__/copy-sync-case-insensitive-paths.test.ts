'use strict';

import assert from 'assert';
import * as os from 'os';
import path from 'path';
import fs from '../../';
const platform = os.platform();

/* global beforeEach, afterEach, describe, it */

describe('+ copySync() - case insensitive paths', () => {
  let TEST_DIR = '';
  let src = '';
  let dest = '';

  beforeEach(async () => {
    TEST_DIR = path.join(
      os.tmpdir(),
      'fs-extra-test-suite',
      'copy-sync-case-insensitive-paths',
    );
    return fs.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.removeSync(TEST_DIR));

  describe('> when src is a directory', () => {
    it('should behave correctly based on the OS', () => {
      src = path.join(TEST_DIR, 'srcdir');
      fs.outputFileSync(path.join(src, 'subdir', 'file.txt'), 'some data');
      dest = path.join(TEST_DIR, 'srcDir');
      let errThrown = false;

      try {
        fs.copySync(src, dest);
      } catch (err) {
        if (platform === 'darwin' || platform === 'win32') {
          expect(err.message).toBe(
            'Source and destination must not be the same.',
          );
          errThrown = true;
        }
      }
      if (platform === 'darwin' || platform === 'win32')
        expect(errThrown).toBeTruthy();
      if (platform === 'linux') {
        expect(fs.existsSync(dest)).toBeTruthy();
        expect(
          fs.readFileSync(path.join(dest, 'subdir', 'file.txt'), 'utf8'),
        ).toBe('some data');
        expect(!errThrown).toBeTruthy();
      }
    });
  });

  describe('> when src is a file', () => {
    it('should behave correctly based on the OS', () => {
      src = path.join(TEST_DIR, 'srcfile');
      fs.outputFileSync(src, 'some data');
      dest = path.join(TEST_DIR, 'srcFile');
      let errThrown = false;

      try {
        fs.copySync(src, dest);
      } catch (err) {
        if (platform === 'darwin' || platform === 'win32') {
          expect(err.message).toBe(
            'Source and destination must not be the same.',
          );
          errThrown = true;
        }
      }
      if (platform === 'darwin' || platform === 'win32')
        expect(errThrown).toBeTruthy();
      if (platform === 'linux') {
        expect(fs.existsSync(dest)).toBeTruthy();
        expect(fs.readFileSync(dest, 'utf8')).toBe('some data');
        expect(!errThrown).toBeTruthy();
      }
    });
  });

  describe('> when src is a symlink', () => {
    it('should behave correctly based on the OS, symlink dir', () => {
      src = path.join(TEST_DIR, 'srcdir');
      fs.outputFileSync(path.join(src, 'subdir', 'file.txt'), 'some data');
      const srcLink = path.join(TEST_DIR, 'src-symlink');
      fs.symlinkSync(src, srcLink, 'dir');
      dest = path.join(TEST_DIR, 'src-Symlink');
      let errThrown = false;

      try {
        fs.copySync(srcLink, dest);
      } catch (err) {
        if (platform === 'darwin' || platform === 'win32') {
          expect(err.message).toBe(
            'Source and destination must not be the same.',
          );
          errThrown = true;
        }
      }
      if (platform === 'darwin' || platform === 'win32')
        expect(errThrown).toBeTruthy();
      if (platform === 'linux') {
        expect(fs.existsSync(dest)).toBeTruthy();
        expect(
          fs.readFileSync(path.join(dest, 'subdir', 'file.txt'), 'utf8'),
        ).toBe('some data');
        const destLink = fs.readlinkSync(dest);
        expect(destLink).toBe(src);
        expect(!errThrown).toBeTruthy();
      }
    });

    it('should behave correctly based on the OS, symlink file', () => {
      src = path.join(TEST_DIR, 'srcfile');
      fs.outputFileSync(src, 'some data');
      const srcLink = path.join(TEST_DIR, 'src-symlink');
      fs.symlinkSync(src, srcLink, 'file');
      dest = path.join(TEST_DIR, 'src-Symlink');
      let errThrown = false;

      try {
        fs.copySync(srcLink, dest);
      } catch (err) {
        if (platform === 'darwin' || platform === 'win32') {
          expect(err.message).toBe(
            'Source and destination must not be the same.',
          );
          errThrown = true;
        }
      }
      if (platform === 'darwin' || platform === 'win32')
        expect(errThrown).toBeTruthy();
      if (platform === 'linux') {
        expect(fs.existsSync(dest)).toBeTruthy();
        expect(fs.readFileSync(dest, 'utf8')).toBe('some data');
        const destLink = fs.readlinkSync(dest);
        expect(destLink).toBe(src);
        expect(!errThrown).toBeTruthy();
      }
    });
  });
});
