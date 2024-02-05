import fs from 'fs';
import os from 'os';
import path from 'path';
import * as rimraf from 'rimraf';
import jf from '../index';

/* global describe it beforeEach afterEach */

describe('+ readFile()', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'jsonfile-tests-readfile');
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
    fs.mkdirSync(TEST_DIR);
  });

  afterEach(done => {
    rimraf.sync(TEST_DIR);
    done();
  });

  it('should resolve a promise with parsed JSON', async () => {
    const file = path.join(TEST_DIR, 'somefile.json');
    const obj = { name: 'JP' };
    fs.mkdirSync(path.dirname(file), {
      recursive: true,
    });
    fs.writeFileSync(file, JSON.stringify(obj));

    const data = await jf.readFile(file);
    expect(data.name).toStrictEqual(obj.name);
  });

  describe('> when invalid JSON', () => {
    let fn, file;

    beforeEach(async () => {
      fn = 'somefile.json';
      file = path.join(TEST_DIR, fn);
      fs.writeFileSync(file, '{');
    });

    it('should reject the promise with filename in error', done => {
      jf.readFile(file).catch(err => {
        expect(err instanceof Error).toBeTruthy();
        expect(err.message.match(fn)).toBeTruthy();
        done();
      });
    });
  });

  describe('> when invalid JSON and throws set to false', () => {
    let fn, file;

    beforeEach(async () => {
      fn = 'somefile4-invalid.json';
      file = path.join(TEST_DIR, fn);
      const data = '{not valid JSON';
      fs.writeFileSync(file, data);
    });

    it('should resolve the promise with null as data', done => {
      jf.readFile(file, { throws: false })
        .then(data => {
          expect(data).toBe(null);
          done();
        })
        .catch(err => {
          expect(err).toBeFalsy();
          done();
        });
    });
  });

  describe('> when invalid JSON and throws set to true', () => {
    let fn, file;

    beforeEach(async () => {
      fn = 'somefile4-invalid.json';
      file = path.join(TEST_DIR, fn);
      const data = '{not valid JSON';
      fs.writeFileSync(file, data);
    });

    it('should return an error', async () => {
      try {
        await jf.readFile(file);
        throw null;
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toMatch(fn);
      }

      try {
        await jf.readFile(file, { throws: true });
        throw null;
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toMatch(fn);
      }
      return true;
    });

    it('should reject the promise', done => {
      jf.readFile(file, { throws: true }).catch(err => {
        expect(err instanceof Error).toBeTruthy();
        expect(err.message.match(fn)).toBeTruthy();
        done();
      });
    });
  });

  describe('> when JSON reviver is set', () => {
    let file, sillyReviver;

    beforeEach(async () => {
      file = path.join(TEST_DIR, 'somefile.json');
      sillyReviver = (k, v) => {
        if (typeof v !== 'string') return v;
        if (v.indexOf('date:') < 0) return v;
        return new Date(v.split('date:')[1]);
      };

      const obj = { name: 'jp', day: 'date:2015-06-19T11:41:26.815Z' };

      fs.writeFileSync(file, JSON.stringify(obj));
    });

    it('should transform the JSON', async () => {
      const data = await jf.readFile(file, { reviver: sillyReviver });
      expect(data.name).toBe('jp');
      expect(data.day instanceof Date).toBeTruthy();
      expect(data.day.toISOString()).toBe('2015-06-19T11:41:26.815Z');
    });

    it('should resolve the promise with transformed JSON', done => {
      jf.readFile(file, { reviver: sillyReviver })
        .then(data => {
          expect(data.name).toBe('jp');
          expect(data.day instanceof Date).toBeTruthy();
          expect(data.day.toISOString()).toBe('2015-06-19T11:41:26.815Z');
          done();
        })
        .catch(err => {
          expect(err).toBeFalsy();
          done();
        });
    });
  });

  describe('> when passing encoding string as option', () => {
    let file, obj;

    beforeEach(async () => {
      file = path.join(TEST_DIR, 'somefile.json');

      obj = {
        name: 'jp',
      };
      fs.writeFileSync(file, JSON.stringify(obj));
    });

    it('should not throw an error', async () => {
      expect((await jf.readFile(file, 'utf8')).name).toEqual('jp');
    });

    it('should resolve the promise', done => {
      jf.readFile(file, 'utf8')
        .then(data => {
          expect(data.name).toBe(obj.name);
          done();
        })
        .catch(err => {
          expect(err).toBeFalsy();
          done();
        });
    });
  });

  describe('> w/ BOM', () => {
    let file, obj;

    beforeEach(async () => {
      file = path.join(TEST_DIR, 'file-bom.json');
      obj = { name: 'JP' };
      fs.mkdirSync(path.join(file, '..'), {
        recursive: true,
      });
      fs.writeFileSync(file, `\uFEFF${JSON.stringify(obj)}`);
    });

    it('should properly parse', async () => {
      const data = await jf.readFile(file);
      expect(obj).toStrictEqual(data);
    });

    it('should resolve the promise with parsed JSON', done => {
      jf.readFile(file)
        .then(data => {
          expect(data).toStrictEqual(obj);
          done();
        })
        .catch(err => {
          expect(err).toBeFalsy();
          done();
        });
    });
  });
});
