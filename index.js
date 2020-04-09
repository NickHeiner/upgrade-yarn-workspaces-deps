#! /usr/bin/env node

const {execSync} = require('child_process');
const _ = require('lodash');
const path = require('path');
const loadJsonFile = require('load-json-file');
const chalk = require('chalk');

const {argv} = require('yargs')
  .usage('Usage: $0 --pattern <regex> [-- flags to pass through to yarn install]')
  .strict()
  .option('pattern', {
    type: 'string',
    description: 'Regex that will be matched against the dependency name'
  })
  // This makes --pattern appear twice in the output.
  // https://github.com/yargs/yargs/issues/1604
  .demandOption('pattern')
  .option('dry', {
    type: 'boolean',
    description: 'If true, print the yarn commands that will be run, but do not actually run them.'
  })
  .option('remove', {
    type: 'boolean', 
    description: 'Remove packages instead of adding them.',
    conflicts: ['install-version']
  })
  .option('print-matching-packages', {
    type: 'boolean',
    description: 'Print all package names that will be updated, and exit without actually updating.'
  })
  .option('install-version', {
    type: 'string',
    description: 'The version to install.'
  });

const yarnArgs = argv._;
// If we specify a default value in yargs, then it'll think that "installVersion" was actually passed, and thus error 
// out when "remove" is passed, because they conflict.
const installVersion = argv.installVersion || 'latest';

const pattern = new RegExp(argv.pattern);

const workspaces = JSON.parse(JSON.parse(execSync('yarn workspaces info --json')).data);
const workspaceNames = Object.keys(workspaces);

const packageNames = _(workspaces)
  .map(({location}, workspaceName) => {
    const packageJson = loadJsonFile.sync(path.join(location, 'package.json'));

    const upgradeDependenciesIfNeeded = name => {
      const addModifierFlag = name === 'devDependencies' ? '--dev' : '';
      const packageNames = _(packageJson[name])
        .keys()
        .pullAll(workspaceNames)
        .filter(depName => depName.match(pattern))
        .value();

      const packageInstallSpecs = argv.remove 
        ? packageNames : packageNames.map(depName => `${depName}@${installVersion}`);
      if (packageInstallSpecs.length && !argv.printMatchingPackages) {
        const yarnCommand = argv.remove ? 'remove' : 'add';
        const command = 
          // eslint-disable-next-line max-len
          `yarn workspace ${workspaceName} ${yarnCommand} ${addModifierFlag} ${packageInstallSpecs.join(' ')} ${yarnArgs}`.trim();
        if (argv.dry) {
          console.log(command);
        } else {
          console.log(chalk.underline(`Executing: "${command}"`));
          execSync(command, {
            stdio: 'inherit'
          });
          // This will create an extra newline on the last line of output, but w/e.
          console.log();
        }
      }

      return packageNames;
    };

    return [
      ...upgradeDependenciesIfNeeded('dependencies'),
      ...upgradeDependenciesIfNeeded('devDependencies')
    ];
  })
  .flatten()
  .uniq()
  .value();

if (argv.printMatchingPackages && packageNames.length) {
  console.log('The following packages will be updated:');
  packageNames.forEach(package => console.log(`* ${package}`));
} else if (!packageNames.length) {
  console.log(`No packages found matching pattern ${chalk.red(pattern)}`);
}
