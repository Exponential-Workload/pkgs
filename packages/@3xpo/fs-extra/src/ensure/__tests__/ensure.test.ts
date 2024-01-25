'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('fs-extra', () => {
  let TEST_DIR: string;

  beforeEach(done => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'ensure');
    fse.emptyDir(TEST_DIR, done);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('+ ensureFile()', () => {
    describe('> when file exists', () => {
      it('should not do anything', done => {
        const file = path.join(TEST_DIR, 'file.txt');
        fs.writeFileSync(file, 'blah');

        assert(fs.existsSync(file));
        fse
          .ensureFile(file)
          .catch(err => err)
          .then(err => {
            assert.ifError(err);
            assert(fs.existsSync(file));
            done();
          });
      });
    });

    describe('> when file does not exist', () => {
      it('should create the file', done => {
        const file = path.join(TEST_DIR, 'dir/that/does/not/exist', 'file.txt');

        assert(!fs.existsSync(file));
        fse
          .ensureFile(file)
          .catch(err => err)
          .then(err => {
            assert.ifError(err);
            assert(fs.existsSync(file));
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
            assert(err);
            assert.strictEqual(err.code, 'EISDIR');
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

        assert(fs.existsSync(file));
        fse.ensureFileSync(file);
        assert(fs.existsSync(file));
      });
    });

    describe('> when file does not exist', () => {
      it('should create the file', () => {
        const file = path.join(TEST_DIR, 'dir/that/does/not/exist', 'file.txt');

        assert(!fs.existsSync(file));
        fse.ensureFileSync(file);
        assert(fs.existsSync(file));
      });
    });

    describe('> when there is a directory at that path', () => {
      it('should error', () => {
        const p = path.join(TEST_DIR, 'somedir2');
        fs.mkdirSync(p);

        assert.throws(() => {
          try {
            fse.ensureFileSync(p);
          } catch (e) {
            assert.strictEqual(e.code, 'EISDIR');
            throw e;
          }
        });
      });
    });
  });

  describe('+ ensureDir()', () => {
    describe('> when dir exists', () => {
      it('should not do anything', done => {
        const dir = path.join(TEST_DIR, 'dir/does/not/exist');
        fse.mkdirpSync(dir);

        assert(fs.existsSync(dir));
        fse
          .ensureDir(dir)
          .catch(err => err)
          .then(err => {
            assert.ifError(err);
            assert(fs.existsSync(dir));
            done();
          });
      });
    });

    describe('> when dir does not exist', () => {
      it('should create the dir', done => {
        const dir = path.join(TEST_DIR, 'dir/that/does/not/exist');

        assert(!fs.existsSync(dir));
        fse
          .ensureDir(dir)
          .catch(err => err)
          .then(err => {
            assert.ifError(err);
            assert(fs.existsSync(dir));
            done();
          });
      });
    });
  });

  describe('+ ensureDirSync()', () => {
    describe('> when dir exists', () => {
      it('should not do anything', () => {
        const dir = path.join(TEST_DIR, 'dir/does/not/exist');
        fse.mkdirpSync(dir);

        assert(fs.existsSync(dir));
        fse.ensureDirSync(dir);
        assert(fs.existsSync(dir));
      });
    });

    describe('> when dir does not exist', () => {
      it('should create the dir', () => {
        const dir = path.join(TEST_DIR, 'dir/that/does/not/exist');

        assert(!fs.existsSync(dir));
        fse.ensureDirSync(dir);
        assert(fs.existsSync(dir));
      });
    });
  });
});