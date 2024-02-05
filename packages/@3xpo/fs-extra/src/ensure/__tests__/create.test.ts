'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';

/* global afterEach, beforeEach, describe, it */

describe('@3xpo/fs-extra -> ensure -> create', () => {
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
        expect(!fs.existsSync(file)).toBeTruthy();
        fse
          .createFile(file)
          .catch(err => err)
          .then(err => {
            expect(err).toBeFalsy();
            expect(fs.existsSync(file)).toBeTruthy();
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
            expect(err).toBeFalsy();
            expect(fs.readFileSync(file, 'utf8')).toBe('hello world');
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
            expect(err.code).toBe('ENOTDIR');
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
        expect(!fs.existsSync(file)).toBeTruthy();
        fse.createFileSync(file);
        expect(fs.existsSync(file)).toBeTruthy();
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
        expect(fs.readFileSync(file, 'utf8')).toBe('hello world');
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
          expect(false).toBe(true);
        } catch (err) {
          expect(err.code).toBe('ENOTDIR');
        }
      });
    });
  });
});
