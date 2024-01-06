import Promi from './lib';
import {
  brotliCompress as callbackBrotliCompress,
  brotliDecompress as callbackBrotliDecompress,
} from 'zlib';
describe('@3xpo/promi', () => {
  describe('.wrapPromise', () => {
    test('brotli (zlib)', async () => {
      const brotliCompress = Promi.wrapPromise(callbackBrotliCompress);
      const brotliDecompress = Promi.wrapPromise(callbackBrotliDecompress);
      const [err, compressed] = await brotliCompress('test');
      if (err) throw err;
      const [err2, decompressed] = await brotliDecompress(compressed);
      if (err2) throw err2;
      expect(decompressed.toString()).toEqual('test');
    });
  });
  describe('.wrap', () => {
    test('brotli (zlib)', async () => {
      const brotliCompress = Promi.wrap(callbackBrotliCompress);
      const brotliDecompress = Promi.wrap(callbackBrotliDecompress);
      const compressed = await brotliCompress('test');
      expect((await brotliDecompress(compressed)).toString()).toEqual('test');
    });
  });
  describe('.call', () => {
    test('brotli (zlib)', async () => {
      const compressed = await Promi.call(callbackBrotliCompress, 'test');
      expect(
        (await Promi.call(callbackBrotliDecompress, compressed)).toString(),
      ).toEqual('test');
    });
  });
});
