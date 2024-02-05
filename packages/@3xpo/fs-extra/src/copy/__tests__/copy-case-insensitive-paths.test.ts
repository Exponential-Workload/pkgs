'use strict';

import assert from 'assert';
import * as os from 'os';
import path from 'path';
import fs from '../../';
const platform = os.platform();

/* global beforeEach, afterEach, describe, it */

describe('+ copy() - case insensitive paths', () => {
  let TEST_DIR = '';
  let src = '';
  let dest = '';

  beforeEach(async () => {
    TEST_DIR = path.join(
      os.tmpdir(),
      'fs-extra',
      'copy-case-insensitive-paths',
    );
    return fs.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.remove(TEST_DIR));

  describe('> when src is a directory', () => {
    it('should behave correctly based on the OS', done => {
      src = path.join(TEST_DIR, 'srcdir');
      fs.outputFileSync(path.join(src, 'subdir', 'file.txt'), 'some data');
      dest = path.join(TEST_DIR, 'srcDir');

      fs.copy(src, dest)
        .catch(err => err)
        .then(err => {
          if (platform === 'linux') {
            expect(err).toBeFalsy();
            expect(fs.existsSync(dest)).toBeTruthy();
            expect(
              fs.readFileSync(path.join(dest, 'subdir', 'file.txt'), 'utf8'),
            ).toStrictEqual('some data');
          }
          if (platform === 'darwin' || platform === 'win32') {
            expect(err.message).toStrictEqual(
              'Source and destination must not be the same.',
            );
          }
          done();
        });
    });
  });

  describe('> when src is a file', () => {
    it('should behave correctly based on the OS', done => {
      src = path.join(TEST_DIR, 'srcfile');
      fs.outputFileSync(src, 'some data');
      dest = path.join(TEST_DIR, 'srcFile');

      fs.copy(src, dest)
        .catch(err => err)
        .then(err => {
          if (platform === 'linux') {
            expect(err).toBeFalsy();
            expect(fs.existsSync(dest)).toBeTruthy();
            expect(fs.readFileSync(dest, 'utf8')).toStrictEqual('some data');
          }
          if (platform === 'darwin' || platform === 'win32') {
            expect(err.message).toStrictEqual(
              'Source and destination must not be the same.',
            );
          }
          done();
        });
    });
  });

  describe('> when src is a symlink', () => {
    it('should behave correctly based on the OS, symlink dir', done => {
      src = path.join(TEST_DIR, 'srcdir');
      fs.outputFileSync(path.join(src, 'subdir', 'file.txt'), 'some data');
      const srcLink = path.join(TEST_DIR, 'src-symlink');
      fs.symlinkSync(src, srcLink, 'dir');
      dest = path.join(TEST_DIR, 'src-Symlink');

      fs.copy(srcLink, dest)
        .catch(err => err)
        .then(err => {
          if (platform === 'linux') {
            expect(err).toBeFalsy();
            expect(fs.existsSync(dest)).toBeTruthy();
            expect(
              fs.readFileSync(path.join(dest, 'subdir', 'file.txt'), 'utf8'),
            ).toStrictEqual('some data');
            const destLink = fs.readlinkSync(dest);
            expect(destLink).toStrictEqual(src);
          }
          if (platform === 'darwin' || platform === 'win32') {
            expect(err.message).toStrictEqual(
              'Source and destination must not be the same.',
            );
          }
          done();
        });
    });

    it('should behave correctly based on the OS, symlink file', done => {
      src = path.join(TEST_DIR, 'srcfile');
      fs.outputFileSync(src, 'some data');
      const srcLink = path.join(TEST_DIR, 'src-symlink');
      fs.symlinkSync(src, srcLink, 'file');
      dest = path.join(TEST_DIR, 'src-Symlink');

      fs.copy(srcLink, dest)
        .catch(err => err)
        .then(err => {
          if (platform === 'linux') {
            expect(err).toBeFalsy();
            expect(fs.existsSync(dest)).toBeTruthy();
            expect(fs.readFileSync(dest, 'utf8')).toStrictEqual('some data');
            const destLink = fs.readlinkSync(dest);
            expect(destLink).toStrictEqual(src);
          }
          if (platform === 'darwin' || platform === 'win32') {
            expect(err.message).toStrictEqual(
              'Source and destination must not be the same.',
            );
          }
          done();
        });
    });
  });
});
