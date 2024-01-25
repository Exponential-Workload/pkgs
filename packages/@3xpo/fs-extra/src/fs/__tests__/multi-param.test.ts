'use strict';
/* eslint-env mocha */
import assert from 'assert';
import path from 'path';
import crypto from 'crypto';
import * as os from 'os';
import fs from '../../index';
import { PathLike } from 'fs';

const SIZE = 1000;

describe('fs.read()', () => {
  let TEST_FILE;
  let TEST_DATA;
  let TEST_FD;

  beforeEach(async () => {
    TEST_FILE = path.join(os.tmpdir(), 'fs-extra', 'read-test-file');
    TEST_DATA = crypto.randomBytes(SIZE);
    fs.writeFileSync(TEST_FILE, TEST_DATA);
    TEST_FD = fs.openSync(TEST_FILE, 'r');
  });

  afterEach(async () => {
    await fs.close(TEST_FD);
    return await fs.remove(TEST_FILE);
  });

  describe('with promises', () => {
    it('returns an object', async () => {
      const results = await fs.read(TEST_FD, Buffer.alloc(SIZE), 0, SIZE, 0);
      const bytesRead = results.bytesRead;
      const buffer = results.buffer;
      assert.strictEqual(bytesRead, SIZE, 'bytesRead is correct');
      assert(buffer.equals(TEST_DATA), 'data is correct');
    });

    it('returns an object when position is not set', async () => {
      const results = await fs.read(TEST_FD, Buffer.alloc(SIZE), 0, SIZE);
      const bytesRead = results.bytesRead;
      const buffer = results.buffer;
      assert.strictEqual(bytesRead, SIZE, 'bytesRead is correct');
      assert(buffer.equals(TEST_DATA), 'data is correct');
    });
  });

  describe('with callbacks', () => {
    it('works', done => {
      fs.read(
        TEST_FD,
        Buffer.alloc(SIZE),
        0,
        SIZE,
        0,
        (err, bytesRead, buffer) => {
          assert.ifError(err);
          assert.strictEqual(bytesRead, SIZE, 'bytesRead is correct');
          assert(buffer.equals(TEST_DATA), 'data is correct');
          done();
        },
      );
    });

    it('works when position is null', done => {
      fs.read(
        TEST_FD,
        Buffer.alloc(SIZE),
        0,
        SIZE,
        null,
        (err, bytesRead, buffer) => {
          assert.ifError(err);
          assert.strictEqual(bytesRead, SIZE, 'bytesRead is correct');
          assert(buffer.equals(TEST_DATA), 'data is correct');
          done();
        },
      );
    });
  });
});

describe('fs.write()', () => {
  let TEST_FILE: string;
  let TEST_DATA: Buffer;
  let TEST_FD: number;

  beforeEach(async () => {
    TEST_FILE = path.join(os.tmpdir(), 'fs-extra', 'write-test-file');
    TEST_DATA = crypto.randomBytes(SIZE);
    fs.ensureDirSync(path.dirname(TEST_FILE));
    TEST_FD = fs.openSync(TEST_FILE, 'w');
  });

  afterEach(async () => {
    await fs.close(TEST_FD);
    return await fs.remove(TEST_FILE);
  });

  describe('with callbacks', () => {
    it('works', done => {
      fs.write(TEST_FD, TEST_DATA, 0, SIZE, 0, (err, bytesWritten, buffer) => {
        assert.ifError(err);
        assert.strictEqual(bytesWritten, SIZE, 'bytesWritten is correct');
        assert(Buffer.from(buffer).equals(TEST_DATA), 'data is correct');
        done();
      });
    });

    it('works when minimal arguments are passed', done => {
      fs.write(
        TEST_FD,
        TEST_DATA,
        undefined,
        undefined,
        undefined,
        (err, bytesWritten, buffer) => {
          assert.ifError(err);
          assert.strictEqual(bytesWritten, SIZE, 'bytesWritten is correct');
          assert(Buffer.from(buffer).equals(TEST_DATA), 'data is correct');
          done();
        },
      );
    });

    it('works when writing a string', async () => {
      const message = 'Hello World!';
      const rs = await fs.write(TEST_FD, message);
      expect(rs.written).toEqual(message.length);
      expect(rs.bufferOrString).toStrictEqual('data is correct');
    });
  });
});

