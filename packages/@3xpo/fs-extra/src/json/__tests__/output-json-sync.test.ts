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
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'output-json-sync');
    return fse.emptyDir(TEST_DIR);
  });

  describe('+ outputJsonSync(file, data)', () => {
    it('should write the file regardless of whether the directory exists or not', () => {
      const file = path.join(
        TEST_DIR,
        'this-dir',
        'does-not',
        'exist',
        'file.json',
      );
      expect(!fs.existsSync(file)).toBeTruthy();

      const data = { name: 'JP' };
      fse.outputJsonSync(file, data);

      expect(fs.existsSync(file)).toBeTruthy();
      const newData = JSON.parse(fs.readFileSync(file, 'utf8'));

      expect(data.name).toBe(newData.name);
    });

    describe('> when an option is passed, like JSON replacer', () => {
      it('should pass the option along to jsonfile module', () => {
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

        fse.outputJsonSync(file, data, { replacer });
        const newData = JSON.parse(fs.readFileSync(file, 'utf8'));

        expect(newData.name).toBe('Jon Paul');
      });
    });
  });
});
