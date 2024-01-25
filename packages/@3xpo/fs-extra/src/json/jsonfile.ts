'use strict';

import jsonFile from '../jsonfile';

export const readJson = jsonFile.readFile;
export const readJsonSync = jsonFile.readFileSync;
export const writeJson = jsonFile.writeFile;
export const writeJsonSync = jsonFile.writeFileSync;

export default {
  // jsonfile exports
  readJson: jsonFile.readFile,
  readJsonSync: jsonFile.readFileSync,
  writeJson: jsonFile.writeFile,
  writeJsonSync: jsonFile.writeFileSync,
};
