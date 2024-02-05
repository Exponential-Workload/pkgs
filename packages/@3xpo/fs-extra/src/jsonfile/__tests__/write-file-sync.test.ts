import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import * as rimraf from 'rimraf';
import jf from '../';

/* global describe it beforeEach afterEach */

describe('+ writeFileSync()', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'jsonfile-tests-writefile-sync');
    rimraf.sync(TEST_DIR);
    fs.mkdirSync(TEST_DIR);
  });

  afterEach(done => {
    rimraf.sync(TEST_DIR);
    done();
  });

  it('should serialize the JSON and write it to file', () => {
    const file = path.join(TEST_DIR, 'somefile4.json');
    const obj = { name: 'JP' };

    jf.writeFileSync(file, obj);

    const data = fs.readFileSync(file, 'utf8');
    const obj2 = JSON.parse(data);
    expect(obj2.name).toBe(obj.name);
    expect(data[data.length - 1]).toBe('\n');
    expect(data).toBe('{"name":"JP"}\n');
  });

  describe('> when JSON replacer is set', () => {
    it('should replace JSON', () => {
      const file = path.join(TEST_DIR, 'somefile.json');
      const sillyReplacer = function (k, v) {
        if (!(v instanceof RegExp)) return v;
        return `regex:${v.toString()}`;
      };

      const obj = {
        name: 'jp',
        reg: /hello/g,
      };

      jf.writeFileSync(file, obj, { replacer: sillyReplacer });
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      expect(data.name).toBe('jp');
      expect(typeof data.reg).toBe('string');
      expect(data.reg).toBe('regex:/hello/g');
    });
  });

  describe('> when spaces passed as an option', () => {
    it('should write file with spaces', () => {
      const file = path.join(TEST_DIR, 'somefile.json');
      const obj = { name: 'JP' };
      jf.writeFileSync(file, obj, { spaces: 8 });
      const data = fs.readFileSync(file, 'utf8');
      expect(data).toBe(`${JSON.stringify(obj, null, 8)}\n`);
    });

    it('should use EOL override', () => {
      const file = path.join(TEST_DIR, 'somefile.json');
      const obj = { name: 'JP' };
      jf.writeFileSync(file, obj, { spaces: 2, EOL: '***' });
      const data = fs.readFileSync(file, 'utf8');
      expect(data).toBe('{***  "name": "JP"***}***');
    });
  });

  describe('> when passing encoding string as options', () => {
    it('should not error', () => {
      const file = path.join(TEST_DIR, 'somefile6.json');
      const obj = { name: 'jp' };
      jf.writeFileSync(file, obj, 'utf8');
      const data = fs.readFileSync(file, 'utf8');
      expect(data).toBe(`${JSON.stringify(obj)}\n`);
    });
  });
  describe('> when EOF option is set to a falsey value', () => {
    beforeEach(() => {
      TEST_DIR = path.join(os.tmpdir(), 'jsonfile-tests-writefile-sync');
      rimraf.sync(TEST_DIR);
      fs.mkdirSync(TEST_DIR);
    });

    afterEach(done => {
      rimraf.sync(TEST_DIR);
      done();
    });

    it('should not have a the EOL symbol at the end of file', done => {
      const file = path.join(TEST_DIR, 'somefile2.json');
      const obj = { name: 'jp' };
      jf.writeFileSync(file, obj, { finalEOL: false });
      const rawData = fs.readFileSync(file, 'utf8');
      const data = JSON.parse(rawData);
      expect(rawData[rawData.length - 1]).toBe('}');
      expect(data.name).toBe(obj.name);
      done();
    });

    it('should have a the EOL symbol at the end of file when finalEOL is a truth value in options', done => {
      const file = path.join(TEST_DIR, 'somefile2.json');
      const obj = { name: 'jp' };
      jf.writeFileSync(file, obj, { finalEOL: true });
      const rawData = fs.readFileSync(file, 'utf8');
      const data = JSON.parse(rawData);
      expect(rawData[rawData.length - 1]).toBe('\n');
      expect(data.name).toBe(obj.name);
      done();
    });
  });
});
