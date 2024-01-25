import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import * as rimraf from 'rimraf';
import jf from '../index';
import { fromCallback } from 'universalify';

/* global describe it beforeEach afterEach */

describe('+ readFile()', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'jsonfile-tests-readfile');
    rimraf.sync(TEST_DIR);
    fromCallback(fs.mkdir)(TEST_DIR);
  });

  afterEach(done => {
    rimraf.sync(TEST_DIR);
    done();
  });

  it('should resolve a promise with parsed JSON', done => {
    const file = path.join(TEST_DIR, 'somefile.json');
    const obj = { name: 'JP' };
    fs.writeFileSync(file, JSON.stringify(obj));

    jf.readFile(file)
      .then(data => {
        assert.strictEqual(data.name, obj.name);
        done();
      })
      .catch(err => {
        assert.ifError(err);
        done();
      });
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
        assert(err instanceof Error);
        assert(err.message.match(fn));
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
          assert.strictEqual(data, null);
          done();
        })
        .catch(err => {
          assert.ifError(err);
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
        assert(err instanceof Error);
        assert(err.message.match(fn));
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
      assert.strictEqual(data.name, 'jp');
      assert(data.day instanceof Date);
      assert.strictEqual(data.day.toISOString(), '2015-06-19T11:41:26.815Z');
    });

    it('should resolve the promise with transformed JSON', done => {
      jf.readFile(file, { reviver: sillyReviver })
        .then(data => {
          assert.strictEqual(data.name, 'jp');
          assert(data.day instanceof Date);
          assert.strictEqual(
            data.day.toISOString(),
            '2015-06-19T11:41:26.815Z',
          );
          done();
        })
        .catch(err => {
          assert.ifError(err);
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
          assert.strictEqual(data.name, obj.name);
          done();
        })
        .catch(err => {
          assert.ifError(err);
          done();
        });
    });
  });

  describe('> w/ BOM', () => {
    let file, obj;

    beforeEach(async () => {
      file = path.join(TEST_DIR, 'file-bom.json');
      obj = { name: 'JP' };
      fs.writeFileSync(file, `\uFEFF${JSON.stringify(obj)}`);
    });

    it('should properly parse', async () => {
      const data = await jf.readFile(file);
      assert.deepStrictEqual(obj, data);
    });

    it('should resolve the promise with parsed JSON', done => {
      jf.readFile(file)
        .then(data => {
          assert.deepStrictEqual(data, obj);
          done();
        })
        .catch(err => {
          assert.ifError(err);
          done();
        });
    });
  });
});
