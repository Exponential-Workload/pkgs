import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import * as rimraf from 'rimraf';
import jf from '../index';

/* global describe it beforeEach afterEach */

describe('+ readFileSync()', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(
      os.tmpdir(),
      'fs-extra-test-suite',
      'jsonfile-tests-readfile-sync',
    );
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
    fs.mkdirSync(TEST_DIR);
  });

  afterEach(done => {
    rimraf.sync(TEST_DIR);
    done();
  });

  it('should read and parse JSON', () => {
    const file = path.join(TEST_DIR, 'somefile3.json');
    const obj = { name: 'JP' };
    fs.writeFileSync(file, JSON.stringify(obj));

    try {
      const obj2 = jf.readFileSync(file);
      expect(obj2.name).toBe(obj.name);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  describe('> when invalid JSON', () => {
    it('should include the filename in the error', () => {
      const fn = 'somefile.json';
      const file = path.join(TEST_DIR, fn);
      fs.writeFileSync(file, '{');

      expect(() => {
        jf.readFileSync(file);
      }).toThrow();
    });
  });

  describe('> when invalid JSON and throws set to false', () => {
    it('should return null', () => {
      const file = path.join(TEST_DIR, 'somefile4-invalid.json');
      const data = '{not valid JSON';
      fs.writeFileSync(file, data);

      expect(() => {
        jf.readFileSync(file);
      }).toThrow();

      const obj = jf.readFileSync(file, { throws: false });
      expect(obj).toBe(null);
    });
  });

  describe('> when invalid JSON and throws set to true', () => {
    it('should throw an exception', () => {
      const file = path.join(TEST_DIR, 'somefile4-invalid.json');
      const data = '{not valid JSON';
      fs.writeFileSync(file, data);

      expect(() => {
        jf.readFileSync(file, { throws: true });
      }).toThrow();
    });
  });

  describe('> when json file is missing and throws set to false', () => {
    it('should return null', () => {
      const file = path.join(TEST_DIR, 'somefile4-invalid.json');

      const obj = jf.readFileSync(file, { throws: false });
      expect(obj).toBe(null);
    });
  });

  describe('> when json file is missing and throws set to true', () => {
    it('should throw an exception', () => {
      const file = path.join(TEST_DIR, 'somefile4-invalid.json');

      expect(() => {
        jf.readFileSync(file, { throws: true });
      }).toThrow();
    });
  });

  describe('> when JSON reviver is set', () => {
    it('should transform the JSON', () => {
      const file = path.join(TEST_DIR, 'somefile.json');
      const sillyReviver = function (k, v) {
        if (typeof v !== 'string') return v;
        if (v.indexOf('date:') < 0) return v;
        return new Date(v.split('date:')[1]);
      };

      const obj = {
        name: 'jp',
        day: 'date:2015-06-19T11:41:26.815Z',
      };

      fs.writeFileSync(file, JSON.stringify(obj));
      const data = jf.readFileSync(file, { reviver: sillyReviver });
      expect(data.name).toBe('jp');
      expect(data.day instanceof Date).toBeTruthy();
      expect(data.day.toISOString()).toBe('2015-06-19T11:41:26.815Z');
    });
  });

  describe('> when passing encoding string as option', () => {
    it('should not throw an error', () => {
      const file = path.join(TEST_DIR, 'somefile.json');

      const obj = {
        name: 'jp',
      };
      fs.writeFileSync(file, JSON.stringify(obj));

      let data;
      try {
        data = jf.readFileSync(file, 'utf8');
      } catch (err) {
        expect(err).toBeFalsy();
      }
      expect(data.name).toBe('jp');
    });
  });

  describe('> w/ BOM', () => {
    it('should properly parse', () => {
      const file = path.join(TEST_DIR, 'file-bom.json');
      const obj = { name: 'JP' };
      fs.writeFileSync(file, `\uFEFF${JSON.stringify(obj)}`);
      const data = jf.readFileSync(file);
      expect(obj).toStrictEqual(data);
    });
  });
});
