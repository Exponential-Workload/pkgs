import {
  OptionType,
  OptionsType,
  optionToEsbuildArgs,
  toOutputFilename,
  getCommandArray,
} from './lib';

describe('esbuild options', () => {
  test('toOutputFilename generates correct output filename', () => {
    const options: OptionType = {
      minify: true,
      bundle: false,
      platform: 'node',
      format: 'esm',
      output: 'outputFile',
      restArgs: null,
      _danger_allowRestArgs: false,
    };

    const result = toOutputFilename(options);
    expect(result).toBe('outputFile.node.min.mjs');
  });

  test('optionToEsbuildArgs generates correct esbuild arguments', () => {
    const options: OptionType = {
      minify: true,
      bundle: false,
      platform: 'node',
      format: 'esm',
      output: 'outputFile',
      restArgs: '--some-arg',
      _danger_allowRestArgs: true,
    };

    const result = optionToEsbuildArgs(options);
    expect(result).toBe(
      '--platform=node --format=esm --minify "--outfile=outputFile.node.min.mjs" --some-arg',
    );
  });

  test('getCommandArray generates correct esbuild command array', () => {
    const options: OptionsType = {
      minify: [true, false],
      bundle: [true, false],
      platform: ['node', 'browser'],
      format: ['esm', 'cjs'],
      output: ['outputFile'],
      restArgs: ['--some-arg', '--another-arg'],
      _danger_allowRestArgs: [true, false],
    };

    const result = getCommandArray(options);
    // list of known values for above:
    const known = [
      'esbuild --platform=node --format=esm --minify --bundle "--outfile=outputFile.node.bundle.min.mjs" --some-arg',
      'esbuild --platform=node --format=esm --minify --bundle "--outfile=outputFile.node.bundle.min.mjs"',
      'esbuild --platform=node --format=esm --minify --bundle "--outfile=outputFile.node.bundle.min.mjs" --another-arg',
      'esbuild --platform=node --format=esm --minify --bundle "--outfile=outputFile.node.bundle.min.mjs"',
      'esbuild --platform=node --format=cjs --minify --bundle "--outfile=outputFile.node.bundle.min.cjs" --some-arg',
      'esbuild --platform=node --format=cjs --minify --bundle "--outfile=outputFile.node.bundle.min.cjs"',
      'esbuild --platform=node --format=cjs --minify --bundle "--outfile=outputFile.node.bundle.min.cjs" --another-arg',
      'esbuild --platform=node --format=cjs --minify --bundle "--outfile=outputFile.node.bundle.min.cjs"',
      'esbuild --platform=browser --format=esm --minify --bundle "--outfile=outputFile.browser.bundle.min.mjs" --some-arg',
      'esbuild --platform=browser --format=esm --minify --bundle "--outfile=outputFile.browser.bundle.min.mjs"',
      'esbuild --platform=browser --format=esm --minify --bundle "--outfile=outputFile.browser.bundle.min.mjs" --another-arg',
      'esbuild --platform=browser --format=esm --minify --bundle "--outfile=outputFile.browser.bundle.min.mjs"',
      'esbuild --platform=browser --format=cjs --minify --bundle "--outfile=outputFile.browser.bundle.min.cjs" --some-arg',
      'esbuild --platform=browser --format=cjs --minify --bundle "--outfile=outputFile.browser.bundle.min.cjs"',
      'esbuild --platform=browser --format=cjs --minify --bundle "--outfile=outputFile.browser.bundle.min.cjs" --another-arg',
      'esbuild --platform=browser --format=cjs --minify --bundle "--outfile=outputFile.browser.bundle.min.cjs"',
      'esbuild --platform=node --format=esm --minify "--outfile=outputFile.node.min.mjs" --some-arg',
      'esbuild --platform=node --format=esm --minify "--outfile=outputFile.node.min.mjs"',
      'esbuild --platform=node --format=esm --minify "--outfile=outputFile.node.min.mjs" --another-arg',
      'esbuild --platform=node --format=esm --minify "--outfile=outputFile.node.min.mjs"',
      'esbuild --platform=node --format=cjs --minify "--outfile=outputFile.node.min.cjs" --some-arg',
      'esbuild --platform=node --format=cjs --minify "--outfile=outputFile.node.min.cjs"',
      'esbuild --platform=node --format=cjs --minify "--outfile=outputFile.node.min.cjs" --another-arg',
      'esbuild --platform=node --format=cjs --minify "--outfile=outputFile.node.min.cjs"',
      'esbuild --platform=browser --format=esm --minify "--outfile=outputFile.browser.min.mjs" --some-arg',
      'esbuild --platform=browser --format=esm --minify "--outfile=outputFile.browser.min.mjs"',
      'esbuild --platform=browser --format=esm --minify "--outfile=outputFile.browser.min.mjs" --another-arg',
      'esbuild --platform=browser --format=esm --minify "--outfile=outputFile.browser.min.mjs"',
      'esbuild --platform=browser --format=cjs --minify "--outfile=outputFile.browser.min.cjs" --some-arg',
      'esbuild --platform=browser --format=cjs --minify "--outfile=outputFile.browser.min.cjs"',
      'esbuild --platform=browser --format=cjs --minify "--outfile=outputFile.browser.min.cjs" --another-arg',
      'esbuild --platform=browser --format=cjs --minify "--outfile=outputFile.browser.min.cjs"',
      'esbuild --platform=node --format=esm --bundle "--outfile=outputFile.node.bundle.mjs" --some-arg',
      'esbuild --platform=node --format=esm --bundle "--outfile=outputFile.node.bundle.mjs"',
      'esbuild --platform=node --format=esm --bundle "--outfile=outputFile.node.bundle.mjs" --another-arg',
      'esbuild --platform=node --format=esm --bundle "--outfile=outputFile.node.bundle.mjs"',
      'esbuild --platform=node --format=cjs --bundle "--outfile=outputFile.node.bundle.cjs" --some-arg',
      'esbuild --platform=node --format=cjs --bundle "--outfile=outputFile.node.bundle.cjs"',
      'esbuild --platform=node --format=cjs --bundle "--outfile=outputFile.node.bundle.cjs" --another-arg',
      'esbuild --platform=node --format=cjs --bundle "--outfile=outputFile.node.bundle.cjs"',
      'esbuild --platform=browser --format=esm --bundle "--outfile=outputFile.browser.bundle.mjs" --some-arg',
      'esbuild --platform=browser --format=esm --bundle "--outfile=outputFile.browser.bundle.mjs"',
      'esbuild --platform=browser --format=esm --bundle "--outfile=outputFile.browser.bundle.mjs" --another-arg',
      'esbuild --platform=browser --format=esm --bundle "--outfile=outputFile.browser.bundle.mjs"',
      'esbuild --platform=browser --format=cjs --bundle "--outfile=outputFile.browser.bundle.cjs" --some-arg',
      'esbuild --platform=browser --format=cjs --bundle "--outfile=outputFile.browser.bundle.cjs"',
      'esbuild --platform=browser --format=cjs --bundle "--outfile=outputFile.browser.bundle.cjs" --another-arg',
      'esbuild --platform=browser --format=cjs --bundle "--outfile=outputFile.browser.bundle.cjs"',
      'esbuild --platform=node --format=esm "--outfile=outputFile.node.mjs" --some-arg',
      'esbuild --platform=node --format=esm "--outfile=outputFile.node.mjs"',
      'esbuild --platform=node --format=esm "--outfile=outputFile.node.mjs" --another-arg',
      'esbuild --platform=node --format=esm "--outfile=outputFile.node.mjs"',
      'esbuild --platform=node --format=cjs "--outfile=outputFile.node.cjs" --some-arg',
      'esbuild --platform=node --format=cjs "--outfile=outputFile.node.cjs"',
      'esbuild --platform=node --format=cjs "--outfile=outputFile.node.cjs" --another-arg',
      'esbuild --platform=node --format=cjs "--outfile=outputFile.node.cjs"',
      'esbuild --platform=browser --format=esm "--outfile=outputFile.browser.mjs" --some-arg',
      'esbuild --platform=browser --format=esm "--outfile=outputFile.browser.mjs"',
      'esbuild --platform=browser --format=esm "--outfile=outputFile.browser.mjs" --another-arg',
      'esbuild --platform=browser --format=esm "--outfile=outputFile.browser.mjs"',
      'esbuild --platform=browser --format=cjs "--outfile=outputFile.browser.cjs" --some-arg',
      'esbuild --platform=browser --format=cjs "--outfile=outputFile.browser.cjs"',
      'esbuild --platform=browser --format=cjs "--outfile=outputFile.browser.cjs" --another-arg',
      'esbuild --platform=browser --format=cjs "--outfile=outputFile.browser.cjs"',
    ];
    // ensure they're all present
    known.forEach(v => expect(result).toContain(v));
    // ensure the length matches
    expect(result).toHaveLength(known.length);
    // we're now certain that, assuming known is unique, the 2 arrays, excluding order, are identical
  });
});
