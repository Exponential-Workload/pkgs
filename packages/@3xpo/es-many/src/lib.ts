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

import { z } from 'zod';
import { generateCombinations, Combinations } from '@3xpo/combgen';

export const PlatformType = z.enum(['node', 'browser', 'neutral']);
export const Platform = PlatformType.enum;
export const FormatType = z.enum(['iife', 'cjs', 'esm']);
export const Format = FormatType.enum;

const OptObj = {
  minify: z.boolean().or(z.null()),
  bundle: z.boolean().or(z.null()),
  platform: PlatformType.or(z.null()),
  format: FormatType.or(z.null()),
  /** Output File Name - you should only pass one value for this ever - will  */
  output: z.string(),
  /** Rest Arguments shoved at the end of the command. Not sanitized. Only enabled with {@link OptObj._danger_allowRestArgs this._danger_allowRestArgs} */
  restArgs: z.string().or(z.null()).optional().default(null),
  /** Allows {@link OptObj.restArgs this.restArgs}. Dangerous. */
  _danger_allowRestArgs: z.boolean().optional().default(false),
};
const OptArrObj = Object.fromEntries(
  Object.entries(OptObj).map(([k, v]) => [k, z.array(v)]),
) as {
  [K in keyof typeof OptObj]: z.ZodArray<(typeof OptObj)[K]>;
};
export const OptionType = z.object(OptObj).partial();
export const OptionsType = z.object(OptArrObj);

export type PlatformType = z.infer<typeof PlatformType>;
export type FormatType = z.infer<typeof FormatType>;
export type OptionType = z.infer<typeof OptionType>;
export type OptionsType = z.infer<typeof OptionsType>;

export type Platform = PlatformType;
export type Format = FormatType;

export const toOutputFilename = (options: OptionType) =>
  `${options.output}${
    options.platform && options.platform !== 'neutral'
      ? `.${options.platform}`
      : ''
  }${options.bundle ? '.bundle' : ''}${options.minify ? '.min' : ''}.${
    options.format === 'iife'
      ? 'iife.cjs'
      : options.format === 'cjs'
        ? 'cjs'
        : 'mjs'
  }`;
export const optionToEsbuildArgs = (options: OptionType) => {
  const opt = OptionType.parse(options);
  return `--platform=${opt.platform ?? 'neutral'} --format=${
    opt.format ?? 'esm'
  }${opt.minify ? ' --minify' : ''}${
    opt.bundle ? ' --bundle' : ''
  } ${JSON.stringify(`--outfile=${toOutputFilename(options)}`)}${
    options._danger_allowRestArgs && options.restArgs
      ? ` ${options.restArgs}`
      : ''
  }`;
};
export const optionsToOptionsList = (opt: OptionsType) =>
  generateCombinations(opt) satisfies OptionType[] as OptionType[] &
    Combinations<OptionsType>;
export const getArgArray = (opt: OptionsType) =>
  optionsToOptionsList(opt).map(optionToEsbuildArgs);
export const getCommandArray = (opt: OptionsType) =>
  getArgArray(opt).map(args => `esbuild ${args}`);
export const getFileArray = (opt: OptionsType) =>
  optionsToOptionsList(opt).map(toOutputFilename);
export default getCommandArray;
