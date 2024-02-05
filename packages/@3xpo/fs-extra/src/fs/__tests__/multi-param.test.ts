'use strict';
/* eslint-env mocha */
import path from 'path';
import crypto from 'crypto';
import * as os from 'os';
import fs from '../../index';

const arrayBufferViewToUInt8Array = (buffers: ArrayBufferView[]) =>
  buffers.map(view =>
    view instanceof Uint8Array
      ? view
      : new Uint8Array(
          view.buffer,
          view.byteOffset,
          view.byteLength / Uint8Array.BYTES_PER_ELEMENT,
        ),
  );

const SIZE = 1000;

describe('fs.read()', () => {
  let TEST_FILE: string;
  let TEST_DATA: Buffer;
  let TEST_FD: number;

  beforeEach(async () => {
    TEST_FILE = path.join(os.tmpdir(), 'fs-extra-test-suite', 'read-test-file');
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
      expect(bytesRead).toBe(SIZE);
      expect(buffer.equals(TEST_DATA)).toBeTruthy();
    });

    it('returns an object when position is not set', async () => {
      const results = await fs.read(TEST_FD, Buffer.alloc(SIZE), 0, SIZE);
      const bytesRead = results.bytesRead;
      const buffer = results.buffer;
      expect(bytesRead).toBe(SIZE);
      expect(buffer.equals(TEST_DATA)).toBeTruthy();
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
          expect(err).toBeFalsy();
          expect(bytesRead).toBe(SIZE);
          expect(buffer.equals(TEST_DATA)).toBeTruthy();
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
          expect(err).toBeFalsy();
          expect(bytesRead).toBe(SIZE);
          expect(buffer.equals(TEST_DATA)).toBeTruthy();
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
    TEST_FILE = path.join(
      os.tmpdir(),
      'fs-extra-test-suite',
      'write-test-file',
    );
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
        expect(err).toBeFalsy();
        expect(bytesWritten).toBe(SIZE);
        expect(Buffer.from(buffer).equals(TEST_DATA)).toBeTruthy();
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
          expect(err).toBeFalsy();
          expect(bytesWritten).toBe(SIZE);
          expect(Buffer.from(buffer).equals(TEST_DATA)).toBeTruthy();
          done();
        },
      );
    });

    it('works when writing a string', async () => {
      const message = 'Hello World!';
      const rs = await fs.write(TEST_FD, message);
      expect(rs.written).toEqual(message.length);
      expect(rs.bufferOrString).toStrictEqual(message);
    });
  });
});

describe('fs.readv()', () => {
  let TEST_FILE: string;
  let TEST_DATA: string | Buffer | NodeJS.ArrayBufferView;
  let TEST_FD: number;

  beforeEach(async () => {
    TEST_FILE = path.join(
      os.tmpdir(),
      'fs-extra-test-suite',
      'readv-test-file',
    );
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
      expect(bytesRead).toBe(SIZE);
      expect(buffers).toStrictEqual(bufferArray);
      expect(Buffer.concat(arrayBufferViewToUInt8Array(buffers))).toStrictEqual(
        TEST_DATA,
      );
    });

    it('returns an object when minimal arguments are passed', async () => {
      const bufferArray = [Buffer.alloc(SIZE / 2), Buffer.alloc(SIZE / 2)];
      const { bytesRead, buffers } = await fs.readv(TEST_FD, bufferArray);
      expect(bytesRead).toBe(SIZE);
      expect(buffers).toStrictEqual(bufferArray);
      expect(Buffer.concat(arrayBufferViewToUInt8Array(buffers))).toStrictEqual(
        TEST_DATA,
      );
    });
  });

  describe('with callbacks', () => {
    it('works', done => {
      const bufferArray = [Buffer.alloc(SIZE / 2), Buffer.alloc(SIZE / 2)];
      fs.readv(TEST_FD, bufferArray, 0, (err, bytesRead, buffers) => {
        expect(err).toBeFalsy();
        expect(bytesRead).toBe(SIZE);
        expect(buffers).toStrictEqual(bufferArray);
        expect(
          Buffer.concat(arrayBufferViewToUInt8Array(buffers)),
        ).toStrictEqual(TEST_DATA);
        done();
      });
    });

    it('works when minimal arguments are passed', done => {
      const bufferArray = [Buffer.alloc(SIZE / 2), Buffer.alloc(SIZE / 2)];
      fs.readv(TEST_FD, bufferArray, undefined, (err, bytesRead, buffers) => {
        expect(err).toBeFalsy();
        expect(bytesRead).toBe(SIZE);
        expect(buffers).toStrictEqual(bufferArray);
        expect(
          Buffer.concat(arrayBufferViewToUInt8Array(buffers)),
        ).toStrictEqual(TEST_DATA);
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
    TEST_FILE = path.join(
      os.tmpdir(),
      'fs-extra-test-suite',
      'writev-test-file',
    );
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
      expect(bytesWritten).toBe(SIZE);
      expect(buffers).toStrictEqual(TEST_DATA);
    });

    it('returns an object when minimal arguments are passed', async () => {
      const { bytesWritten, buffers } = await fs.writev(TEST_FD, TEST_DATA);
      expect(bytesWritten).toBe(SIZE);
      expect(buffers).toStrictEqual(TEST_DATA);
    });
  });

  describe('with callbacks', () => {
    it('works', done => {
      fs.writev(TEST_FD, TEST_DATA, 0, (err, bytesWritten, buffers) => {
        expect(err).toBeFalsy();
        expect(bytesWritten).toBe(SIZE);
        expect(buffers).toStrictEqual(TEST_DATA);
        done();
      });
    });

    it('works when minimal arguments are passed', done => {
      fs.writev(TEST_FD, TEST_DATA, undefined, (err, bytesWritten, buffers) => {
        expect(err).toBeFalsy();
        expect(bytesWritten).toBe(SIZE);
        expect(buffers).toStrictEqual(TEST_DATA);
        done();
      });
    });
  });
});
