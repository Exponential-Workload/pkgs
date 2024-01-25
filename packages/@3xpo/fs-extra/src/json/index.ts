'use strict';

import { fromPromise } from '@3xpo/universalify';
import __jsonFile from './jsonfile';
import _outputJson from './output-json';
import _outputJsonSync from './output-json-sync';

export * from './jsonfile';

export const outputJson = fromPromise(_outputJson);
export const outputJsonSync = _outputJsonSync;
// aliases
export const outputJSON = outputJson;
export const outputJSONSync = outputJsonSync;
export const writeJSON = __jsonFile.writeJson;
export const writeJSONSync = __jsonFile.writeJsonSync;
export const readJSON = __jsonFile.readJson;
export const readJSONSync = __jsonFile.readJsonSync;

const jsonFile = {
  ...__jsonFile,
  outputJson: outputJson,
  outputJsonSync,
  // aliases
  outputJSON: outputJson,
  outputJSONSync: outputJsonSync,
  writeJSON: __jsonFile.writeJson,
  writeJSONSync: __jsonFile.writeJsonSync,
  readJSON: __jsonFile.readJson,
  readJSONSync: __jsonFile.readJsonSync,
};

export default jsonFile as typeof jsonFile & typeof __jsonFile;
