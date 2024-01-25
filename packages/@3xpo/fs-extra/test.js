'use strict';

import 'ts-node/register';

import os from 'os';
import path from 'path';
import klaw from 'klaw';
import Mocha from 'mocha';
import minimist from 'minimist';
import src from './dist/lib.node.bundle.min.mjs';

const argv = minimist(process.argv.slice(2));

const mochaOpts = {
  ui: 'bdd',
  reporter: 'dot',
  timeout: 30000,
  ...argv,
};

const mocha = new Mocha(mochaOpts);
const testExt = '.test.js';

klaw('./src')
  .on('readable', () => {
    let item;
    while ((item = this.read())) {
      if (!item.stats.isFile()) return;
      if (item.path.lastIndexOf(testExt) !== item.path.length - testExt.length)
        return;
      mocha.addFile(item.path);
    }
  })
  .on('end', () => {
    mocha.run(failures => {
      src.remove(path.join(os.tmpdir(), 'fs-extra'), () =>
        process.exit(failures),
      );
    });
  });
