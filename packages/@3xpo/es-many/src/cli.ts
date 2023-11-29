#!/usr/bin/env node
/**!
 * MIT License
 *
 * Copyright (c) 2023 Expo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import ArgParser from '@3xpo/argparser';
import { z } from 'zod';
import getCommandArray from './lib';
const argparser = new ArgParser()
  .defineArgument({
    name: 'minify',
    aliases: ['min'],
    description: 'Minify the output',
    type: 'boolean[]',
    default: [true],
  })
  .defineArgument({
    name: 'bundle',
    aliases: [],
    description: 'Whether to bundle the output',
    type: 'boolean[]',
    default: [false],
  })
  .defineArgument({
    name: 'platform',
    aliases: [],
    description: 'Platform Choices',
    type: 'string[]',
    default: ['neutral'],
  })
  .defineArgument({
    name: 'format',
    aliases: [],
    description: 'Output Format',
    type: 'string[]',
    default: ['esm'],
  })
  .defineArgument({
    name: 'args',
    aliases: [],
    description: 'Argument List',
    type: 'string',
  })
  .defineArgument({
    name: 'output',
    aliases: [],
    description: 'Output File Base',
    type: 'string[]',
    default: ['dist/main'],
  })
  .defineArgument({
    name: 'dry',
    aliases: [],
    description: 'List the commands rather than executing them',
    type: 'boolean',
    default: false,
  })
  // .defineArgument({
  //   name: 'set-import',
  //   aliases: ['simp'],
  //   description: 'When specified, will specify the import in your package.json',
  //   type: 'string',
  //   default: '',
  // })
  .defineArgument({
    name: 'help',
    aliases: ['h'],
    description: 'Help Message',
    type: 'boolean',
    default: false,
  });

const hiddenBin = argparser.hideBin(process.argv);
const opt = argparser.parse<{
  minify: boolean[];
  bundle: boolean[];
  platform: string[];
  format: string[];
  args: string;
  output: string[];
  dry: boolean;
  help: boolean;
}>(hiddenBin);

if (opt.help || opt._.length > 0 || hiddenBin.length === 0) {
  console.log(argparser.help('esmany'));
  process.exit(0);
}

if (!z.string().safeParse(opt.args))
  throw new Error(
    'Please make sure `--args` starts with your sourcefile - e.g. `--args "src/main.ts --sourcemap --packages external"`',
  );
else if (!opt.args || opt.args?.length === 0) {
  console.error(new Error('Please pass a sourcefile into --args'));
  console.log(argparser.help());
  process.exit(1);
}
const optsObj = {
  bundle: opt.bundle || [false],
  format: opt.format || (['esm'] as any[]),
  platform: opt.platform || (['neutral'] as any[]),
  minify: opt.minify || [false],
  restArgs: [opt.args || ''],
  _danger_allowRestArgs: [true],
  output: opt.output || ['dist/main'],
};

const cmds = getCommandArray(optsObj);

if (opt.dry) console.log(cmds.join('\n'));
else {
  (async () => {
    const child = await import('child_process');
    cmds.forEach(v =>
      child.exec(
        v,
        {
          cwd: process.cwd(),
          timeout: 10e3,
        },
        (err, so, se) => {
          if (err) throw err;
          if (so) process.stdout.write(so);
          if (se) process.stdout.write(so);
        },
      ),
    );
  })();
}
