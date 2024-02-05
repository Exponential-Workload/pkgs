'use strict';

/* eslint-env mocha */

import assert from 'assert';
import fse from '..';

const methods = [
  'emptyDir',
  'ensureFile',
  'ensureDir',
  'mkdirs',
  'readJson',
  'readJSON',
  'remove',
];

describe('promise support', () => {
  methods.forEach(method => {
    it(method, done => {
      fse[method]().catch(() => done());
    });
  });

  it('provides fse.promises API', () => {
    expect(fse.promises).toBeTruthy();
    expect(typeof fse.promises.writeFile).toStrictEqual('function');
  });
});
