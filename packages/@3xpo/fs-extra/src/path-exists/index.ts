'use strict';
import * as fs from '../fs';

export const pathExists = async (path: string) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

export const pathExistsSync = fs.existsSync;
