'use strict';

import { fromPromise } from '@3xpo/universalify';
import jsonFile from './jsonfile';

jsonFile.outputJson = fromPromise(require('./output-json'));
jsonFile.outputJsonSync = require('./output-json-sync');
// aliases
jsonFile.outputJSON = jsonFile.outputJson;
jsonFile.outputJSONSync = jsonFile.outputJsonSync;
jsonFile.writeJSON = jsonFile.writeJson;
jsonFile.writeJSONSync = jsonFile.writeJsonSync;
jsonFile.readJSON = jsonFile.readJson;
jsonFile.readJSONSync = jsonFile.readJsonSync;

export default jsonFile;
