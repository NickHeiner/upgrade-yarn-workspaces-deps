#! /usr/bin/env node

const {execSync} = require('child_process');
const _ = require('lodash');
const path = require('path');
const loadJsonFile = require('load-json-file');

const {argv} = require('yargs')
  .option('pattern <regex>', {
    type: 'regex',
    description: 'Regex that will be matched against the dependency name'
  })
  .option('dry', {
    type: 'boolean',
    description: 'If true, print the yarn commands that will be run, but do not actually run them.'
  });

const workspaces = JSON.parse(execSync('yarn workspaces info'));

workspaces.map(({location}, workspaceName) => {
  const packageJson = loadJsonFile.sync(path.join(location, 'package.json'));

  const updateDependenciesIfNeeded = name => {
    const addModifierFlag = name === 'devDependencies' ? '--dev' : '';
    _(packageJson[name])
      .values()
      .filter(depName => depName.match(argv.pattern))
      .forEach(depName => {
        const command = `yarn workspace ${workspaceName} add ${addModifierFlag} ${depName}@latest`;
        if (argv.dry) {
          console.log(command);
        } else {
          execSync(command, {
            stdio: 'inherit'
          });
        }
      })
      .value();
  };

  updateDependenciesIfNeeded('dependencies');
  updateDependenciesIfNeeded('devDependencies');
});