describe('fs.readv()', () => {
  let TEST_FILE;
  let TEST_DATA;
  let TEST_FD;

  beforeEach(async () => {
    TEST_FILE = path.join(os.tmpdir(), 'fs-extra', 'readv-test-file');
    TEST_DATA = crypto.randomBytes(SIZE);
    fs.writeFileSync(TEST_FILE, TEST_DATA);
    TEST_FD = fs.openSync(TEST_FILE, 'r');
  });

  afterEach(async () => {
    await fs.close(TEST_FD);
    return await fs.remove(TEST_FILE);
  });

  describe('with promises', () => {
    it('returns an object', async () => {
      const bufferArray = [Buffer.alloc(SIZE / 2), Buffer.alloc(SIZE / 2)];
      await Promise.resolve(void 0);
      const { bytesRead, buffers } = await (fs.readv(
        TEST_FD,
        bufferArray,
        0 as any,
      ) as Promise<{
        bytesRead: number;
        buffers: ArrayBufferView[];
      }>);
      assert.strictEqual(bytesRead, SIZE, 'bytesRead is correct');
      assert.deepStrictEqual(
        buffers,
        bufferArray,
        'returned data matches mutated input param',
      );
      assert.deepStrictEqual(
        Buffer.concat(buffers),
        TEST_DATA,
        'data is correct',
      );
    });

    it('returns an object when minimal arguments are passed', async () => {
      const bufferArray = [Buffer.alloc(SIZE / 2), Buffer.alloc(SIZE / 2)];
      const { bytesRead, buffers } = await fs.readv(TEST_FD, bufferArray);
      assert.strictEqual(bytesRead, SIZE, 'bytesRead is correct');
      assert.deepStrictEqual(
        buffers,
        bufferArray,
        'returned data matches mutated input param',
      );
      assert.deepStrictEqual(
        Buffer.concat(buffers),
        TEST_DATA,
        'data is correct',
      );
    });
  });

  describe('with callbacks', () => {
    it('works', done => {
      const bufferArray = [Buffer.alloc(SIZE / 2), Buffer.alloc(SIZE / 2)];
      fs.readv(TEST_FD, bufferArray, 0, (err, bytesRead, buffers) => {
        assert.ifError(err);
        assert.strictEqual(bytesRead, SIZE, 'bytesRead is correct');
        assert.deepStrictEqual(
          buffers,
          bufferArray,
          'returned data matches mutated input param',
        );
        assert.deepStrictEqual(
          Buffer.concat(buffers),
          TEST_DATA,
          'data is correct',
        );
        done();
      });
    });

    it('works when minimal arguments are passed', done => {
      const bufferArray = [Buffer.alloc(SIZE / 2), Buffer.alloc(SIZE / 2)];
      fs.readv(TEST_FD, bufferArray, undefined, (err, bytesRead, buffers) => {
        assert.ifError(err);
        assert.strictEqual(bytesRead, SIZE, 'bytesRead is correct');
        assert.deepStrictEqual(
          buffers,
          bufferArray,
          'returned data matches mutated input param',
        );
        assert.deepStrictEqual(
          Buffer.concat(buffers),
          TEST_DATA,
          'data is correct',
        );
        done();
      });
    });
  });
});

describe('fs.writev()', () => {
  let TEST_FILE: string;
  let TEST_DATA: Buffer[] | NodeJS.ArrayBufferView[];
  let TEST_FD: number;

  beforeEach(async () => {
    TEST_FILE = path.join(os.tmpdir(), 'fs-extra', 'writev-test-file');
    TEST_DATA = [crypto.randomBytes(SIZE / 2), crypto.randomBytes(SIZE / 2)];
    fs.ensureDirSync(path.dirname(TEST_FILE));
    TEST_FD = fs.openSync(TEST_FILE, 'w');
  });

  afterEach(async () => {
    await fs.close(TEST_FD);
    return await fs.remove(TEST_FILE);
  });

  describe('with promises', () => {
    it('returns an object', async () => {
      const { bytesWritten, buffers } = await fs.writev(TEST_FD, TEST_DATA, 0);
      assert.strictEqual(bytesWritten, SIZE, 'bytesWritten is correct');
      assert.deepStrictEqual(buffers, TEST_DATA, 'data is correct');
    });

    it('returns an object when minimal arguments are passed', async () => {
      const { bytesWritten, buffers } = await fs.writev(TEST_FD, TEST_DATA);
      assert.strictEqual(bytesWritten, SIZE, 'bytesWritten is correct');
      assert.deepStrictEqual(buffers, TEST_DATA, 'data is correct');
    });
  });

  describe('with callbacks', () => {
    it('works', done => {
      fs.writev(TEST_FD, TEST_DATA, 0, (err, bytesWritten, buffers) => {
        assert.ifError(err);
        assert.strictEqual(bytesWritten, SIZE, 'bytesWritten is correct');
        assert.deepStrictEqual(buffers, TEST_DATA, 'data is correct');
        done();
      });
    });

    it('works when minimal arguments are passed', done => {
      fs.writev(TEST_FD, TEST_DATA, undefined, (err, bytesWritten, buffers) => {
        assert.ifError(err);
        assert.strictEqual(bytesWritten, SIZE, 'bytesWritten is correct');
        assert.deepStrictEqual(buffers, TEST_DATA, 'data is correct');
        done();
      });
    });
  });
});
