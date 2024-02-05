'use strict';

import fs from '../../';
import * as os from 'os';
import path from 'path';
import assert from 'assert';
import crypto from 'crypto';

/* global beforeEach, afterEach, describe, it */

describe('+ copySync() / dir', () => {
  const SIZE = 16 * 64 * 1024 + 7;
  let TEST_DIR: string;
  let src, dest;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'copy-sync-dir');
    src = path.join(TEST_DIR, 'src');
    dest = path.join(TEST_DIR, 'dest');
    return fs.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.remove(TEST_DIR));

  describe('> when src is a directory', () => {
    describe('> when dest exists and is a file', () => {
      it('should throw error', () => {
        const src = path.join(TEST_DIR, 'src');
        const dest = path.join(TEST_DIR, 'file.txt');
        fs.mkdirSync(src);
        fs.ensureFileSync(dest);

        try {
          fs.copySync(src, dest);
        } catch (err) {
          expect(err.message).toBe(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
      });
    });

    it('should copy the directory synchronously', () => {
      const FILES = 2;

      src = path.join(TEST_DIR, 'src');
      dest = path.join(TEST_DIR, 'dest');

      fs.mkdirSync(src);

      for (let i = 0; i < FILES; ++i) {
        fs.writeFileSync(
          path.join(src, i.toString()),
          crypto.randomBytes(SIZE),
        );
      }

      const subdir = path.join(src, 'subdir');

      fs.mkdirSync(subdir);

      for (let i = 0; i < FILES; ++i) {
        fs.writeFileSync(
          path.join(subdir, i.toString()),
          crypto.randomBytes(SIZE),
        );
      }

      fs.copySync(src, dest);
      expect(fs.existsSync(dest)).toBeTruthy();

      for (let i = 0; i < FILES; ++i) {
        expect(fs.existsSync(path.join(dest, i.toString()))).toBeTruthy();
      }

      const destSub = path.join(dest, 'subdir');
      for (let j = 0; j < FILES; ++j) {
        expect(fs.existsSync(path.join(destSub, j.toString()))).toBeTruthy();
      }
    });

    it('should preserve symbolic links', () => {
      const srcTarget = path.join(TEST_DIR, 'destination');
      fs.mkdirSync(src);
      fs.mkdirSync(srcTarget);
      fs.symlinkSync(srcTarget, path.join(src, 'symlink'), 'dir');

      fs.copySync(src, dest);

      const link = fs.readlinkSync(path.join(dest, 'symlink'));
      expect(link).toBe(srcTarget);
    });

    describe('> when the destination dir does not exist', () => {
      it('should create the destination directory and copy the file', () => {
        const src = path.join(TEST_DIR, 'data/');
        fs.mkdirSync(src);

        const d1 = 'file1';
        const d2 = 'file2';

        fs.writeFileSync(path.join(src, 'f1.txt'), d1);
        fs.writeFileSync(path.join(src, 'f2.txt'), d2);

        const dest = path.join(TEST_DIR, 'this/path/does/not/exist/outputDir');

        fs.copySync(src, dest);

        const o1 = fs.readFileSync(path.join(dest, 'f1.txt'), 'utf8');
        const o2 = fs.readFileSync(path.join(dest, 'f2.txt'), 'utf8');

        expect(d1).toBe(o1);
        expect(d2).toBe(o2);
      });
    });
  });

  describe('> when filter is used', () => {
    it('should do nothing if filter fails', () => {
      const srcDir = path.join(TEST_DIR, 'src');
      const srcFile = path.join(srcDir, 'srcfile.css');
      fs.outputFileSync(srcFile, 'src contents');
      const destDir = path.join(TEST_DIR, 'dest');
      const destFile = path.join(destDir, 'destfile.css');
      const filter = s =>
        path.extname(s) !== '.css' && !fs.statSync(s).isDirectory();

      fs.copySync(srcFile, destFile, filter);
      expect(!fs.existsSync(destDir)).toBeTruthy();
    });

    it('should apply filter recursively', () => {
      const FILES = 2;
      // Don't match anything that ends with a digit higher than 0:
      const filter = s => /(0|\D)$/i.test(s);

      fs.mkdirSync(src);

      for (let i = 0; i < FILES; ++i) {
        fs.writeFileSync(
          path.join(src, i.toString()),
          crypto.randomBytes(SIZE),
        );
      }

      const subdir = path.join(src, 'subdir');
      fs.mkdirSync(subdir);

      for (let i = 0; i < FILES; ++i) {
        fs.writeFileSync(
          path.join(subdir, i.toString()),
          crypto.randomBytes(SIZE),
        );
      }

      fs.copySync(src, dest, filter);

      expect(fs.existsSync(dest)).toBeTruthy();
      expect(FILES > 1).toBeTruthy();

      for (let i = 0; i < FILES; ++i) {
        if (i === 0) {
          expect(fs.existsSync(path.join(dest, i.toString()))).toBeTruthy();
        } else {
          expect(!fs.existsSync(path.join(dest, i.toString()))).toBeTruthy();
        }
      }

      const destSub = path.join(dest, 'subdir');

      for (let j = 0; j < FILES; ++j) {
        if (j === 0) {
          expect(fs.existsSync(path.join(destSub, j.toString()))).toBeTruthy();
        } else {
          expect(!fs.existsSync(path.join(destSub, j.toString()))).toBeTruthy();
        }
      }
    });

    it('should apply the filter to directory names', () => {
      const IGNORE = 'ignore';
      const filter = p => !~p.indexOf(IGNORE);

      fs.mkdirSync(src);

      const ignoreDir = path.join(src, IGNORE);
      fs.mkdirSync(ignoreDir);

      fs.writeFileSync(path.join(ignoreDir, 'file'), crypto.randomBytes(SIZE));

      fs.copySync(src, dest, filter);

      expect(!fs.existsSync(path.join(dest, IGNORE))).toBeTruthy();
      expect(!fs.existsSync(path.join(dest, IGNORE, 'file'))).toBeTruthy();
    });

    it('should apply filter when it is applied only to dest', done => {
      const timeCond = new Date().getTime();

      const filter = (s, d) => fs.statSync(d).mtime.getTime() < timeCond;

      const dest = path.join(TEST_DIR, 'dest');

      setTimeout(() => {
        fs.outputFileSync(path.join(src, 'somefile.html'), 'some data');
        fs.mkdirSync(dest);
        fs.copySync(src, dest, filter);
        expect(!fs.existsSync(path.join(dest, 'somefile.html'))).toBeTruthy();
        done();
      }, 1000);
    });

    it('should apply filter when it is applied to both src and dest', done => {
      const timeCond = new Date().getTime();
      const filter = (s, d) =>
        s.split('.').pop() !== 'css' &&
        fs.statSync(path.dirname(d)).mtime.getTime() > timeCond;

      const dest = path.join(TEST_DIR, 'dest');

      setTimeout(() => {
        const srcFile1 = path.join(TEST_DIR, '1.html');
        const srcFile2 = path.join(TEST_DIR, '2.css');
        const srcFile3 = path.join(TEST_DIR, '3.jade');

        fs.writeFileSync(srcFile1, '');
        fs.writeFileSync(srcFile2, '');
        fs.writeFileSync(srcFile3, '');

        const destFile1 = path.join(dest, 'dest1.html');
        const destFile2 = path.join(dest, 'dest2.css');
        const destFile3 = path.join(dest, 'dest3.jade');

        fs.mkdirSync(dest);

        fs.copySync(srcFile1, destFile1, filter);
        fs.copySync(srcFile2, destFile2, filter);
        fs.copySync(srcFile3, destFile3, filter);

        expect(fs.existsSync(destFile1)).toBeTruthy();
        expect(!fs.existsSync(destFile2)).toBeTruthy();
        expect(fs.existsSync(destFile3)).toBeTruthy();
        done();
      }, 1000);
    });
  });
});
