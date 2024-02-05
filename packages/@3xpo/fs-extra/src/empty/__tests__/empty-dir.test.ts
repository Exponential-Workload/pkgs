'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('+ emptyDir()', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'empty-dir');
    if (fs.existsSync(TEST_DIR)) {
      fse.removeSync(TEST_DIR);
    }
    fse.ensureDirSync(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('> when directory exists and contains items', () => {
    it('should delete all of the items', done => {
      // verify nothing
      expect(fs.readdirSync(TEST_DIR).length).toBe(0);
      fse.ensureFileSync(path.join(TEST_DIR, 'some-file'));
      fse.ensureFileSync(path.join(TEST_DIR, 'some-file-2'));
      fse.ensureDirSync(path.join(TEST_DIR, 'some-dir'));
      expect(fs.readdirSync(TEST_DIR).length).toBe(3);

      fse.emptyDir(TEST_DIR, err => {
        expect(err).toBeFalsy();
        expect(fs.readdirSync(TEST_DIR).length).toBe(0);
        done();
      });
    });
  });

  describe('> when directory exists and contains no items', () => {
    it('should do nothing', done => {
      expect(fs.readdirSync(TEST_DIR).length).toBe(0);
      fse.emptyDir(TEST_DIR, err => {
        expect(err).toBeFalsy();
        expect(fs.readdirSync(TEST_DIR).length).toBe(0);
        done();
      });
    });
  });

  describe('> when directory does not exist', () => {
    it('should create it', done => {
      fse.removeSync(TEST_DIR);
      expect(!fs.existsSync(TEST_DIR)).toBeTruthy();
      fse.emptyDir(TEST_DIR, err => {
        expect(err).toBeFalsy();
        expect(fs.readdirSync(TEST_DIR).length).toBe(0);
        done();
      });
    });
  });
});
