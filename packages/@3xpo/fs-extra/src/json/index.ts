'use strict';

import { fromPromise } from '@3xpo/universalify';
import __jsonFile from './jsonfile';
import outputJson from './output-json';
import outputJsonSync from './output-json-sync';

const jsonFile = {
  ...__jsonFile,
  outputJson: fromPromise(outputJson),
  outputJsonSync,
  // aliases
  outputJSON: fromPromise(outputJson),
  outputJSONSync: outputJsonSync,
  writeJSON: __jsonFile.writeJson,
  writeJSONSync: __jsonFile.writeJsonSync,
  readJSON: __jsonFile.readJson,
  readJSONSync: __jsonFile.readJsonSync,
};

export default jsonFile;
