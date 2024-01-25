'use strict';

import os from 'os';
import path from 'path';
import klaw from 'klaw';
import Mocha from 'mocha';
import minimist from 'minimist';

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
  .on('readable', function () {
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
      require('./src').remove(path.join(os.tmpdir(), 'fs-extra'), () =>
        process.exit(failures),
      );
    });
  });
