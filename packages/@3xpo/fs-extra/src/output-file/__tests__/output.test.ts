'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('output', () => {
  let TEST_DIR: string;

  beforeEach(done => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'output');
    fse.emptyDir(TEST_DIR, done);
  });

  afterEach(() => fse.remove(TEST_DIR));

  describe('+ outputFile', () => {
    describe('> when the file and directory does not exist', () => {
      it('should create the file', done => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 't-ne',
          Math.random() + '.txt',
        );
        assert(!fs.existsSync(file));
        try {
          fse.outputFile(file, 'hi jp');
          assert(fs.existsSync(file));
          assert.strictEqual(fs.readFileSync(file, 'utf8'), 'hi jp');
          done();
        } catch (err) {
          assert.ifError(err);
        }
      });
      it('should support promises', () => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 't-ne',
          Math.random() + '.txt',
        );
        assert(!fs.existsSync(file));
        return fse.outputFile(file, 'hi jp');
      });
    });

    describe('> when the file does exist', () => {
      it('should still modify the file', async done => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 't-e',
          Math.random() + '.txt',
        );
        fse.mkdirsSync(path.dirname(file));
        fs.writeFileSync(file, 'hello world');
        try {
          await fse.outputFile(file, 'hello jp');
          assert.strictEqual(fs.readFileSync(file, 'utf8'), 'hello jp');
          done();
        } catch (err) {
          if (err) return done(err);
        }
      });
    });
  });

  describe('+ outputFileSync', () => {
    describe('> when the file and directory does not exist', () => {
      it('should create the file', () => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 'ts-ne',
          Math.random() + '.txt',
        );
        assert(!fs.existsSync(file));
        fse.outputFileSync(file, 'hello man');
        assert(fs.existsSync(file));
        assert.strictEqual(fs.readFileSync(file, 'utf8'), 'hello man');
      });
    });

    describe('> when the file does exist', () => {
      it('should still modify the file', () => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 'ts-e',
          Math.random() + '.txt',
        );
        fse.mkdirsSync(path.dirname(file));
        fs.writeFileSync(file, 'hello world');
        fse.outputFileSync(file, 'hello man');
        assert.strictEqual(fs.readFileSync(file, 'utf8'), 'hello man');
      });
    });
  });
});
