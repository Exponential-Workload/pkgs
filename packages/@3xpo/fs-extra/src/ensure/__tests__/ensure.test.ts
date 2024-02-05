'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('fs-extra', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'ensure');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('+ ensureFile()', () => {
    describe('> when file exists', () => {
      it('should not do anything', done => {
        const file = path.join(TEST_DIR, 'file.txt');
        fs.writeFileSync(file, 'blah');

        expect(fs.existsSync(file)).toBeTruthy();
        fse
          .ensureFile(file)
          .catch(err => err)
          .then(err => {
            expect(err).toBeFalsy();
            expect(fs.existsSync(file)).toBeTruthy();
            done();
          });
      });
    });

    describe('> when file does not exist', () => {
      it('should create the file', done => {
        const file = path.join(TEST_DIR, 'dir/that/does/not/exist', 'file.txt');

        expect(!fs.existsSync(file)).toBeTruthy();
        fse
          .ensureFile(file)
          .catch(err => err)
          .then(err => {
            expect(err).toBeFalsy();
            expect(fs.existsSync(file)).toBeTruthy();
            done();
          });
      });
    });

    describe('> when there is a directory at that path', () => {
      it('should error', done => {
        const p = path.join(TEST_DIR, 'somedir');
        fs.mkdirSync(p);

        fse
          .ensureFile(p)
          .catch(err => err)
          .then(err => {
            expect(err).toBeTruthy();
            expect(err.code).toBe('EISDIR');
            done();
          });
      });
    });
  });

  describe('+ ensureFileSync()', () => {
    describe('> when file exists', () => {
      it('should not do anything', () => {
        const file = path.join(TEST_DIR, 'file.txt');
        fs.writeFileSync(file, 'blah');

        expect(fs.existsSync(file)).toBeTruthy();
        fse.ensureFileSync(file);
        expect(fs.existsSync(file)).toBeTruthy();
      });
    });

    describe('> when file does not exist', () => {
      it('should create the file', () => {
        const file = path.join(TEST_DIR, 'dir/that/does/not/exist', 'file.txt');

        expect(!fs.existsSync(file)).toBeTruthy();
        fse.ensureFileSync(file);
        expect(fs.existsSync(file)).toBeTruthy();
      });
    });

    describe('> when there is a directory at that path', () => {
      it('should error', () => {
        const p = path.join(TEST_DIR, 'somedir2');
        fs.mkdirSync(p);

        expect(() => {
          try {
            fse.ensureFileSync(p);
          } catch (e) {
            expect(e.code).toBe('EISDIR');
            throw e;
          }
        }).toThrow();
      });
    });
  });

  describe('+ ensureDir()', () => {
    describe('> when dir exists', () => {
      it('should not do anything', done => {
        const dir = path.join(TEST_DIR, 'dir/does/not/exist');
        fse.mkdirpSync(dir);

        expect(fs.existsSync(dir)).toBeTruthy();
        fse
          .ensureDir(dir)
          .catch(err => err)
          .then(err => {
            expect(err).toBeFalsy();
            expect(fs.existsSync(dir)).toBeTruthy();
            done();
          });
      });
    });

    describe('> when dir does not exist', () => {
      it('should create the dir', async () => {
        const dir = path.join(TEST_DIR, 'dir/that/does/not/exist');

        expect(fs.existsSync(dir)).toBeFalsy();
        await fse.ensureDir(dir);
        expect(fs.existsSync(dir)).toBeTruthy();
      });
    });
  });

  describe('+ ensureDirSync()', () => {
    describe('> when dir exists', () => {
      it('should not do anything', () => {
        const dir = path.join(TEST_DIR, 'dir/does/not/exist');
        fse.mkdirpSync(dir);

        expect(fs.existsSync(dir)).toBeTruthy();
        fse.ensureDirSync(dir);
        expect(fs.existsSync(dir)).toBeTruthy();
      });
    });

    describe('> when dir does not exist', () => {
      it('should create the dir', () => {
        const dir = path.join(TEST_DIR, 'dir/that/does/not/exist');

        expect(!fs.existsSync(dir)).toBeTruthy();
        fse.ensureDirSync(dir);
        expect(fs.existsSync(dir)).toBeTruthy();
      });
    });
  });
});
