'use strict';

import assert from 'assert';
import * as os from 'os';
import path from 'path';
import fs from '../../';
import klawSync from 'klaw-sync';

/* global beforeEach, afterEach, describe, it */

// these files are used for all tests
const FILES = [
  'file0.txt',
  path.join('dir1', 'file1.txt'),
  path.join('dir1', 'dir2', 'file2.txt'),
  path.join('dir1', 'dir2', 'dir3', 'file3.txt'),
];

const dat0 = 'file0';
const dat1 = 'file1';
const dat2 = 'file2';
const dat3 = 'file3';

describe('+ copySync() - prevent copying into itself', () => {
  let TEST_DIR, src;

  beforeEach(async () => {
    TEST_DIR = path.join(
      os.tmpdir(),
      'fs-extra',
      'copy-sync-prevent-copying-into-itself',
    );
    src = path.join(TEST_DIR, 'src');
    fs.mkdirpSync(src);

    fs.outputFileSync(path.join(src, FILES[0]), dat0);
    fs.outputFileSync(path.join(src, FILES[1]), dat1);
    fs.outputFileSync(path.join(src, FILES[2]), dat2);
    fs.outputFileSync(path.join(src, FILES[3]), dat3);
  });

  afterEach(() => fs.remove(TEST_DIR));

  describe('> when source is a file', () => {
    it('should copy the file successfully even if dest parent is a subdir of src', () => {
      const srcFile = path.join(TEST_DIR, 'src', 'srcfile.txt');
      const destFile = path.join(TEST_DIR, 'src', 'dest', 'destfile.txt');
      fs.writeFileSync(srcFile, dat0);

      fs.copySync(srcFile, destFile);

      expect(fs.existsSync(destFile)).toBeTruthy();
      const out = fs.readFileSync(destFile, 'utf8');
      expect(out).toBe(dat0);
    });
  });

  // test for these cases:
  //  - src is directory, dest is directory
  //  - src is directory, dest is symlink
  //  - src is symlink, dest is directory
  //  - src is symlink, dest is symlink

  describe('> when source is a directory', () => {
    describe('>> when dest is a directory', () => {
      it('of not itself', () => {
        const dest = path.join(TEST_DIR, src.replace(/^\w:/, ''));
        return testSuccess(src, dest);
      });
      it('of itself', () => {
        const dest = path.join(src, 'dest');
        return testError(src, dest);
      });
      it("should copy the directory successfully when dest is 'src_dest'", () => {
        const dest = path.join(TEST_DIR, 'src_dest');
        return testSuccess(src, dest);
      });
      it("should copy the directory successfully when dest is 'src-dest'", () => {
        const dest = path.join(TEST_DIR, 'src-dest');
        return testSuccess(src, dest);
      });

      it("should copy the directory successfully when dest is 'dest_src'", () => {
        const dest = path.join(TEST_DIR, 'dest_src');
        return testSuccess(src, dest);
      });

      it("should copy the directory successfully when dest is 'src_dest/src'", () => {
        const dest = path.join(TEST_DIR, 'src_dest', 'src');
        return testSuccess(src, dest);
      });

      it("should copy the directory successfully when dest is 'src-dest/src'", () => {
        const dest = path.join(TEST_DIR, 'src-dest', 'src');
        return testSuccess(src, dest);
      });

      it("should copy the directory successfully when dest is 'dest_src/src'", () => {
        const dest = path.join(TEST_DIR, 'dest_src', 'src');
        return testSuccess(src, dest);
      });

      it("should copy the directory successfully when dest is 'src_src/dest'", () => {
        const dest = path.join(TEST_DIR, 'src_src', 'dest');
        return testSuccess(src, dest);
      });

      it("should copy the directory successfully when dest is 'src-src/dest'", () => {
        const dest = path.join(TEST_DIR, 'src-src', 'dest');
        return testSuccess(src, dest);
      });

      it("should copy the directory successfully when dest is 'srcsrc/dest'", () => {
        const dest = path.join(TEST_DIR, 'srcsrc', 'dest');
        return testSuccess(src, dest);
      });

      it("should copy the directory successfully when dest is 'dest/src'", () => {
        const dest = path.join(TEST_DIR, 'dest', 'src');
        return testSuccess(src, dest);
      });

      it('should copy the directory successfully when dest is very nested that all its parents need to be created', () => {
        const dest = path.join(
          TEST_DIR,
          'dest',
          'src',
          'foo',
          'bar',
          'baz',
          'qux',
          'quux',
          'waldo',
          'grault',
          'garply',
          'fred',
          'plugh',
          'thud',
          'some',
          'highly',
          'deeply',
          'badly',
          'nasty',
          'crazy',
          'mad',
          'nested',
          'dest',
        );
        return testSuccess(src, dest);
      });

      it("should error when dest is 'src/dest'", () => {
        const dest = path.join(TEST_DIR, 'src', 'dest');
        return testError(src, dest);
      });

      it("should error when dest is 'src/src_dest'", () => {
        const dest = path.join(TEST_DIR, 'src', 'src_dest');
        return testError(src, dest);
      });

      it("should error when dest is 'src/dest_src'", () => {
        const dest = path.join(TEST_DIR, 'src', 'dest_src');
        return testError(src, dest);
      });

      it("should error when dest is 'src/dest/src'", () => {
        const dest = path.join(TEST_DIR, 'src', 'dest', 'src');
        return testError(src, dest);
      });
    });

    describe('>> when dest is a symlink', () => {
      it('should error when dest points exactly to src and dereference is true', () => {
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(src).length;
        expect(srclenBefore > 2).toBeTruthy();

        try {
          fs.copySync(src, destLink, { dereference: true });
        } catch (err) {
          expect(err.message).toBe('Source and destination must not be the same.');
        }

        const srclenAfter = klawSync(src).length;
        expect(srclenAfter).toBe(srclenBefore);

        const link = fs.readlinkSync(destLink);
        expect(link).toBe(src);
      });

      it('should error when dest is a subdirectory of src (bind-mounted directory with subdirectory)', () => {
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(src).length;
        expect(srclenBefore > 2).toBeTruthy();

        const dest = path.join(destLink, 'dir1');
        expect(fs.existsSync(dest)).toBeTruthy();
        let errThrown = false;
        try {
          fs.copySync(src, dest);
        } catch (err) {
          expect(err.message).toBe(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
          errThrown = true;
        } finally {
          expect(errThrown).toBeTruthy();
          const srclenAfter = klawSync(src).length;
          expect(srclenAfter).toBe(srclenBefore);

          const link = fs.readlinkSync(destLink);
          expect(link).toBe(src);
        }
      });

      it('should error when dest is a subdirectory of src (more than one level depth)', () => {
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(src).length;
        expect(srclenBefore > 2).toBeTruthy();

        const dest = path.join(destLink, 'dir1', 'dir2');
        expect(fs.existsSync(dest)).toBeTruthy();
        let errThrown = false;
        try {
          fs.copySync(src, dest);
        } catch (err) {
          expect(err.message).toBe(
            `Cannot copy '${src}' to a subdirectory of itself, '${path.join(destLink, 'dir1')}'.`
          );
          errThrown = true;
        } finally {
          expect(errThrown).toBeTruthy();
          const srclenAfter = klawSync(src).length;
          expect(srclenAfter).toBe(srclenBefore);

          const link = fs.readlinkSync(destLink);
          expect(link).toBe(src);
        }
      });

      it('should copy the directory successfully when src is a subdir of resolved dest path and dereferene is true', () => {
        const srcInDest = path.join(TEST_DIR, 'dest', 'some', 'nested', 'src');
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.copySync(src, srcInDest); // put some stuff in srcInDest

        const dest = path.join(TEST_DIR, 'dest');
        fs.symlinkSync(dest, destLink, 'dir');

        const srclen = klawSync(srcInDest).length;
        const destlenBefore = klawSync(dest).length;
        expect(srclen > 2).toBeTruthy();

        fs.copySync(srcInDest, destLink, { dereference: true });

        const destlenAfter = klawSync(dest).length;

        // assert dest length is oldlen + length of stuff copied from src
        expect(destlenAfter).toBe(destlenBefore + srclen);

        FILES.forEach(f =>
          expect(fs.existsSync(path.join(dest, f))).toBeTruthy(),
        );

        const o0 = fs.readFileSync(path.join(dest, FILES[0]), 'utf8');
        const o1 = fs.readFileSync(path.join(dest, FILES[1]), 'utf8');
        const o2 = fs.readFileSync(path.join(dest, FILES[2]), 'utf8');
        const o3 = fs.readFileSync(path.join(dest, FILES[3]), 'utf8');

        expect(o0).toBe(dat0);
        expect(o1).toBe(dat1);
        expect(o2).toBe(dat2);
        expect(o3).toBe(dat3);
      });
    });
  });

  describe('> when source is a symlink', () => {
    describe('>> when dest is a directory', () => {
      it('should error when resolved src path points to dest', () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'src');

        try {
          fs.copySync(srcLink, dest);
        } catch (err) {
          expect(err).toBeTruthy();
        }
        // assert source not affected
        const link = fs.readlinkSync(srcLink);
        expect(link).toBe(src);
      });

      it('should error when dest is a subdir of resolved src path', () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'src', 'some', 'nested', 'dest');
        fs.mkdirsSync(dest);

        try {
          fs.copySync(srcLink, dest);
        } catch (err) {
          expect(err).toBeTruthy();
        }
        const link = fs.readlinkSync(srcLink);
        expect(link).toBe(src);
      });

      it('should error when resolved src path is a subdir of dest', () => {
        const dest = path.join(TEST_DIR, 'dest');

        const resolvedSrcPath = path.join(dest, 'contains', 'src');
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.copySync(src, resolvedSrcPath);

        // make symlink that points to a subdir in dest
        fs.symlinkSync(resolvedSrcPath, srcLink, 'dir');

        try {
          fs.copySync(srcLink, dest);
        } catch (err) {
          expect(err).toBeTruthy();
        }
      });

      it("should copy the directory successfully when dest is 'src_src/dest'", () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'src_src', 'dest');
        testSuccess(srcLink, dest);
        const link = fs.readlinkSync(dest);
        expect(link).toBe(src);
      });

      it("should copy the directory successfully when dest is 'srcsrc/dest'", () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'srcsrc', 'dest');
        testSuccess(srcLink, dest);
        const link = fs.readlinkSync(dest);
        expect(link).toBe(src);
      });
    });

    describe('>> when dest is a symlink', () => {
      it('should error when resolved dest path is exactly the same as resolved src path and dereference is true', () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(srcLink).length;
        const destlenBefore = klawSync(destLink).length;
        expect(srclenBefore > 2).toBeTruthy();
        expect(destlenBefore > 2).toBeTruthy();

        try {
          fs.copySync(srcLink, destLink, { dereference: true });
        } catch (err) {
          expect(err.message).toBe('Source and destination must not be the same.');
        } finally {
          const srclenAfter = klawSync(srcLink).length;
          expect(srclenAfter).toBe(srclenBefore);
          const destlenAfter = klawSync(destLink).length;
          expect(destlenAfter).toBe(destlenBefore);

          const srcln = fs.readlinkSync(srcLink);
          expect(srcln).toBe(src);
          const destln = fs.readlinkSync(destLink);
          expect(destln).toBe(src);
        }
      });

      it('should error when resolved dest path is a subdir of resolved src path', () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const destLink = path.join(TEST_DIR, 'dest-symlink');
        const resolvedDestPath = path.join(
          TEST_DIR,
          'src',
          'some',
          'nested',
          'dest',
        );
        fs.ensureFileSync(
          path.join(resolvedDestPath, 'subdir', 'somefile.txt'),
        );

        fs.symlinkSync(resolvedDestPath, destLink, 'dir');

        try {
          fs.copySync(srcLink, destLink);
        } catch (err) {
          expect(err.message).toBe(`Cannot copy '${src}' to a subdirectory of itself, '${resolvedDestPath}'.`);
        } finally {
          const destln = fs.readlinkSync(destLink);
          expect(destln).toBe(resolvedDestPath);
        }
      });

      it('should error when resolved src path is a subdir of resolved dest path', () => {
        const srcInDest = path.join(TEST_DIR, 'dest', 'some', 'nested', 'src');
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        const destLink = path.join(TEST_DIR, 'dest-symlink');

        const dest = path.join(TEST_DIR, 'dest');

        fs.ensureDirSync(srcInDest);
        fs.ensureSymlinkSync(srcInDest, srcLink, 'dir');
        fs.ensureSymlinkSync(dest, destLink, 'dir');

        try {
          fs.copySync(srcLink, destLink);
        } catch (err) {
          expect(err.message).toBe(`Cannot overwrite '${dest}' with '${srcInDest}'.`);
        } finally {
          const destln = fs.readlinkSync(destLink);
          expect(destln).toBe(dest);
        }
      });
    });
  });
});

function testSuccess(src, dest) {
  const srclen = klawSync(src).length;
  expect(srclen > 2).toBeTruthy();

  fs.copySync(src, dest);

  FILES.forEach(f => expect(fs.existsSync(path.join(dest, f))).toBeTruthy());

  const o0 = fs.readFileSync(path.join(dest, FILES[0]), 'utf8');
  const o1 = fs.readFileSync(path.join(dest, FILES[1]), 'utf8');
  const o2 = fs.readFileSync(path.join(dest, FILES[2]), 'utf8');
  const o3 = fs.readFileSync(path.join(dest, FILES[3]), 'utf8');

  expect(o0).toBe(dat0);
  expect(o1).toBe(dat1);
  expect(o2).toBe(dat2);
  expect(o3).toBe(dat3);
}

function testError(src, dest) {
  try {
    fs.copySync(src, dest);
  } catch (err) {
    expect(err.message).toBe(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
  }
}
