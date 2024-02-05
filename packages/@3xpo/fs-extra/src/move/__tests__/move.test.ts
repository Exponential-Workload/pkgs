'use strict';

import * as fs from '../../fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';
import { differentDevice, ifCrossDeviceEnabled } from './cross-device-utils';

/* global afterEach, beforeEach, describe, it */

const describeIfWindows =
  process.platform === 'win32' ? describe : describe.skip;

function createAsyncErrFn(errCode) {
  async function fn() {
    fn.callCount++;
    const err = new Error() as any;
    err.code = errCode;

    return Promise.reject(err);
  }
  fn.callCount = 0;
  return fn;
}

const originalRename = fs.rename;

function setUpMockFs(errCode) {
  (fs as any).rename = createAsyncErrFn(errCode);
}

function tearDownMockFs() {
  (fs as any).rename = originalRename;
}

describe('+ move()', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'move');

    fse.emptyDirSync(TEST_DIR);

    // Create fixtures:
    fs.writeFileSync(path.join(TEST_DIR, 'a-file'), 'sonic the hedgehog\n');
    fs.mkdirSync(path.join(TEST_DIR, 'a-folder'));
    fs.writeFileSync(path.join(TEST_DIR, 'a-folder/another-file'), 'tails\n');
    fs.mkdirSync(path.join(TEST_DIR, 'a-folder/another-folder'));
    fs.writeFileSync(
      path.join(TEST_DIR, 'a-folder/another-folder/file3'),
      'knuckles\n',
    );
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('> when overwrite = true', () => {
    it('should overwrite file', done => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = path.join(TEST_DIR, 'a-folder', 'another-file');

      // verify file exists already
      expect(fs.existsSync(dest)).toBeTruthy();

      fse
        .move(src, dest, { overwrite: true })
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          fs.readFile(dest, 'utf8', (err, contents) => {
            const expected = /^sonic the hedgehog\r?\n$/;
            expect(err).toBeFalsy();
            expect(contents.match(expected)).toBeTruthy();
            done();
          });
        });
    });

    it('should overwrite the destination directory', done => {
      // Create src
      const src = path.join(TEST_DIR, 'src');
      fse.ensureDirSync(src);
      fse.mkdirsSync(path.join(src, 'some-folder'));
      fs.writeFileSync(path.join(src, 'some-file'), 'hi');

      const dest = path.join(TEST_DIR, 'a-folder');

      // verify dest has stuff in it
      const paths = fs.readdirSync(dest);
      expect(paths.indexOf('another-file') >= 0).toBeTruthy();
      expect(paths.indexOf('another-folder') >= 0).toBeTruthy();

      fse
        .move(src, dest, { overwrite: true })
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();

          // verify dest does not have old stuff
          const paths = fs.readdirSync(dest);
          expect(paths.indexOf('another-file')).toBe(-1);
          expect(paths.indexOf('another-folder')).toBe(-1);

          // verify dest has new stuff
          expect(paths.indexOf('some-file') >= 0).toBeTruthy();
          expect(paths.indexOf('some-folder') >= 0).toBeTruthy();

          done();
        });
    });

    it('should overwrite folders across devices', done => {
      const src = path.join(TEST_DIR, 'a-folder');
      const dest = path.join(TEST_DIR, 'a-folder-dest');

      fs.mkdirSync(dest);

      setUpMockFs('EXDEV');

      fse
        .move(src, dest, { overwrite: true })
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();

          fs.readFile(
            path.join(dest, 'another-folder', 'file3'),
            'utf8',
            (err, contents) => {
              const expected = /^knuckles\r?\n$/;
              expect(err).toBeFalsy();
              expect(contents.match(expected)).toBeTruthy();
              tearDownMockFs();
              done();
            },
          );
        });
    });
  });

  describe('> when overwrite = false', () => {
    it('should rename a file on the same device', done => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = path.join(TEST_DIR, 'a-file-dest');

      fse
        .move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          fs.readFile(dest, 'utf8', (err, contents) => {
            const expected = /^sonic the hedgehog\r?\n$/;
            expect(err).toBeFalsy();
            expect(contents.match(expected)).toBeTruthy();
            done();
          });
        });
    });

    it('should support promises', async () => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = path.join(TEST_DIR, 'a-file-dest');

      await fse.move(src, dest);

      const contents = fs.readFileSync(dest, 'utf8');
      const expected = /^sonic the hedgehog\r?\n$/;
      expect(contents.match(expected)).toBeTruthy();
    });

    it('should not move a file if source and destination are the same', done => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = src;

      fse
        .move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err.message).toBe(
            'Source and destination must not be the same.',
          );
          done();
        });
    });

    it('should error if source and destination are the same and source does not exist', done => {
      const src = path.join(TEST_DIR, 'non-existent');
      const dest = src;

      fse
        .move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeTruthy();
          done();
        });
    });

    it('should not move a directory if source and destination are the same', done => {
      const src = path.join(TEST_DIR, 'a-folder');
      const dest = src;

      fse
        .move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err.message).toBe(
            'Source and destination must not be the same.',
          );
          done();
        });
    });

    it('should not overwrite the destination by default', done => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = path.join(TEST_DIR, 'a-folder', 'another-file');

      // verify file exists already
      expect(fs.existsSync(dest)).toBeTruthy();

      fse
        .move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err.message).toBe('dest already exists.');
          done();
        });
    });

    it('should not overwrite if overwrite = false', done => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = path.join(TEST_DIR, 'a-folder', 'another-file');

      // verify file exists already
      expect(fs.existsSync(dest)).toBeTruthy();

      fse
        .move(src, dest, { overwrite: false })
        .catch(err => err)
        .then(err => {
          expect(err.message).toBe('dest already exists.');
          done();
        });
    });

    it('should create directory structure by default', done => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = path.join(TEST_DIR, 'does', 'not', 'exist', 'a-file-dest');

      // verify dest directory does not exist
      expect(!fs.existsSync(path.dirname(dest))).toBeTruthy();

      fse
        .move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          fs.readFile(dest, 'utf8', (err, contents) => {
            const expected = /^sonic the hedgehog\r?\n$/;
            expect(err).toBeFalsy();
            expect(contents.match(expected)).toBeTruthy();
            done();
          });
        });
    });

    it('should work across devices', done => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = path.join(TEST_DIR, 'a-file-dest');

      setUpMockFs('EXDEV');

      fse
        .move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();

          fs.readFile(dest, 'utf8', (err, contents) => {
            const expected = /^sonic the hedgehog\r?\n$/;
            expect(err).toBeFalsy();
            expect(contents.match(expected)).toBeTruthy();
            tearDownMockFs();
            done();
          });
        });
    });

    it('should move folders', done => {
      const src = path.join(TEST_DIR, 'a-folder');
      const dest = path.join(TEST_DIR, 'a-folder-dest');

      // verify it doesn't exist
      expect(!fs.existsSync(dest)).toBeTruthy();

      fse
        .move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          fs.readFile(
            path.join(dest, 'another-file'),
            'utf8',
            (err, contents) => {
              const expected = /^tails\r?\n$/;
              expect(err).toBeFalsy();
              expect(contents.match(expected)).toBeTruthy();
              done();
            },
          );
        });
    });

    it('should move folders across devices with EXDEV error', done => {
      const src = path.join(TEST_DIR, 'a-folder');
      const dest = path.join(TEST_DIR, 'a-folder-dest');

      setUpMockFs('EXDEV');

      fse
        .move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();

          fs.readFile(
            path.join(dest, 'another-folder', 'file3'),
            'utf8',
            (err, contents) => {
              const expected = /^knuckles\r?\n$/;
              expect(err).toBeFalsy();
              expect(contents.match(expected)).toBeTruthy();
              tearDownMockFs();
              done();
            },
          );
        });
    });
  });

  describe('> when opts is explicit undefined', () => {
    it('works with callbacks', done => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = path.join(TEST_DIR, 'a-file-dest');

      fse
        .move(src, dest, undefined)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          fs.readFile(dest, 'utf8', (err, contents) => {
            const expected = /^sonic the hedgehog\r?\n$/;
            expect(err).toBeFalsy();
            expect(contents.match(expected)).toBeTruthy();
            done();
          });
        });
    });

    it('works with promises', async () => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = path.join(TEST_DIR, 'a-file-dest');

      await fse.move(src, dest, undefined);

      const contents = fs.readFileSync(dest, 'utf8');
      const expected = /^sonic the hedgehog\r?\n$/;
      expect(contents.match(expected)).toBeTruthy();
    });
  });

  describeIfWindows('> when dest parent is root', () => {
    let dest;

    afterEach(() => fse.remove(dest));

    it('should not create parent directory', done => {
      const src = path.join(TEST_DIR, 'a-file');
      dest = path.join(path.parse(TEST_DIR).root, 'another-file');

      fse
        .move(src, dest)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          fs.readFile(dest, 'utf8', (err, contents) => {
            const expected = /^sonic the hedgehog\r?\n$/;
            expect(err).toBeFalsy();
            expect(contents.match(expected)).toBeTruthy();
            done();
          });
        });
    });
  });

  describe('> clobber', () => {
    it('should be an alias for overwrite', done => {
      const src = path.join(TEST_DIR, 'a-file');
      const dest = path.join(TEST_DIR, 'a-folder', 'another-file');

      // verify file exists already
      expect(fs.existsSync(dest)).toBeTruthy();

      fse
        .move(src, dest, { clobber: true })
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          fs.readFile(dest, 'utf8', (err, contents) => {
            const expected = /^sonic the hedgehog\r?\n$/;
            expect(err).toBeFalsy();
            expect(contents.match(expected)).toBeTruthy();
            done();
          });
        });
    });
  });

  describe('> when trying to move a folder into itself', () => {
    it('should produce an error', done => {
      const SRC_DIR = path.join(TEST_DIR, 'test');
      const DEST_DIR = path.join(TEST_DIR, 'test', 'test');

      expect(!fs.existsSync(SRC_DIR)).toBeTruthy();
      fs.mkdirSync(SRC_DIR);
      expect(fs.existsSync(SRC_DIR)).toBeTruthy();

      fse
        .move(SRC_DIR, DEST_DIR)
        .catch(err => err)
        .then(err => {
          expect(fs.existsSync(SRC_DIR)).toBeTruthy();
          expect(err.message).toBe(
            `Cannot move '${SRC_DIR}' to a subdirectory of itself, '${DEST_DIR}'.`,
          );
          done();
        });
    });
  });

  // tested on Linux ubuntu 3.13.0-32-generic #57-Ubuntu SMP i686 i686 GNU/Linux
  // this won't trigger a bug on Mac OS X Yosimite with a USB drive (/Volumes)
  // see issue #108
  ifCrossDeviceEnabled(describe)(
    '> when actually trying to move a folder across devices',
    () => {
      describe('>> just the folder', () => {
        it('should move the folder', done => {
          const src = path.join(
            differentDevice!,
            'some/weird/dir-really-weird',
          );
          const dest = path.join(TEST_DIR, 'device-weird');

          if (!fs.existsSync(src)) {
            fse.mkdirpSync(src);
          }

          expect(!fs.existsSync(dest)).toBeTruthy();

          expect(fs.lstatSync(src).isDirectory()).toBeTruthy();

          fse
            .move(src, dest)
            .catch(err => err)
            .then(err => {
              expect(err).toBeFalsy();
              expect(fs.existsSync(dest)).toBeTruthy();
              expect(fs.lstatSync(dest).isDirectory()).toBeTruthy();
              done();
            });
        });
      });
    },
  );
});
