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

describe('+ copy() - prevent copying into itself', () => {
  let TEST_DIR, src;

  beforeEach(async () => {
    TEST_DIR = path.join(
      os.tmpdir(),
      'fs-extra-test-suite',
      'copy-prevent-copying-into-itself',
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
    it('should copy the file successfully even if dest parent is a subdir of src', done => {
      const srcFile = path.join(TEST_DIR, 'src', 'srcfile.txt');
      const destFile = path.join(TEST_DIR, 'src', 'dest', 'destfile.txt');
      fs.writeFileSync(srcFile, dat0);

      fs.copy(srcFile, destFile)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();

          expect(fs.existsSync(destFile)).toBeTruthy();
          const out = fs.readFileSync(destFile, 'utf8');
          expect(out).toBe(dat0);
          done();
        });
    });
  });

  // test for these cases:
  //  - src is directory, dest is directory
  //  - src is directory, dest is symlink
  //  - src is symlink, dest is directory
  //  - src is symlink, dest is symlink

  describe('> when source is a directory', () => {
    describe('>> when dest is a directory', () => {
      it('of not itself', done => {
        const dest = path.join(TEST_DIR, src.replace(/^\w:/, ''));
        return testSuccess(src, dest, done);
      });
      it('of itself', done => {
        const dest = path.join(src, 'dest');
        return testError(src, dest, done);
      });
      it("should copy the directory successfully when dest is 'src_dest'", done => {
        const dest = path.join(TEST_DIR, 'src_dest');
        return testSuccess(src, dest, done);
      });
      it("should copy the directory successfully when dest is 'src-dest'", done => {
        const dest = path.join(TEST_DIR, 'src-dest');
        return testSuccess(src, dest, done);
      });

      it("should copy the directory successfully when dest is 'dest_src'", done => {
        const dest = path.join(TEST_DIR, 'dest_src');
        return testSuccess(src, dest, done);
      });

      it("should copy the directory successfully when dest is 'src_dest/src'", done => {
        const dest = path.join(TEST_DIR, 'src_dest', 'src');
        return testSuccess(src, dest, done);
      });

      it("should copy the directory successfully when dest is 'src-dest/src'", done => {
        const dest = path.join(TEST_DIR, 'src-dest', 'src');
        return testSuccess(src, dest, done);
      });

      it("should copy the directory successfully when dest is 'dest_src/src'", done => {
        const dest = path.join(TEST_DIR, 'dest_src', 'src');
        return testSuccess(src, dest, done);
      });

      it("should copy the directory successfully when dest is 'src_src/dest'", done => {
        const dest = path.join(TEST_DIR, 'src_src', 'dest');
        return testSuccess(src, dest, done);
      });

      it("should copy the directory successfully when dest is 'src-src/dest'", done => {
        const dest = path.join(TEST_DIR, 'src-src', 'dest');
        return testSuccess(src, dest, done);
      });

      it("should copy the directory successfully when dest is 'srcsrc/dest'", done => {
        const dest = path.join(TEST_DIR, 'srcsrc', 'dest');
        return testSuccess(src, dest, done);
      });

      it("should copy the directory successfully when dest is 'dest/src'", done => {
        const dest = path.join(TEST_DIR, 'dest', 'src');
        return testSuccess(src, dest, done);
      });

      it('should copy the directory successfully when dest is very nested that all its parents need to be created', done => {
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
        return testSuccess(src, dest, done);
      });

      it("should error when dest is 'src/dest'", done => {
        const dest = path.join(TEST_DIR, 'src', 'dest');
        return testError(src, dest, done);
      });

      it("should error when dest is 'src/src_dest'", done => {
        const dest = path.join(TEST_DIR, 'src', 'src_dest');
        return testError(src, dest, done);
      });

      it("should error when dest is 'src/dest_src'", done => {
        const dest = path.join(TEST_DIR, 'src', 'dest_src');
        return testError(src, dest, done);
      });

      it("should error when dest is 'src/dest/src'", done => {
        const dest = path.join(TEST_DIR, 'src', 'dest', 'src');
        return testError(src, dest, done);
      });
    });

    describe('>> when dest is a symlink', () => {
      it('should error when dest points exactly to src and dereference is true', done => {
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(src).length;
        expect(srclenBefore > 2).toBeTruthy();

        fs.copy(src, destLink, { dereference: true })
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe(
              'Source and destination must not be the same.',
            );

            const srclenAfter = klawSync(src).length;
            expect(srclenAfter).toBe(srclenBefore);

            const link = fs.readlinkSync(destLink);
            expect(link).toBe(src);
            done();
          });
      });

      it('should error when dest is a subdirectory of src (bind-mounted directory with subdirectory)', done => {
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(src).length;
        expect(srclenBefore > 2).toBeTruthy();

        const dest = path.join(destLink, 'dir1');
        expect(fs.existsSync(dest)).toBeTruthy();
        fs.copy(src, dest)
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe(
              `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`,
            );

            const srclenAfter = klawSync(src).length;
            expect(srclenAfter).toBe(srclenBefore);

            const link = fs.readlinkSync(destLink);
            expect(link).toBe(src);
            done();
          });
      });

      it('should error when dest is a subdirectory of src (more than one level depth)', done => {
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(src).length;
        expect(srclenBefore > 2).toBeTruthy();

        const dest = path.join(destLink, 'dir1', 'dir2');
        expect(fs.existsSync(dest)).toBeTruthy();
        fs.copy(src, dest)
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe(
              `Cannot copy '${src}' to a subdirectory of itself, '${path.join(destLink, 'dir1')}'.`,
            );

            const srclenAfter = klawSync(src).length;
            expect(srclenAfter).toBe(srclenBefore);

            const link = fs.readlinkSync(destLink);
            expect(link).toBe(src);
            done();
          });
      });

      it('should copy the directory successfully when src is a subdir of resolved dest path and dereference is true', done => {
        const srcInDest = path.join(TEST_DIR, 'dest', 'some', 'nested', 'src');
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.copySync(src, srcInDest); // put some stuff in srcInDest

        const dest = path.join(TEST_DIR, 'dest');
        fs.symlinkSync(dest, destLink, 'dir');

        const srclen = klawSync(srcInDest).length;
        const destlenBefore = klawSync(dest).length;

        expect(srclen > 2).toBeTruthy();
        fs.copy(srcInDest, destLink, { dereference: true })
          .catch(err => err)
          .then(err => {
            expect(err).toBeFalsy();

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
            done();
          });
      });
    });
  });

  describe('> when source is a symlink', () => {
    describe('>> when dest is a directory', () => {
      it('should error when resolved src path points to dest', done => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'src');

        fs.copy(srcLink, dest)
          .catch(err => err)
          .then(err => {
            expect(err).toBeTruthy();
            // assert source not affected
            const link = fs.readlinkSync(srcLink);
            expect(link).toBe(src);
            done();
          });
      });

      it('should error when dest is a subdir of resolved src path', done => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'src', 'some', 'nested', 'dest');
        fs.mkdirsSync(dest);

        fs.copy(srcLink, dest)
          .catch(err => err)
          .then(err => {
            expect(err).toBeTruthy();
            const link = fs.readlinkSync(srcLink);
            expect(link).toBe(src);
            done();
          });
      });

      it('should error when resolved src path is a subdir of dest', done => {
        const dest = path.join(TEST_DIR, 'dest');

        const resolvedSrcPath = path.join(dest, 'contains', 'src');
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.copySync(src, resolvedSrcPath);

        // make symlink that points to a subdir in dest
        fs.symlinkSync(resolvedSrcPath, srcLink, 'dir');

        fs.copy(srcLink, dest)
          .catch(err => err)
          .then(err => {
            expect(err).toBeTruthy();
            done();
          });
      });

      it("should copy the directory successfully when dest is 'src_src/dest'", done => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'src_src', 'dest');
        testSuccess(srcLink, dest, () => {
          const link = fs.readlinkSync(dest);
          expect(link).toBe(src);
          done();
        });
      });

      it("should copy the directory successfully when dest is 'srcsrc/dest'", done => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');

        const dest = path.join(TEST_DIR, 'srcsrc', 'dest');
        testSuccess(srcLink, dest, () => {
          const link = fs.readlinkSync(dest);
          expect(link).toBe(src);
          done();
        });
      });
    });

    describe('>> when dest is a symlink', () => {
      it('should error when resolved dest path is exactly the same as resolved src path and dereference is true', done => {
        const srcLink = path.join(TEST_DIR, 'src-symlink');
        fs.symlinkSync(src, srcLink, 'dir');
        const destLink = path.join(TEST_DIR, 'dest-symlink');
        fs.symlinkSync(src, destLink, 'dir');

        const srclenBefore = klawSync(srcLink).length;
        const destlenBefore = klawSync(destLink).length;
        expect(srclenBefore > 2).toBeTruthy();
        expect(destlenBefore > 2).toBeTruthy();

        fs.copy(srcLink, destLink, { dereference: true })
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe(
              'Source and destination must not be the same.',
            );

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

      it('should error when resolved dest path is a subdir of resolved src path', done => {
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

        fs.copy(srcLink, destLink)
          .catch(err => err)
          .then(err => {
            expect(err.message).toBe(
              `Cannot copy '${src}' to a subdirectory of itself, '${resolvedDestPath}'.`,
            );
            const destln = fs.readlinkSync(destLink);
            expect(destln).toBe(resolvedDestPath);
            done();
          });
      });
    });
  });
});

function testSuccess(src, dest, done) {
  const srclen = klawSync(src).length;
  expect(srclen > 2).toBeTruthy();
  fs.copy(src, dest)
    .catch(err => err)
    .then(err => {
      expect(err).toBeFalsy();

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
      done();
    });
}

function testError(src, dest, done) {
  fs.copy(src, dest)
    .catch(err => err)
    .then(err => {
      expect(err.message).toBe(
        `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`,
      );
      done();
    });
}
