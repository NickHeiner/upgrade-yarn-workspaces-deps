#! /usr/bin/env node

const {execSync} = require('child_process');
const _ = require('lodash');
const path = require('path');
const loadJsonFile = require('load-json-file');

const {argv} = require('yargs')
  .option('pattern <regex>', {
    type: 'string',
    description: 'Regex that will be matched against the dependency name'
  })
  .demandOption('pattern')
  .option('dry', {
    type: 'boolean',
    description: 'If true, print the yarn commands that will be run, but do not actually run them.'
  });
const pattern = new RegExp(argv.pattern);

const workspaces = JSON.parse(JSON.parse(execSync('yarn workspaces info --json')).data);
const workspaceNames = Object.keys(workspaces);

_.map(workspaces, ({location}, workspaceName) => {
  const packageJson = loadJsonFile.sync(path.join(location, 'package.json'));

  const upgradeDependenciesIfNeeded = name => {
    const addModifierFlag = name === 'devDependencies' ? '--dev' : '';
    const packageInstallSpecs = _(packageJson[name])
      .keys()
      .pullAll(workspaceNames)
      .filter(depName => depName.match(pattern))
      .map(depName => `${depName}@latest`)
      .value();

    if (!packageInstallSpecs.length) {
      return;
    }

    const command = `yarn workspace ${workspaceName} add ${addModifierFlag} ${packageInstallSpecs.join(' ')}`;
    if (argv.dry) {
      console.log(command);
    } else {
      execSync(command, {
        stdio: 'inherit'
      });
    }
  };

  upgradeDependenciesIfNeeded('dependencies');
  upgradeDependenciesIfNeeded('devDependencies');
});
