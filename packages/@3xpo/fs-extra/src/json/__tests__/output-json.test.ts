'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global beforeEach, describe, it */

describe('json', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-output-json');
    return fse.emptyDir(TEST_DIR);
  });

  describe('+ outputJson(file, data)', () => {
    it('should write the file regardless of whether the directory exists or not', done => {
      const file = path.join(
        TEST_DIR,
        'this-dir',
        'prob-does-not',
        'exist',
        'file.json',
      );
      expect(!fs.existsSync(file)).toBeTruthy();

      const data = { name: 'JP' };
      fse
        .outputJson(file, data)
        .catch(err => err)
        .then(err => {
          if (err) return done(err);

          expect(fs.existsSync(file)).toBeTruthy();
          const newData = JSON.parse(fs.readFileSync(file, 'utf8'));

          expect(data.name).toBe(newData.name);
          done();
        });
    });

    it('should be mutation-proof', async () => {
      const dir = path.join(TEST_DIR, 'this-dir', 'certanly-does-not', 'exist');
      const file = path.join(dir, 'file.json');
      expect(!fs.existsSync(dir)).toBeTruthy();

      const name = 'JP';
      const data = { name };
      const promise = fse.outputJson(file, data);
      // Mutate data right after call
      data.name = 'Ryan';
      // now await for the call to finish
      await promise;

      expect(fs.existsSync(file)).toBeTruthy();
      const newData = JSON.parse(fs.readFileSync(file, 'utf8'));

      // mutation did not change data
      expect(newData.name).toBe(name);
    });

    it('should support Promises', () => {
      const file = path.join(
        TEST_DIR,
        'this-dir',
        'prob-does-not',
        'exist',
        'file.json',
      );
      expect(!fs.existsSync(file)).toBeTruthy();

      const data = { name: 'JP' };
      return fse.outputJson(file, data);
    });

    describe('> when an option is passed, like JSON replacer', () => {
      it('should pass the option along to jsonfile module', done => {
        const file = path.join(
          TEST_DIR,
          'this-dir',
          'does-not',
          'exist',
          'really',
          'file.json',
        );
        expect(!fs.existsSync(file)).toBeTruthy();

        const replacer = (k, v) => (v === 'JP' ? 'Jon Paul' : v);
        const data = { name: 'JP' };

        fse
          .outputJson(file, data, { replacer })
          .catch(err => err)
          .then(err => {
            expect(err).toBeFalsy();
            const newData = JSON.parse(fs.readFileSync(file, 'utf8'));
            expect(newData.name).toBe('Jon Paul');
            done();
          });
      });
    });
  });
});
