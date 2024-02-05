'use strict';

import assert from 'assert';
import * as os from 'os';
import path from 'path';
import fs from '../..';
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

describe('+ moveSync() - prevent moving into itself', () => {
  let TEST_DIR: string, src: string;

  beforeEach(() => {
    TEST_DIR = path.join(
      os.tmpdir(),
      'fs-extra-test-suite',
      'move-sync-prevent-moving-into-itself',
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
    it('should move the file successfully even if dest parent is a subdir of src', () => {
      const srcFile = path.join(TEST_DIR, 'src', 'srcfile.txt');
      const destFile = path.join(TEST_DIR, 'src', 'dest', 'destfile.txt');
      fs.writeFileSync(srcFile, dat0);

      fs.moveSync(srcFile, destFile);

      expect(fs.existsSync(destFile)).toBeTruthy();
      const out = fs.readFileSync(destFile, 'utf8');
      expect(out).toBe(dat0);
    });
  });

  describe('> when source is a file', () => {
    it("should move the file successfully even when dest parent is 'src/dest'", () => {
      const destFile = path.join(TEST_DIR, 'src', 'dest', 'destfile.txt');
      return testSuccessFile(src, destFile);
    });

    it("should move the file successfully when dest parent is 'src/src_dest'", () => {
      const destFile = path.join(TEST_DIR, 'src', 'src_dest', 'destfile.txt');
      return testSuccessFile(src, destFile);
    });

    it("should move the file successfully when dest parent is 'src/dest_src'", () => {
      const destFile = path.join(TEST_DIR, 'src', 'dest_src', 'destfile.txt');
      return testSuccessFile(src, destFile);
    });

    it("should move the file successfully when dest parent is 'src/dest/src'", () => {
      const destFile = path.join(
        TEST_DIR,
        'src',
        'dest',
        'src',
        'destfile.txt',
      );
      return testSuccessFile(src, destFile);
    });

    it("should move the file successfully when dest parent is 'srcsrc/dest'", () => {
      const destFile = path.join(TEST_DIR, 'srcsrc', 'dest', 'destfile.txt');
      return testSuccessFile(src, destFile);
    });
  });

  describe('> when source is a directory', () => {
    describe('>> when dest is a directory', () => {
      it('of not itself', () => {
        const dest = path.join(TEST_DIR, src.replace(/^\w:/, ''));
        return testSuccessDir(src, dest);
      });
      it('of itself', () => {
        const dest = path.join(src, 'dest');
        return testError(src, dest);
      });
      it("should move the directory successfully when dest is 'src_dest'", () => {
        const dest = path.join(TEST_DIR, 'src_dest');
        return testSuccessDir(src, dest);
      });
      it("should move the directory successfully when dest is 'src-dest'", () => {
        const dest = path.join(TEST_DIR, 'src-dest');
        return testSuccessDir(src, dest);
      });

      it("should move the directory successfully when dest is 'dest_src'", () => {
        const dest = path.join(TEST_DIR, 'dest_src');
        return testSuccessDir(src, dest);
      });

      it("should move the directory successfully when dest is 'src_dest/src'", () => {
        const dest = path.join(TEST_DIR, 'src_dest', 'src');
        return testSuccessDir(src, dest);
      });

      it("should move the directory successfully when dest is 'src-dest/src'", () => {
        const dest = path.join(TEST_DIR, 'src-dest', 'src');
        return testSuccessDir(src, dest);
      });

      it("should move the directory successfully when dest is 'dest_src/src'", () => {
        const dest = path.join(TEST_DIR, 'dest_src', 'src');
        return testSuccessDir(src, dest);
      });

      it("should move the directory successfully when dest is 'src_src/dest'", () => {
        const dest = path.join(TEST_DIR, 'src_src', 'dest');
        return testSuccessDir(src, dest);
      });

      it("should move the directory successfully when dest is 'src-src/dest'", () => {
        const dest = path.join(TEST_DIR, 'src-src', 'dest');
        return testSuccessDir(src, dest);
      });

      it("should move the directory successfully when dest is 'srcsrc/dest'", () => {
        const dest = path.join(TEST_DIR, 'srcsrc', 'dest');
        return testSuccessDir(src, dest);
      });

      it("should move the directory successfully when dest is 'dest/src'", () => {
        const dest = path.join(TEST_DIR, 'dest', 'src');
        return testSuccessDir(src, dest);
      });

      it('should move the directory successfully when dest is very nested that all its parents need to be created', () => {
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
        return testSuccessDir(src, dest);
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
        let errThrown = false;
        try {
          fs.moveSync(src, destLink, { dereference: true });
        } catch (err) {
          expect(err.message).toBe(
            'Source and destination must not be the same.',
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

      it('should error when dest is a subdirectory of src (bind-mounted directory with subdirectory)', () => {
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(src).length;
        expect(srclenBefore > 2).toBeTruthy();

        const dest = path.join(destLink, 'dir1');
        expect(fs.existsSync(dest)).toBeTruthy();
        let errThrown = false;
        try {
          fs.moveSync(src, dest);
        } catch (err) {
          expect(err.message).toBe(
            `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`,
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

      it('should error when dest is a subdirectory of src (more than one level depth)', () => {
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(src).length;
        expect(srclenBefore > 2).toBeTruthy();

        const dest = path.join(destLink, 'dir1', 'dir2');
        expect(fs.existsSync(dest)).toBeTruthy();
        let errThrown = false;
        try {
          fs.moveSync(src, dest);
        } catch (err) {
          expect(err.message).toBe(
            `Cannot move '${src}' to a subdirectory of itself, '${path.join(destLink, 'dir1')}'.`,
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
    });
  });

  describe('> when source is a symlink', () => {
    describe('>> when dest is a directory', () => {
      it('should error when resolved src path points to dest', () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'src');
        let errThrown = false;
        try {
          fs.moveSync(srcLink, dest);
        } catch (err) {
          expect(err).toBeTruthy();
          errThrown = true;
        } finally {
          expect(errThrown).toBeTruthy();
          // assert source not affected
          const link = fs.readlinkSync(srcLink);
          expect(link).toBe(src);
        }
      });

      it('should error when dest is a subdir of resolved src path', () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'src', 'some', 'nested', 'dest');
        fs.mkdirsSync(dest);
        let errThrown = false;
        try {
          fs.moveSync(srcLink, dest);
        } catch (err) {
          expect(err).toBeTruthy();
          errThrown = true;
        } finally {
          expect(errThrown).toBeTruthy();
          const link = fs.readlinkSync(srcLink);
          expect(link).toBe(src);
        }
      });

      it('should error when resolved src path is a subdir of dest', () => {
        const dest = path.join(TEST_DIR, 'dest');

        const resolvedSrcPath = path.join(dest, 'contains', 'src');
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.copySync(src, resolvedSrcPath);

        // make symlink that points to a subdir in dest
        fs.symlinkSync(resolvedSrcPath, srcLink, 'dir');

        let errThrown = false;
        try {
          fs.moveSync(srcLink, dest);
        } catch (err) {
          expect(err).toBeTruthy();
          errThrown = true;
        } finally {
          expect(errThrown).toBeTruthy();
        }
      });

      it("should move the directory successfully when dest is 'src_src/dest'", () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'src_src', 'dest');
        testSuccessDir(srcLink, dest);
        const link = fs.readlinkSync(dest);
        expect(link).toBe(src);
      });

      it("should move the directory successfully when dest is 'srcsrc/dest'", () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'srcsrc', 'dest');
        testSuccessDir(srcLink, dest);
        const link = fs.readlinkSync(dest);
        expect(link).toBe(src);
      });
    });

    describe('>> when dest is a symlink', () => {
      it('should error when resolved dest path is exactly the same as resolved src path and dereferene is true', () => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(srcLink).length;
        const destlenBefore = klawSync(destLink).length;
        expect(srclenBefore > 2).toBeTruthy();
        expect(destlenBefore > 2).toBeTruthy();
        let errThrown = false;
        try {
          fs.moveSync(srcLink, destLink, { dereference: true });
        } catch (err) {
          expect(err.message).toBe(
            'Source and destination must not be the same.',
          );
          errThrown = true;
        } finally {
          expect(errThrown).toBeTruthy();
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
    });
  });
});

function testSuccessFile(src, destFile) {
  const srcFile = path.join(src, FILES[0]);

  fs.moveSync(srcFile, destFile);
  const f0 = fs.readFileSync(destFile, 'utf8');
  expect(f0).toBe(dat0);
  expect(!fs.existsSync(srcFile)).toBeTruthy();
}

function testSuccessDir(src, dest) {
  const srclen = klawSync(src).length;

  expect(srclen > 2).toBeTruthy(); // assert src has contents

  fs.moveSync(src, dest);
  const destlen = klawSync(dest).length;

  expect(destlen).toBe(srclen);

  const f0 = fs.readFileSync(path.join(dest, FILES[0]), 'utf8');
  const f1 = fs.readFileSync(path.join(dest, FILES[1]), 'utf8');
  const f2 = fs.readFileSync(path.join(dest, FILES[2]), 'utf8');
  const f3 = fs.readFileSync(path.join(dest, FILES[3]), 'utf8');

  expect(f0).toBe(dat0);
  expect(f1).toBe(dat1);
  expect(f2).toBe(dat2);
  expect(f3).toBe(dat3);
  expect(!fs.existsSync(src)).toBeTruthy();
}

function testError(src, dest) {
  let errThrown = false;
  try {
    fs.moveSync(src, dest);
  } catch (err) {
    expect(err.message).toBe(
      `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`,
    );
    expect(fs.existsSync(src)).toBeTruthy();
    expect(!fs.existsSync(dest)).toBeTruthy();
    errThrown = true;
  } finally {
    expect(errThrown).toBeTruthy();
  }
}
