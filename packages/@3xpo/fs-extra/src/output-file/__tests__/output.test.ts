'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('output', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'output');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('+ outputFile', () => {
    describe('> when the file and directory does not exist', () => {
      it('should create the file', async () => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 't-ne',
          Math.random() + '.txt',
        );
        expect(!fs.existsSync(file)).toBeTruthy();
        await fse.outputFile(file, 'hi jp');
        expect(fs.existsSync(file)).toBeTruthy();
        expect(fs.readFileSync(file, 'utf8')).toBe('hi jp');
      });
      it('should support promises', () => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 't-ne',
          Math.random() + '.txt',
        );
        expect(!fs.existsSync(file)).toBeTruthy();
        return fse.outputFile(file, 'hi jp');
      });
    });

    describe('> when the file does exist', () => {
      it('should still modify the file', async () => {
        const file = path.join(
          TEST_DIR,
          Math.random() + 't-e',
          Math.random() + '.txt',
        );
        fse.mkdirsSync(path.dirname(file));
        fs.writeFileSync(file, 'hello world');
        await fse.outputFile(file, 'hello jp');
        expect(fs.readFileSync(file, 'utf8')).toBe('hello jp');
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
        expect(!fs.existsSync(file)).toBeTruthy();
        fse.outputFileSync(file, 'hello man');
        expect(fs.existsSync(file)).toBeTruthy();
        expect(fs.readFileSync(file, 'utf8')).toBe('hello man');
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
        expect(fs.readFileSync(file, 'utf8')).toBe('hello man');
      });
    });
  });
});
