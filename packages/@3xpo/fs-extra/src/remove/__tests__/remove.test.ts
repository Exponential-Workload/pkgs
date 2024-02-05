'use strict';

import assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import path from 'path';
import { randomBytes } from 'crypto';
import fse from '../..';

/* global afterEach, beforeEach, describe, it */

let TEST_DIR: string;

function buildFixtureDir() {
  const buf = randomBytes(5);
  const baseDir = path.join(TEST_DIR, `TEST_fs-extra_remove-${Date.now()}`);

  fs.mkdirSync(baseDir);
  fs.writeFileSync(path.join(baseDir, Math.random() + ''), buf);
  fs.writeFileSync(path.join(baseDir, Math.random() + ''), buf);

  const subDir = path.join(TEST_DIR, Math.random() + '');
  fs.mkdirSync(subDir);
  fs.writeFileSync(path.join(subDir, Math.random() + ''), buf);
  return baseDir;
}

describe('remove', () => {
  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'remove');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('+ remove()', () => {
    it('should delete an empty directory', done => {
      expect(fs.existsSync(TEST_DIR)).toBeTruthy();
      fse
        .remove(TEST_DIR)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          expect(!fs.existsSync(TEST_DIR)).toBeTruthy();
          done();
        });
    });

    it('should delete a directory full of directories and files', done => {
      buildFixtureDir();
      expect(fs.existsSync(TEST_DIR)).toBeTruthy();
      fse
        .remove(TEST_DIR)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          expect(!fs.existsSync(TEST_DIR)).toBeTruthy();
          done();
        });
    });

    it('should delete a file', done => {
      const file = path.join(TEST_DIR, 'file');
      fs.writeFileSync(file, 'hello');

      expect(fs.existsSync(file)).toBeTruthy();
      fse
        .remove(file)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          expect(!fs.existsSync(file)).toBeTruthy();
          done();
        });
    });

    it('should delete without a callback', async () => {
      const file = path.join(TEST_DIR, 'file');
      fs.writeFileSync(file, 'hello');

      expect(fs.existsSync(file)).toBeTruthy();
      let done = false;
      let existsChecker: any = setInterval(() => {
        fse.pathExists(file).then(itDoes => {
          if (!itDoes && existsChecker) {
            clearInterval(existsChecker);
            existsChecker = null;
            done = true;
          }
        });
      }, 25);
      fse.remove(file);
      while (!done) await new Promise(rs => setTimeout(rs, 10));
    });

    it('shouldn’t delete glob matches', function (done) {
      const file = path.join(TEST_DIR, 'file?');
      try {
        fs.writeFileSync(file, 'hello');
      } catch (ex) {
        if (ex.code === 'ENOENT')
          return this.skip(
            'Windows does not support filenames with ‘?’ or ‘*’ in them.',
          );
        throw ex;
      }

      const wrongFile = path.join(TEST_DIR, 'file1');
      fs.writeFileSync(wrongFile, 'yo');

      expect(fs.existsSync(file)).toBeTruthy();
      expect(fs.existsSync(wrongFile)).toBeTruthy();
      fse
        .remove(file)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          expect(!fs.existsSync(file)).toBeTruthy();
          expect(fs.existsSync(wrongFile)).toBeTruthy();
          done();
        });
    });

    it('shouldn’t delete glob matches when file doesn’t exist', done => {
      const nonexistentFile = path.join(TEST_DIR, 'file?');

      const wrongFile = path.join(TEST_DIR, 'file1');
      fs.writeFileSync(wrongFile, 'yo');

      expect(!fs.existsSync(nonexistentFile)).toBeTruthy();
      expect(fs.existsSync(wrongFile)).toBeTruthy();
      fse
        .remove(nonexistentFile)
        .catch(err => err)
        .then(err => {
          expect(err).toBeFalsy();
          expect(!fs.existsSync(nonexistentFile)).toBeTruthy();
          expect(fs.existsSync(wrongFile)).toBeTruthy();
          done();
        });
    });
  });
});
