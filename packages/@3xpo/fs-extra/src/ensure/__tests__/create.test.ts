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
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'create');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('+ createFile', () => {
    describe('> when the file and directory does not exist', () => {
      it('should create the file', done => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 't-ne',
          Math.random() + '.txt',
        );
        assert(!fs.existsSync(file));
        fse
          .createFile(file)
          .catch(err => err)
          .then(err => {
            assert.ifError(err);
            assert(fs.existsSync(file));
            done();
          });
      });
    });

    describe('> when the file does exist', () => {
      it('should not modify the file', done => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 't-e',
          Math.random() + '.txt',
        );
        fse.mkdirsSync(path.dirname(file));
        fs.writeFileSync(file, 'hello world');
        fse
          .createFile(file)
          .catch(err => err)
          .then(err => {
            assert.ifError(err);
            assert.strictEqual(fs.readFileSync(file, 'utf8'), 'hello world');
            done();
          });
      });

      it('should give clear error if node in directory tree is a file', done => {
        const existingFile = path.join(
          TEST_DIR,
          Math.random() + 'ts-e',
          Math.random() + '.txt',
        );
        fse.mkdirsSync(path.dirname(existingFile));
        fs.writeFileSync(existingFile, '');

        const file = path.join(existingFile, Math.random() + '.txt');
        fse
          .createFile(file)
          .catch(err => err)
          .then(err => {
            assert.strictEqual(err.code, 'ENOTDIR');
            done();
          });
      });
    });
  });

  describe('+ createFileSync', () => {
    describe('> when the file and directory does not exist', () => {
      it('should create the file', () => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 'ts-ne',
          Math.random() + '.txt',
        );
        assert(!fs.existsSync(file));
        fse.createFileSync(file);
        assert(fs.existsSync(file));
      });
    });

    describe('> when the file does exist', () => {
      it('should not modify the file', () => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 'ts-e',
          Math.random() + '.txt',
        );
        fse.mkdirsSync(path.dirname(file));
        fs.writeFileSync(file, 'hello world');
        fse.createFileSync(file);
        assert.strictEqual(fs.readFileSync(file, 'utf8'), 'hello world');
      });

      it('should give clear error if node in directory tree is a file', () => {
        const existingFile = path.join(
          TEST_DIR,
          Math.random() + 'ts-e',
          Math.random() + '.txt',
        );
        fse.mkdirsSync(path.dirname(existingFile));
        fs.writeFileSync(existingFile, '');

        const file = path.join(existingFile, Math.random() + '.txt');
        try {
          fse.createFileSync(file);
          assert.fail();
        } catch (err) {
          assert.strictEqual(err.code, 'ENOTDIR');
        }
      });
    });
  });
});
