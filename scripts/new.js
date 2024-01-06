// Load Deps
import fs from 'fs-extra';
import prompts from 'prompts';
import { execSync } from 'child_process';

(async () => {
  // Question the user
  const { humanName, npmName, description, buildPkgStep, useJest, entrypoint } =
    await prompts([
      {
        name: 'humanName',
        type: 'text',
        min: 1,
        message: 'Enter Human Package Name',
      },
      {
        name: 'npmName',
        type: 'text',
        min: 1,
        message: 'Enter Npm Package Name',
        initial: l => `@3xpo/${l.toLowerCase().replace(/[^a-z0-9-]/giu, '-')}`,
        validate: v =>
          /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(v),
      },
      {
        name: 'description',
        type: 'text',
        initial: 'No Package Description Yet',
        message: 'Enter Description',
      },
      {
        name: 'entrypoint',
        type: 'text',
        initial: 'main.ts',
        message: 'Enter Entrypoint',
      },
      {
        name: 'buildPkgStep',
        type: 'select',
        message: 'Select Compilation Utility',
        choices: entry => [
          {
            title: 'ESBuild w/ Types',
            value: {
              scripts: {
                build: 'concurrently "npm:build:*"',
                'build:ts': 'tsc --emitDeclarationOnly',
                'build:js': `esmany --args ${JSON.stringify(
                  `${JSON.stringify(
                    `src/${entry}`,
                  )} --sourcemap --packages=external`,
                )} --platform node --format esm,cjs --bundle true --output dist/${
                  entry.split('.')[0]
                }`,
              },
            },
          },
          {
            title: 'ESBuild w/o Types',
            value: {
              scripts: {
                build: `esmany --args ${JSON.stringify(
                  `${JSON.stringify(
                    `src/${entry}`,
                  )} --sourcemap --packages=external`,
                )} --platform node --format esm,cjs --bundle true --output dist/${
                  entry.split('.')[0]
                }`,
              },
            },
          },
          {
            title: 'TSC',
            value: {
              scripts: {
                build: 'tsc',
              },
            },
          },
        ],
      },
      {
        name: 'useJest',
        type: 'confirm',
        message: 'Include Jest',
        initial: true,
      },
    ]);

  // Write a basic package file
  const pkgDir = `packages/${npmName}`,
    pkgFile = `${pkgDir}/package.json`;
  fs.ensureFileSync(pkgFile);
  fs.ensureFileSync(pkgDir + '/src/' + entrypoint);
  if (useJest) {
    const tf = pkgDir + '/src/' + entrypoint.replace(/\..?ts/, '.test.ts');
    fs.ensureFileSync(tf);
    fs.writeFileSync(
      tf,
      `describe(${JSON.stringify(npmName)}, () => {
  test.todo('Add Tests');
});
`,
    );
  }
  fs.writeFileSync(pkgFile, '{}');

  // Load pk to init
  await import('./pk.js');

  // Initialize tsc
  fs.writeFileSync(
    `${pkgDir}/tsconfig.json`,
    JSON.stringify(
      {
        $schema: 'https://json.schemastore.org/tsconfig.json',
        compilerOptions: {
          rootDir: 'src',
          outDir: 'dist',
          declaration: true,
          sourceMap: true,
          declarationMap: true,
          esModuleInterop: true,
        },
        include: ['src/**/*', 'src/*'],
        exclude: ['dist/**/*', 'dist/*', 'src/*.test.*s', 'src/**/*.test.*s'],
      },
      null,
      2,
    ),
  );

  // Update the package
  let pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));

  // Initialize file paths
  pkg.source = `./src/${entrypoint}`;
  pkg.types = `./dist/${entrypoint.replace(/(c|m|e)?(t|j)s/, 'd.ts')}`;
  pkg.main = `./dist/${entrypoint.split('.')[0]}.node.bundle.min.cjs`;
  pkg.module = `./dist/${entrypoint.split('.')[0]}.node.bundle.min.mjs`;
  pkg.typings = pkg.types;

  // Initialize exports
  pkg.exports = pkg.exports ?? {};
  pkg.exports['.'] = pkg.exports['.'] ?? {};
  Object.entries({
    types: pkg.types,
    import: pkg.module,
    require: pkg.main,
    node: pkg.module,
    default: pkg.module,
  }).forEach(([k, v]) => (pkg.exports['.'][k] = v));

  // Function for merging into package.json
  const apply = t =>
    Object.entries(t).forEach(([k, v]) => {
      if (pkg[k] === undefined || pkg[k] === null) pkg[k] = v;
      else if (typeof pkg[k] === 'object' && typeof v === 'object') {
        if (Array.isArray(v) && Array.isArray(pkg[k]))
          pkg[k] = [...pkg[k], ...v].filter((k, i, v) => v.indexOf(k) === i);
        else
          pkg[k] = {
            ...pkg[k],
            ...v,
          };
      } else pkg[k] = v;
    });

  // Apply the build steps
  apply(buildPkgStep);

  // Apply the ignorelist
  apply({
    files: [
      'dist/**/*',
      'dist/*',
      'package.json',
      'README.md',
      'tsconfig.json',
    ],
  });

  // Apply the test script
  if (useJest)
    apply({
      scripts: {
        test: 'jest',
        dev: 'nodemon --watch src -e ts,json,env --delay 50ms --exec "npm run build && npm run test"',
      },
    });

  // Initialize jest
  if (useJest)
    fs.writeFileSync(
      `${pkgDir}/jest.config.cjs`,
      `/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
`,
    );

  // Apply Package Metadata Fields
  pkg.name = npmName;
  pkg.displayName = humanName;
  pkg.description = description;

  // Write
  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));

  // Create README
  fs.writeFileSync(
    `${pkgDir}/README.md`,
    `# ${npmName}

${description}
`,
  );

  // Install Packages
  execSync(
    `${useJest ? `pnpm i -D jest @types/jest ts-jest;` : ''}
pnpm i;`,
    {
      stdio: 'inherit',
      cwd: pkgDir,
    },
  );

  // Initial Build
  execSync(`pnpm build`, {
    stdio: 'inherit',
    cwd: pkgDir,
  });
})();
