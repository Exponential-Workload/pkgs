import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import * as rimraf from 'rimraf';
import jf from '../';

/* global describe it beforeEach afterEach */

describe('+ writeFile()', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'jsonfile-tests-writefile');
    rimraf.sync(TEST_DIR);
    fs.mkdirSync(TEST_DIR);
  });

  afterEach(done => {
    rimraf.sync(TEST_DIR);
    done();
  });

  it('should serialize and write JSON', done => {
    const file = path.join(TEST_DIR, 'somefile2.json');
    const obj = { name: 'JP' };

    jf.writeFile(file, obj)
      .then(() => {
        fs.readFile(file, 'utf8', (err, data) => {
          expect(err).toBeFalsy();
          const obj2 = JSON.parse(data);
          expect(obj2.name).toBe(obj.name);

          // verify EOL
          expect(data[data.length - 1]).toBe('\n');
          done();
        });
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should write JSON, resolve promise', done => {
    const file = path.join(TEST_DIR, 'somefile2.json');
    const obj = { name: 'JP' };

    jf.writeFile(file, obj)
      .then(res => {
        fs.readFile(file, 'utf8', (err, data) => {
          expect(err).toBeFalsy();
          const obj2 = JSON.parse(data);
          expect(obj2.name).toBe(obj.name);

          // verify EOL
          expect(data[data.length - 1]).toBe('\n');
          done();
        });
      })
      .catch(err => {
        expect(err).toBeFalsy();
        done();
      });
  });

  describe('> when JSON replacer is set', () => {
    let file, sillyReplacer, obj;

    beforeEach(() => {
      file = path.join(TEST_DIR, 'somefile.json');
      sillyReplacer = function (k, v) {
        if (!(v instanceof RegExp)) return v;
        return `regex:${v.toString()}`;
      };

      obj = {
        name: 'jp',
        reg: /hello/g,
      };
    });

    it('should replace JSON', done => {
      jf.writeFile(file, obj, { replacer: sillyReplacer }, err => {
        expect(err).toBeFalsy();

        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        expect(data.name).toBe('jp');
        expect(typeof data.reg).toBe('string');
        expect(data.reg).toBe('regex:/hello/g');
        done();
      });
    });

    it('should replace JSON, resolve promise', done => {
      jf.writeFile(file, obj, { replacer: sillyReplacer })
        .then(res => {
          const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
          expect(data.name).toBe('jp');
          expect(typeof data.reg).toBe('string');
          expect(data.reg).toBe('regex:/hello/g');
          done();
        })
        .catch(err => {
          expect(err).toBeFalsy();
          done();
        });
    });
  });

  describe('> when spaces passed as an option', () => {
    let file, obj;
    beforeEach(() => {
      file = path.join(TEST_DIR, 'somefile.json');
      obj = { name: 'jp' };
    });

    it('should write file with spaces', done => {
      jf.writeFile(file, obj, { spaces: 8 }, err => {
        expect(err).toBeFalsy();
        const data = fs.readFileSync(file, 'utf8');
        expect(data).toBe(`${JSON.stringify(obj, null, 8)}\n`);
        done();
      });
    });

    it('should write file with spaces, resolve the promise', done => {
      jf.writeFile(file, obj, { spaces: 8 })
        .then(res => {
          const data = fs.readFileSync(file, 'utf8');
          expect(data).toBe(`${JSON.stringify(obj, null, 8)}\n`);
          done();
        })
        .catch(err => {
          expect(err).toBeFalsy();
          done();
        });
    });
  });

  describe('> when spaces, EOL are passed as options', () => {
    let file, obj;
    beforeEach(() => {
      file = path.join(TEST_DIR, 'somefile.json');
      obj = { name: 'jp' };
    });

    it('should use EOL override', done => {
      jf.writeFile(file, obj, { spaces: 2, EOL: '***' }, err => {
        expect(err).toBeFalsy();
        const data = fs.readFileSync(file, 'utf8');
        expect(data).toBe('{***  "name": "jp"***}***');
        done();
      });
    });

    it('should use EOL override, resolve the promise', done => {
      jf.writeFile(file, obj, { spaces: 2, EOL: '***' })
        .then(res => {
          const data = fs.readFileSync(file, 'utf8');
          expect(data).toBe('{***  "name": "jp"***}***');
          done();
        })
        .catch(err => {
          expect(err).toBeFalsy();
          done();
        });
    });
  });
  describe('> when passing encoding string as options', () => {
    let file, obj;
    beforeEach(() => {
      file = path.join(TEST_DIR, 'somefile.json');
      obj = { name: 'jp' };
    });

    it('should not error', async () => {
      await jf.writeFile(file, obj, {
        encoding: 'utf-8',
      });
      const data = fs.readFileSync(file, 'utf8');
      expect(data).toBe(`${JSON.stringify(obj)}\n`);
    });

    it('should not error, resolve the promise', done => {
      jf.writeFile(file, obj, {
        encoding: 'utf-8',
      })
        .then(res => {
          const data = fs.readFileSync(file, 'utf8');
          expect(data).toBe(`${JSON.stringify(obj)}\n`);
          done();
        })
        .catch(err => {
          expect(err).toBeFalsy();
          done();
        });
    });
  });

  describe('> when EOF option is set to a falsey value', () => {
    beforeEach(() => {
      TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'jsonfile-tests-writefile');
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
      jf.writeFile(file, obj, { finalEOL: false }, err => {
        expect(err).toBeFalsy();
        fs.readFile(file, 'utf8', (_, rawData) => {
          const data = JSON.parse(rawData);
          expect(rawData[rawData.length - 1]).toBe('}');
          expect(data.name).toBe(obj.name);
          done();
        });
      });
    });

    it('should have a the EOL symbol at the end of file when finalEOL is a truth value in options', done => {
      const file = path.join(TEST_DIR, 'somefile2.json');
      const obj = { name: 'jp' };
      jf.writeFile(file, obj, { finalEOL: true }, err => {
        expect(err).toBeFalsy();
        fs.readFile(file, 'utf8', (_, rawData) => {
          const data = JSON.parse(rawData);
          expect(rawData[rawData.length - 1]).toBe('\n');
          expect(data.name).toBe(obj.name);
          done();
        });
      });
    });
  });

  // Prevent https://github.com/jprichardson/node-jsonfile/issues/81 from happening
  describe("> when callback isn't passed & can't serialize", () => {
    it('should not write an empty file, should reject the promise', async () => {
      const file = path.join(TEST_DIR, 'somefile.json');
      const obj1 = { name: 'JP', circular: null as any };
      const obj2 = { person: obj1 };
      obj1.circular = obj2;

      expect(
        await jf
          .writeFile(file, obj1)
          .then(() => false)
          .catch(err => {
            expect(err).toBeTruthy();
            expect(!fs.existsSync(file)).toBeTruthy();
            return true;
          }),
      ).toEqual(true);
    });
  });
});
