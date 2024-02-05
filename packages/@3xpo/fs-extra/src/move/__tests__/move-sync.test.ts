'use strict';

// TODO: enable this once graceful-fs supports bigint option.
// const fs = require('graceful-fs')
import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';
import { differentDevice, ifCrossDeviceEnabled } from './cross-device-utils';

/* global afterEach, beforeEach, describe, it */

const describeIfWindows =
  process.platform === 'win32' ? describe : describe.skip;

describe('moveSync()', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'move-sync');
    fse.emptyDirSync(TEST_DIR);

    // Create fixtures
    fse.outputFileSync(path.join(TEST_DIR, 'a-file'), 'sonic the hedgehog\n');
    fse.outputFileSync(path.join(TEST_DIR, 'a-folder/another-file'), 'tails\n');
    fse.outputFileSync(
      path.join(TEST_DIR, 'a-folder/another-folder/file3'),
      'knuckles\n',
    );
  });

  afterEach(() => fse.removeSync(TEST_DIR));

  it('should not move if src and dest are the same', () => {
    const src = `${TEST_DIR}/a-file`;
    const dest = `${TEST_DIR}/a-file`;

    let errThrown = false;
    try {
      fse.moveSync(src, dest);
    } catch (err) {
      expect(err.message).toBe('Source and destination must not be the same.');
      errThrown = true;
    } finally {
      expect(errThrown).toBeTruthy();
    }

    // assert src not affected
    const contents = fs.readFileSync(src, 'utf8');
    const expected = /^sonic the hedgehog\r?\n$/;
    expect(contents.match(expected)).toBeTruthy();
  });

  it('should error if src and dest are the same and src does not exist', () => {
    const src = `${TEST_DIR}/non-existent`;
    const dest = src;
    expect(() => fse.moveSync(src, dest)).toThrow();
  });

  it('should rename a file on the same device', () => {
    const src = `${TEST_DIR}/a-file`;
    const dest = `${TEST_DIR}/a-file-dest`;

    fse.moveSync(src, dest);

    const contents = fs.readFileSync(dest, 'utf8');
    const expected = /^sonic the hedgehog\r?\n$/;
    expect(contents.match(expected)).toBeTruthy();
  });

  it('should not overwrite the destination by default', () => {
    const src = `${TEST_DIR}/a-file`;
    const dest = `${TEST_DIR}/a-folder/another-file`;

    // verify file exists already
    expect(fs.existsSync(dest)).toBeTruthy();

    try {
      fse.moveSync(src, dest);
    } catch (err) {
      expect(err.message).toBe('dest already exists.');
    }
  });

  it('should not overwrite if overwrite = false', () => {
    const src = `${TEST_DIR}/a-file`;
    const dest = `${TEST_DIR}/a-folder/another-file`;

    // verify file exists already
    expect(fs.existsSync(dest)).toBeTruthy();

    try {
      fse.moveSync(src, dest, { overwrite: false });
    } catch (err) {
      expect(err.message).toBe('dest already exists.');
    }
  });

  it('should overwrite file if overwrite = true', () => {
    const src = `${TEST_DIR}/a-file`;
    const dest = `${TEST_DIR}/a-folder/another-file`;

    // verify file exists already
    expect(fs.existsSync(dest)).toBeTruthy();

    fse.moveSync(src, dest, { overwrite: true });

    const contents = fs.readFileSync(dest, 'utf8');
    const expected = /^sonic the hedgehog\r?\n$/;
    expect(contents.match(expected)).toBeTruthy();
  });

  it('should overwrite the destination directory if overwrite = true', () => {
    // Create src
    const src = path.join(TEST_DIR, 'src');
    fse.ensureDirSync(src);
    fse.mkdirsSync(path.join(src, 'some-folder'));
    fs.writeFileSync(path.join(src, 'some-file'), 'hi');

    const dest = path.join(TEST_DIR, 'a-folder');

    // verify dest has stuff in it
    const pathsBefore = fs.readdirSync(dest);
    expect(pathsBefore.indexOf('another-file') >= 0).toBeTruthy();
    expect(pathsBefore.indexOf('another-folder') >= 0).toBeTruthy();

    fse.moveSync(src, dest, { overwrite: true });

    // verify dest does not have old stuff
    const pathsAfter = fs.readdirSync(dest);
    expect(pathsAfter.indexOf('another-file')).toBe(-1);
    expect(pathsAfter.indexOf('another-folder')).toBe(-1);

    // verify dest has new stuff
    expect(pathsAfter.indexOf('some-file') >= 0).toBeTruthy();
    expect(pathsAfter.indexOf('some-folder') >= 0).toBeTruthy();
  });

  it('should create directory structure by default', () => {
    const src = `${TEST_DIR}/a-file`;
    const dest = `${TEST_DIR}/does/not/exist/a-file-dest`;

    // verify dest directory does not exist
    expect(!fs.existsSync(path.dirname(dest))).toBeTruthy();

    fse.moveSync(src, dest);

    const contents = fs.readFileSync(dest, 'utf8');
    const expected = /^sonic the hedgehog\r?\n$/;
    expect(contents.match(expected)).toBeTruthy();
  });

  it('should move folders', () => {
    const src = `${TEST_DIR}/a-folder`;
    const dest = `${TEST_DIR}/a-folder-dest`;

    // verify it doesn't exist
    expect(!fs.existsSync(dest)).toBeTruthy();

    fse.moveSync(src, dest);

    const contents = fs.readFileSync(dest + '/another-file', 'utf8');
    const expected = /^tails\r?\n$/;
    expect(contents.match(expected)).toBeTruthy();
  });

  describe('clobber', () => {
    it('should be an alias for overwrite', () => {
      const src = `${TEST_DIR}/a-file`;
      const dest = `${TEST_DIR}/a-folder/another-file`;

      // verify file exists already
      expect(fs.existsSync(dest)).toBeTruthy();

      fse.moveSync(src, dest, { clobber: true });

      const contents = fs.readFileSync(dest, 'utf8');
      const expected = /^sonic the hedgehog\r?\n$/;
      expect(contents.match(expected)).toBeTruthy();
    });
  });

  describe('> when trying to move a folder into itself', () => {
    it('should produce an error', () => {
      const SRC_DIR = path.join(TEST_DIR, 'src');
      const DEST_DIR = path.join(TEST_DIR, 'src', 'dest');

      expect(!fs.existsSync(SRC_DIR)).toBeTruthy();
      fs.mkdirSync(SRC_DIR);
      expect(fs.existsSync(SRC_DIR)).toBeTruthy();

      try {
        fse.moveSync(SRC_DIR, DEST_DIR);
      } catch (err) {
        expect(err.message).toBeTruthy();
        expect(fs.existsSync(SRC_DIR)).toBeTruthy();
        expect(!fs.existsSync(DEST_DIR)).toBeTruthy();
      }
    });
  });

  describe('> when trying to move a file into its parent subdirectory', () => {
    it('should move successfully', () => {
      const src = `${TEST_DIR}/a-file`;
      const dest = `${TEST_DIR}/dest/a-file-dest`;

      fse.moveSync(src, dest);

      const contents = fs.readFileSync(dest, 'utf8');
      const expected = /^sonic the hedgehog\r?\n$/;
      expect(contents.match(expected)).toBeTruthy();
    });
  });

  describeIfWindows('> when dest parent is root', () => {
    let dest;

    afterEach(() => fse.removeSync(dest));

    it('should not create parent directory', () => {
      const src = path.join(TEST_DIR, 'a-file');
      dest = path.join(path.parse(TEST_DIR).root, 'another-file');

      fse.moveSync(src, dest);

      const contents = fs.readFileSync(dest, 'utf8');
      const expected = /^sonic the hedgehog\r?\n$/;
      expect(contents.match(expected)).toBeTruthy();
    });
  });

  ifCrossDeviceEnabled(describe)(
    '> when actually trying to move a folder across devices',
    () => {
      describe('> just the folder', () => {
        it('should move the folder', () => {
          const src = path.join(
            differentDevice!,
            'some/weird/dir-really-weird',
          );
          const dest = path.join(TEST_DIR, 'device-weird');

          if (!fs.existsSync(src)) fse.mkdirpSync(src);
          expect(!fs.existsSync(dest)).toBeTruthy();
          expect(fs.lstatSync(src).isDirectory()).toBeTruthy();

          fse.moveSync(src, dest);

          expect(fs.existsSync(dest)).toBeTruthy();
          expect(fs.lstatSync(dest).isDirectory()).toBeTruthy();
        });
      });
    },
  );
});
