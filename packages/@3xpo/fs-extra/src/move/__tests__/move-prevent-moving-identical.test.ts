'use strict';

import assert from 'assert';
import * as os from 'os';
import path from 'path';
import fs from '../..';
import klawSync from 'klaw-sync';

/* global beforeEach, afterEach, describe, it */

describe('+ move() - prevent moving identical files and dirs', () => {
  let TEST_DIR = '';
  let src = '';
  let dest = '';

  beforeEach(() => {
    TEST_DIR = path.join(
      os.tmpdir(),
      'fs-extra',
      'move-prevent-moving-identical',
    );
    return fs.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.remove(TEST_DIR));

  it('should return an error if src and dest are the same', done => {
    const fileSrc = path.join(TEST_DIR, 'TEST_fs-extra_move');
    const fileDest = path.join(TEST_DIR, 'TEST_fs-extra_move');
    fs.ensureFileSync(fileSrc);

    fs.move(fileSrc, fileDest)
      .catch(err => err)
      .then(err => {
        expect(err.message).toBe('Source and destination must not be the same.');
        done();
      });
  });

  describe('dest with parent symlink', () => {
    describe('first parent is symlink', () => {
      it('should error when src is file', done => {
        const src = path.join(TEST_DIR, 'a', 'file.txt');
        const dest = path.join(TEST_DIR, 'b', 'file.txt');
        const srcParent = path.join(TEST_DIR, 'a');
        const destParent = path.join(TEST_DIR, 'b');
        fs.ensureFileSync(src);
        fs.ensureSymlinkSync(srcParent, destParent, 'dir');

        fs.move(src, dest)
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe('Source and destination must not be the same.');
            expect(fs.existsSync(src)).toBeTruthy();
            done();
          });
      });

      it('should error when src is directory', done => {
        const src = path.join(TEST_DIR, 'a', 'foo');
        const dest = path.join(TEST_DIR, 'b', 'foo');
        const srcParent = path.join(TEST_DIR, 'a');
        const destParent = path.join(TEST_DIR, 'b');
        fs.ensureDirSync(src);
        fs.ensureSymlinkSync(srcParent, destParent, 'dir');

        fs.move(src, dest)
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe('Source and destination must not be the same.');
            expect(fs.existsSync(src)).toBeTruthy();
            done();
          });
      });
    });

    describe('nested dest', () => {
      it('should error when src is file', done => {
        const src = path.join(TEST_DIR, 'a', 'dir', 'file.txt');
        const dest = path.join(TEST_DIR, 'b', 'dir', 'file.txt');
        const srcParent = path.join(TEST_DIR, 'a');
        const destParent = path.join(TEST_DIR, 'b');
        fs.ensureFileSync(src);
        fs.ensureSymlinkSync(srcParent, destParent, 'dir');

        fs.move(src, dest)
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe('Source and destination must not be the same.');
            expect(fs.existsSync(src)).toBeTruthy();
            done();
          });
      });

      it('should error when src is directory', done => {
        const src = path.join(TEST_DIR, 'a', 'dir', 'foo');
        const dest = path.join(TEST_DIR, 'b', 'dir', 'foo');
        const srcParent = path.join(TEST_DIR, 'a');
        const destParent = path.join(TEST_DIR, 'b');
        fs.ensureDirSync(src);
        fs.ensureSymlinkSync(srcParent, destParent, 'dir');

        fs.move(src, dest)
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe('Source and destination must not be the same.');
            expect(fs.existsSync(src)).toBeTruthy();
            done();
          });
      });
    });
  });

  // src is directory:
  //  src is regular, dest is symlink
  //  src is symlink, dest is regular
  //  src is symlink, dest is symlink

  describe('> when src is a directory', () => {
    describe('>> when src is regular and dest is a symlink that points to src', () => {
      it('should error if dereference is true', done => {
        src = path.join(TEST_DIR, 'src');
        fs.mkdirsSync(src);
        const subdir = path.join(TEST_DIR, 'src', 'subdir');
        fs.mkdirsSync(subdir);
        fs.writeFileSync(path.join(subdir, 'file.txt'), 'some data');

        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const oldlen = klawSync(src).length;

        fs.move(src, destLink, { dereference: true })
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe('Source and destination must not be the same.');

            const newlen = klawSync(src).length;
            expect(newlen).toBe(oldlen);
            const link = fs.readlinkSync(destLink);
            expect(link).toBe(src);
            done();
          });
      });
    });

    describe('>> when src is a symlink that points to a regular dest', () => {
      it('should throw error', done => {
        dest = path.join(TEST_DIR, 'dest');
        fs.mkdirsSync(dest);
        const subdir = path.join(TEST_DIR, 'dest', 'subdir');
        fs.mkdirsSync(subdir);
        fs.writeFileSync(path.join(subdir, 'file.txt'), 'some data');

        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(dest, srcLink, 'dir');

        const oldlen = klawSync(dest).length;

        fs.move(srcLink, dest)
          .catch(err => err)
          .then(err => {
            expect(err).toBeTruthy();

            // assert nothing copied
            const newlen = klawSync(dest).length;
            expect(newlen).toBe(oldlen);
            const link = fs.readlinkSync(srcLink);
            expect(link).toBe(dest);
            done();
          });
      });
    });

    describe('>> when src and dest are symlinks that point to the exact same path', () => {
      it('should error src and dest are the same and dereference is true', done => {
        src = path.join(TEST_DIR, 'src');
        fs.mkdirsSync(src);
        const srcLink = path.join(TEST_DIR, 'src_symlink');
        fs.symlinkSync(src, srcLink, 'dir');
        const destLink = path.join(TEST_DIR, 'dest_symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(srcLink).length;
        const destlenBefore = klawSync(destLink).length;

        fs.move(srcLink, destLink, { dereference: true })
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe('Source and destination must not be the same.');

            const srclenAfter = klawSync(srcLink).length;
            expect(srclenAfter).toBe(srclenBefore);
            const destlenAfter = klawSync(destLink).length;
            expect(destlenAfter).toBe(destlenBefore);

            const srcln = fs.readlinkSync(srcLink);
            expect(srcln).toBe(src);
            const destln = fs.readlinkSync(destLink);
            expect(destln).toBe(src);
            done();
          });
      });
    });
  });

  // src is file:
  //  src is regular, dest is symlink
  //  src is symlink, dest is regular
  //  src is symlink, dest is symlink

  describe('> when src is a file', () => {
    describe('>> when src is regular and dest is a symlink that points to src', () => {
      it('should error if dereference is true', done => {
        src = path.join(TEST_DIR, 'src.txt');
        fs.outputFileSync(src, 'some data');

        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'file');

        fs.move(src, destLink, { dereference: true })
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe('Source and destination must not be the same.');
            done();
          });
      });
    });

    describe('>> when src is a symlink that points to a regular dest', () => {
      it('should throw error if dereferene is true', done => {
        dest = path.join(TEST_DIR, 'dest', 'somefile.txt');
        fs.outputFileSync(dest, 'some data');

        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(dest, srcLink, 'file');

        fs.move(srcLink, dest, { dereference: true })
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe('Source and destination must not be the same.');

            const link = fs.readlinkSync(srcLink);
            expect(link).toBe(dest);
            expect(fs.readFileSync(link, 'utf8')).toBeTruthy();
            done();
          });
      });
    });

    describe('>> when src and dest are symlinks that point to the exact same path', () => {
      it('should error src and dest are the same and dereferene is true', done => {
        src = path.join(TEST_DIR, 'src', 'srcfile.txt');
        fs.outputFileSync(src, 'src data');

        const srcLink = path.join(TEST_DIR, 'src_symlink');
        fs.symlinkSync(src, srcLink, 'file');

        const destLink = path.join(TEST_DIR, 'dest_symlink');
        fs.symlinkSync(src, destLink, 'file');

        fs.move(srcLink, destLink, { dereference: true })
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe('Source and destination must not be the same.');

            const srcln = fs.readlinkSync(srcLink);
            expect(srcln).toBe(src);
            const destln = fs.readlinkSync(destLink);
            expect(destln).toBe(src);
            expect(fs.readFileSync(srcln, 'utf8')).toBeTruthy();
            expect(fs.readFileSync(destln, 'utf8')).toBeTruthy();
            done();
          });
      });
    });
  });
});
