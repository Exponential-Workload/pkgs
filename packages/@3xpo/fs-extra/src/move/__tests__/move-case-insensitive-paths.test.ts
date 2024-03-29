'use strict';

import assert from 'assert';
import * as os from 'os';
import path from 'path';
import fs from '../..';

/* global beforeEach, afterEach, describe, it */

describe('+ move() - case insensitive paths', () => {
  let TEST_DIR = '';
  let src = '';
  let dest = '';

  beforeEach(() => {
    TEST_DIR = path.join(
      os.tmpdir(),
      'fs-extra-test-suite',
      'move-case-insensitive-paths',
    );
    return fs.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.remove(TEST_DIR));

  describe('> when src is a directory', () => {
    it('should move successfully', done => {
      src = path.join(TEST_DIR, 'srcdir');
      fs.outputFileSync(path.join(src, 'subdir', 'file.txt'), 'some data');
      dest = path.join(TEST_DIR, 'srcDir');

      fs.move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          expect(fs.existsSync(dest)).toBeTruthy();
          expect(
            fs.readFileSync(path.join(dest, 'subdir', 'file.txt'), 'utf8'),
          ).toBe('some data');
          done();
        });
    });
  });

  describe('> when src is a file', () => {
    it('should move successfully', done => {
      src = path.join(TEST_DIR, 'srcfile');
      fs.outputFileSync(src, 'some data');
      dest = path.join(TEST_DIR, 'srcFile');

      fs.move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          expect(fs.existsSync(dest)).toBeTruthy();
          expect(fs.readFileSync(dest, 'utf8')).toBe('some data');
          done();
        });
    });
  });

  describe('> when src is a symlink', () => {
    it('should move successfully, symlink dir', done => {
      src = path.join(TEST_DIR, 'srcdir');
      fs.outputFileSync(path.join(src, 'subdir', 'file.txt'), 'some data');
      const srcLink = path.join(TEST_DIR, 'src-symlink');
      fs.symlinkSync(src, srcLink, 'dir');
      dest = path.join(TEST_DIR, 'src-Symlink');

      fs.move(srcLink, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          expect(fs.existsSync(dest)).toBeTruthy();
          expect(
            fs.readFileSync(path.join(dest, 'subdir', 'file.txt'), 'utf8'),
          ).toBe('some data');
          const destLink = fs.readlinkSync(dest);
          expect(destLink).toBe(src);
          done();
        });
    });

    it('should move successfully, symlink file', done => {
      src = path.join(TEST_DIR, 'srcfile');
      fs.outputFileSync(src, 'some data');
      const srcLink = path.join(TEST_DIR, 'src-symlink');
      fs.symlinkSync(src, srcLink, 'file');
      dest = path.join(TEST_DIR, 'src-Symlink');

      fs.move(srcLink, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          expect(fs.existsSync(dest)).toBeTruthy();
          expect(fs.readFileSync(dest, 'utf8')).toBe('some data');
          const destLink = fs.readlinkSync(dest);
          expect(destLink).toBe(src);
          done();
        });
    });
  });
});
